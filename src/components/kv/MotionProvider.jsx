'use client';

import { MotionConfig } from 'framer-motion';

// Every framer-motion animation on the site follows the visitor's OS
// "reduce motion" setting: movement (x/y/scale) is dropped, opacity stays.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
