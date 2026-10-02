'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquareText, X, Send, Loader2 } from 'lucide-react';

const GREETING =
  "Hi! 👋 I'm the KailVarn Assistant. Ask me about our interior services, process, pricing approach or service areas.";

// Tap-to-ask buttons shown before the first message.
const SUGGESTIONS = [
  'What services do you offer?',
  'Is the interior designer really free?',
  'Which areas do you serve?',
  'How long does a project take?',
];

const STORAGE_KEY = 'kailvarn-chat';

// Turn site paths (/book-consultation) and the phone number in a reply into links.
const LINK_PATTERN = /(\/(?:book-consultation|get-free-quote|services|our-design|contact|about)\b|8460150027)/g;

function ReplyText({ text }) {
  // split() with a capture group puts the matches at the odd indexes.
  return text.split(LINK_PATTERN).map((part, i) => {
    if (i % 2 === 0) return <React.Fragment key={i}>{part}</React.Fragment>;
    if (part === '8460150027') {
      return <a key={i} href="tel:+918460150027" className="font-semibold text-[#8A6A1C] underline">{part}</a>;
    }
    return <Link key={i} href={part} className="font-semibold text-[#8A6A1C] underline">{part}</Link>;
  });
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the conversation across page navigations within this tab.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setMessages(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || 'Something went wrong. Please try again.');
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher — sits just above the floating WhatsApp button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with KailVarn Assistant'}
        aria-expanded={open}
        className="fixed right-4 bottom-[80px] md:right-[31px] md:bottom-[100px] z-[30] w-[52px] h-[52px] rounded-full bg-[#0B103B] text-[#D9A441] border border-[#D9A441]/50 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquareText className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="KailVarn Assistant chat"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[55] inset-x-2 top-[68px] bottom-[140px] md:inset-auto md:right-[28px] md:bottom-[164px] md:w-[380px] md:h-[min(560px,calc(100dvh-240px))] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden font-nunito"
          >
            {/* Header */}
            <div className="bg-[#0B103B] px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#F2B21B] text-[#0B103B] flex items-center justify-center font-playfair font-bold">K</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-[15px] leading-tight">KailVarn Assistant</p>
                <p className="text-white/60 text-[12px]">Usually replies in a few seconds</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAF7]" aria-live="polite">
              <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[14px] text-[#333] leading-relaxed shadow-sm">
                {GREETING}
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left text-[13px] font-semibold text-[#0B103B] bg-white border border-[#D9A441]/60 rounded-full px-3 py-1.5 hover:bg-[#F2B21B]/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                      m.role === 'user'
                        ? 'bg-[#0B103B] text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white text-[#333] rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {m.role === 'assistant' ? <ReplyText text={m.content} /> : m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-[13px] text-[#777]">
                  <Loader2 className="w-4 h-4 animate-spin" /> Typing…
                </div>
              )}
              {error && <p className="text-[13px] text-red-600">{error}</p>}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="shrink-0 border-t border-black/10 p-2.5 flex items-center gap-2 bg-white"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                placeholder="Type your question…"
                aria-label="Your message"
                className="flex-1 min-w-0 rounded-full border border-black/15 px-4 py-2.5 text-[16px] md:text-[14px] outline-none focus:border-[#D9A441]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="w-10 h-10 shrink-0 rounded-full bg-[#F2B21B] text-[#0B103B] flex items-center justify-center disabled:opacity-40 hover:bg-[#8A6A1C] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWidget;
