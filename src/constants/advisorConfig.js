// Server-side only: which Gemini model powers the room-photo advisor, and
// how much output it's allowed to generate. gemini-2.5-flash-lite is no
// longer available to new API keys (Google's API returns 404 and points
// to gemini-3.5-flash-lite as the replacement) -- that's the cheapest
// vision-capable tier actually available to this key. maxOutputTokens is
// capped hard since the prompt already asks for a short, structured
// answer; this just bounds the worst case if the model ignores that.
export const ROOM_ADVISOR_MODEL = 'gemini-3.5-flash-lite';
export const ROOM_ADVISOR_MAX_OUTPUT_TOKENS = 500;
