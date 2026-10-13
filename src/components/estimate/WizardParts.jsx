'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Building blocks shared by the step-by-step quote wizards
// (interior EstimateWizard and the painting PaintQuoteWizard).

export function ProgressBar({ steps, step }) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-nunito text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#8A6A1C]">Step {step + 1} of {steps.length}</p>
        <p className="font-nunito text-[13px] text-[#57534C]">{steps[step]}</p>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-hidden="true">
        {steps.map((label, i) => (
          <div key={label} className="h-1.5 overflow-hidden rounded-full bg-[#0B103B]/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#F2B21B] to-[#D9A441]"
              initial={false}
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepHeading({ title, lead }) {
  return (
    <div className="mb-6">
      <h2 className="font-playfair text-[26px] font-medium leading-[1.15] tracking-[-0.015em] text-[#0B103B] md:text-[30px]">{title}</h2>
      {lead && <p className="mt-2 font-nunito text-[15px] text-[#57534C]">{lead}</p>}
    </div>
  );
}

// A selectable card: gold border + tick when chosen.
export function OptionCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`relative w-full rounded-xl border bg-white text-left transition-[border-color,box-shadow,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${
        selected
          ? 'border-[#D9A441] bg-[#FFFBF0] shadow-[0_0_0_1px_#D9A441,0_10px_24px_-16px_rgba(217,164,65,0.7)]'
          : 'border-[#0B103B]/15 hover:border-[#D9A441]/60 hover:shadow-[0_10px_24px_-18px_rgba(11,16,59,0.4)]'
      } ${className}`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2B21B] text-[#0B103B]" aria-hidden="true">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  );
}

export function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-[6px] block font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">{label}</label>
      {children}
      {error && <p className="mt-1.5 font-nunito text-[12px] text-[#C62828]">{error}</p>}
    </div>
  );
}
