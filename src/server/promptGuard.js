import 'server-only';

// Lightweight prompt-injection filter for the website chatbot. Catches the
// most common jailbreak patterns — "ignore all previous instructions",
// "you are now ...", "act as ...", DAN-style attacks, etc. Not bulletproof
// (nothing is against a determined adversary), but raises the bar well
// above casual abuse.

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior|earlier|my|your|the)\s+(instructions|rules|prompts?|guidelines|directions|context)/i,
  /disregard\s+(all\s+)?(previous|above|prior|earlier|your)\s+(instructions|rules|prompts?)/i,
  /you\s+are\s+now\s+(a|an|my|the)\b/i,
  /from\s+now\s+on\s+you\s+are/i,
  /act\s+as\s+(if\s+you\s+(are|were)\s+)?(a|an)\b/i,
  /pretend\s+(to\s+be|you\s+are|you're)/i,
  /roleplay\s+as/i,
  /forget\s+(everything|all|your\s+(instructions|rules|training|prompt))/i,
  /new\s+(instructions?|rules?|prompt)\s*:/i,
  /system\s*prompt/i,
  /reveal\s+(your|the)\s+(instructions|prompt|rules)/i,
  /what\s+(are|is)\s+your\s+(instructions|system\s*prompt|rules)/i,
  /\bDAN\b/,          // "Do Anything Now" jailbreak
  /\bjailbreak\b/i,
  /\bdo\s+anything\s+now\b/i,
  /\bdev(eloper)?\s+mode\b/i,
  /\boverride\s+(mode|instructions|rules)\b/i,
];

/**
 * Returns `true` if the text looks like a prompt injection attempt.
 */
export function hasPromptInjection(text) {
  if (typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some((p) => p.test(text));
}
