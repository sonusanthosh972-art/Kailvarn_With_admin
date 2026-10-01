'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TOOLTIP_SHOW_DELAY_MS = 3000;
const TOOLTIP_VISIBLE_MS = 4000;

function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/918401226123?text=Hi KailVarn, I am interested in your interior services.";
  // Tooltip peeks out once shortly after load, then auto-hides; after that it
  // only appears on hover. It never shows on touch / small screens (see the
  // `hidden md:block` + hover media query below), where a tap leaves :hover
  // stuck and the bubble would sit on top of page text.
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setPeek(true), TOOLTIP_SHOW_DELAY_MS);
    const hide = setTimeout(() => setPeek(false), TOOLTIP_SHOW_DELAY_MS + TOOLTIP_VISIBLE_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 md:bottom-[28px] md:right-[28px] z-[30]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        className="relative group flex flex-col items-end"
      >
        {/* Tooltip — desktop / hover-capable devices only. Sits to the LEFT of
            the button: the chat launcher occupies the space above it. */}
        <div
          aria-hidden="true"
          className={`hidden md:block absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#111111] text-white font-nunito font-semibold text-[13px] px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-all duration-300 shadow-md [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-x-0 ${
            peek ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Chat with us on WhatsApp
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-[#111111]"></div>
        </div>

        {/* Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-[52px] h-[52px] md:w-[58px] md:h-[58px] bg-[#25D366] rounded-full text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 animate-wa-pulse"
          aria-label="Chat with us on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </motion.div>
    </div>
  );
}

export default FloatingWhatsApp;
