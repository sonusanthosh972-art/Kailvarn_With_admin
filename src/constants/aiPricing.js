// Server-side only: Gemini list prices (USD per 1M tokens) used to
// estimate what each AI call cost, for the /admin/ai-usage page. Google
// bills the real amount -- these are estimates and must be kept in sync
// with https://ai.google.dev/gemini-api/docs/pricing when prices change.
//
// gemini-3.1-flash-image was checked against the real Google bill: two
// paint-visualizer calls added ~Rs 13 to the AI Studio spend page,
// matching ~1,900 tokens per call (~$0.068) at these rates.
//
// A model set to null still has its tokens counted; only its cost shows
// as unknown until its rates are filled in.
export const AI_MODEL_PRICES = {
  'gemini-3.1-flash-image': { input: 0.5, textOutput: 3, imageOutput: 60 },
  'gemini-3.5-flash-lite': null,
  'gemini-3.8-flash': null,
};

// Rupees per US dollar, for showing estimates in INR. Override with the
// USD_TO_INR env var.
export const DEFAULT_USD_TO_INR = 88;
