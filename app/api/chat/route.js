import { NextResponse } from 'next/server';
import { CHATBOT_SYSTEM_PROMPT } from '@/constants/chatbotKnowledge.js';
import { siteUrl } from '@/server/siteUrl.js';

// Website chatbot: forwards the visitor's conversation, plus the KailVarn
// knowledge prompt, to OpenRouter's OpenAI-compatible chat API. The API key
// stays server-side -- never sent to the browser. History and message length
// are capped to keep each call small.
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 1000;
// Replies run about 100 tokens; this leaves room for a longer answer
// without letting one call run on.
const MAX_OUTPUT_TOKENS = 500;
// Its own variable rather than CHATBOT_MODEL, which still holds the previous
// provider's model names -- OpenRouter would reject those.
const DEFAULT_MODELS = 'apodex/apodex-1.1-mini:free';

// Basic per-IP rate limit (in memory; resets on restart) so one visitor
// can't burn through the API quota.
const RATE_LIMIT = { windowMs: 60_000, max: 12 };
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const messages = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
    .filter((m) => m.content)
    .slice(-MAX_HISTORY_MESSAGES);
  if (!messages.length || messages[messages.length - 1].role !== 'user') return null;
  return messages;
}

export async function POST(request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is not configured on the server.' }, { status: 500 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages — please wait a minute and try again.' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const messages = cleanMessages(body?.messages);
  if (!messages) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Free models are rate-limited, so OPENROUTER_MODEL may list several
  // (comma-separated): if one is rate-limited or down, the next is tried.
  const models = (process.env.OPENROUTER_MODEL || DEFAULT_MODELS).split(',').map((m) => m.trim()).filter(Boolean);
  for (const model of models) {
    const result = await askModel({ apiKey, model, messages });
    if (result.reply) return NextResponse.json({ reply: result.reply });
    console.error(`[chat] ${model} failed:`, result.status, result.detail);
    if (result.status && result.status < 500 && result.status !== 429) break; // bad key/request: other models won't help
  }
  return NextResponse.json(
    { error: 'The assistant is busy right now. Please try again in a minute, or call/WhatsApp 8460150027.' },
    { status: 503 }
  );
}

async function askModel({ apiKey, model, messages }) {
  let apiRes;
  try {
    apiRes = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // Optional OpenRouter attribution headers.
        'HTTP-Referer': siteUrl(),
        'X-Title': 'KailVarn',
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.3,
        // With reasoning on, the model spent ~1,150 tokens thinking, took 5.8s
        // and its answer was cut off mid-sentence. Off: 1.3s and a complete,
        // accurate reply. A short FAQ-style chat doesn't need it.
        reasoning: { enabled: false },
        messages: [{ role: 'system', content: CHATBOT_SYSTEM_PROMPT }, ...messages],
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    return { status: 0, detail: err?.message };
  }
  const data = await apiRes.json().catch(() => null);
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (apiRes.ok && reply) return { reply };
  return { status: apiRes.status, detail: JSON.stringify(data?.error || data)?.slice(0, 300) };
}
