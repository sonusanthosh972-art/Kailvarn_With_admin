'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

// Editorial reveal: content rises 24px and fades in once, when it scrolls
// into view. Used sparingly — section headings and key media, not every card.
export default function Reveal({ as = 'div', delay = 0, y = 24, duration = 0.9, className, children, ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Photograph revealed by a clip-path wipe (bottom to top) — used once or
// twice per page for the hero-grade images.
export function ImageReveal({ className, children, delay = 0 }) {
  // clip-path isn't covered by MotionConfig's reducedMotion (transforms only),
  // so reduced motion falls back to a plain fade.
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={className}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
