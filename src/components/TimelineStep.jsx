'use client';

import React from 'react';
import { motion } from 'framer-motion';

function TimelineStep({ step, index, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex items-start gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
          {step.id}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-accent/30 mt-2 hidden md:block" />
        )}
      </div>
      <div className="flex-1 pb-8 md:pb-12">
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default TimelineStep;