import 'server-only';
import { col, isDbConfigured } from '@/server/db.js';
import { AI_MODEL_PRICES } from '@/constants/aiPricing.js';

// A log of every AI call (feature, model, tokens, estimated cost) so the
// admin can see spend on /admin/ai-usage without logging into Google.
// Stored in MongoDB rather than a file: on Vercel the server disk is
// read-only and wiped between deploys.
const COLLECTION = 'ai_usage';

// Gemini's usageMetadata splits output tokens by modality; image output
// is priced far higher than text, so it's tracked separately.
function estimateCostUsd(model, input, textOutput, imageOutput) {
  const price = AI_MODEL_PRICES[model];
  if (!price) return null;
  return (input * price.input + textOutput * price.textOutput + imageOutput * (price.imageOutput ?? price.textOutput)) / 1e6;
}

// Call after any successful Gemini generateContent response. Never
// throws -- a logging failure must not break the feature for the visitor.
export async function recordGeminiUsage(feature, model, geminiJson) {
  try {
    if (!isDbConfigured()) return;
    const meta = geminiJson?.usageMetadata || {};
    const input = meta.promptTokenCount || 0;
    const totalOutput = (meta.totalTokenCount || 0) - input;
    const imageOutput = (meta.candidatesTokensDetails || [])
      .filter((d) => d.modality === 'IMAGE')
      .reduce((sum, d) => sum + (d.tokenCount || 0), 0);
    const textOutput = Math.max(0, totalOutput - imageOutput);
    await (await col(COLLECTION)).insertOne({
      at: new Date(),
      feature,
      model,
      input,
      textOutput,
      imageOutput,
      costUsd: estimateCostUsd(model, input, textOutput, imageOutput),
    });
  } catch (err) {
    console.error('[ai-usage] could not record usage:', err?.message);
  }
}

// Entries since `from` (a Date), oldest first.
export async function readUsageEntries(from) {
  if (!isDbConfigured()) return [];
  return (await col(COLLECTION))
    .find(from ? { at: { $gte: from } } : {}, { projection: { _id: 0 } })
    .sort({ at: 1 })
    .toArray();
}

// Totals across every recorded call, computed in the database so the
// dashboard doesn't load the whole history.
export async function usageTotals() {
  if (!isDbConfigured()) return { calls: 0, tokens: 0, costUsd: 0, unpriced: 0 };
  const [row] = await (await col(COLLECTION)).aggregate([
    {
      $group: {
        _id: null,
        calls: { $sum: 1 },
        tokens: { $sum: { $add: ['$input', '$textOutput', '$imageOutput'] } },
        costUsd: { $sum: { $ifNull: ['$costUsd', 0] } },
        unpriced: { $sum: { $cond: [{ $eq: ['$costUsd', null] }, 1, 0] } },
      },
    },
  ]).toArray();
  return row ? { calls: row.calls, tokens: row.tokens, costUsd: row.costUsd, unpriced: row.unpriced } : { calls: 0, tokens: 0, costUsd: 0, unpriced: 0 };
}
