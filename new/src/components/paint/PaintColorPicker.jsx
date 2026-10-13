'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { PAINT_COLLECTIONS, PAINT_FAMILIES, findPaintColor } from '@/constants/paintColors.js';

// Light shades get a dark tick, dark shades a white one.
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

// A representative dot for each colour-family filter chip.
const FAMILY_DOT = {
  whites: '#F4EFE6', neutrals: '#B9AC9C', yellows: '#F2CC5B', oranges: '#F0A066', reds: '#C8504A',
  pinks: '#E8A3B6', purples: '#9C84B8', blues: '#7FA6D0', greens: '#86B07A',
};

// Collections big enough to need colour-family filters.
const FILTER_MIN = 15;

// Swatch picker for the paint visualizers (dark UI): brand/collection tabs,
// colour-family filters, a grid of shades, the chosen shade's name/code, and
// a custom colour input.
export default function PaintColorPicker({ value, onChange, label = 'Colour', defaultCollection }) {
  const current = findPaintColor(value);
  const [tab, setTab] = useState(current?.collection.id || defaultCollection || PAINT_COLLECTIONS[0].id);
  const [family, setFamily] = useState('all');
  const collection = PAINT_COLLECTIONS.find((c) => c.id === tab) || PAINT_COLLECTIONS[0];

  const families = PAINT_FAMILIES.filter((f) => collection.colors.some((c) => c.family === f.id));
  const showFilters = collection.colors.length >= FILTER_MIN && families.length > 1;
  const activeFamily = showFilters && families.some((f) => f.id === family) ? family : 'all';
  const colors = activeFamily === 'all' ? collection.colors : collection.colors.filter((c) => c.family === activeFamily);

  const chip = (on) =>
    `inline-flex min-h-[30px] min-w-[30px] shrink-0 items-center justify-center gap-1.5 rounded-full border px-2 sm:min-h-[32px] sm:px-3 font-nunito text-[12px] font-semibold transition-colors ${
      on ? 'border-white bg-white text-[#0B103B]' : 'border-white/15 text-white/65 hover:border-white/35 hover:text-white'
    }`;

  return (
    <div>
      <div role="tablist" aria-label={`${label} collections`} className="mb-3 flex flex-wrap gap-1.5">
        {PAINT_COLLECTIONS.map((c) => {
          const on = c.id === collection.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => { setTab(c.id); setFamily('all'); }}
              className={`min-h-[30px] shrink-0 whitespace-nowrap rounded-full border px-3 font-nunito text-[12px] font-bold transition-colors sm:min-h-[34px] sm:px-3.5 sm:text-[12.5px] ${
                on ? 'border-[#F2B21B] bg-[#F2B21B] text-[#0B103B]' : 'border-white/20 text-white/75 hover:border-white/40 hover:text-white'
              }`}
            >
              {c.name} <span className={on ? 'text-[#0B103B]/60' : 'text-white/40'}>{c.colors.length}</span>
            </button>
          );
        })}
      </div>

      {showFilters && (
        <div role="group" aria-label="Filter by colour" className="mb-3 flex flex-wrap gap-1.5">
          <button type="button" aria-pressed={activeFamily === 'all'} onClick={() => setFamily('all')} className={chip(activeFamily === 'all')}>
            All
          </button>
          {families.map((f) => (
            <button key={f.id} type="button" aria-pressed={activeFamily === f.id} aria-label={f.name} title={f.name} onClick={() => setFamily(f.id)} className={chip(activeFamily === f.id)}>
              <span className="h-3.5 w-3.5 rounded-full border border-black/10 sm:h-3 sm:w-3" style={{ backgroundColor: FAMILY_DOT[f.id] }} aria-hidden="true" />
              <span className="hidden sm:inline">{f.name}</span>
            </button>
          ))}
          {activeFamily !== 'all' && (
            <span className="self-center pl-1 font-nunito text-[12px] font-semibold text-white/70 sm:hidden">
              {families.find((f) => f.id === activeFamily)?.name}
            </span>
          )}
        </div>
      )}

      <div role="radiogroup" aria-label={`${label}: ${collection.name}`} className="flex flex-wrap gap-2.5">
        {colors.map((c) => {
          const on = value?.toUpperCase() === c.hex.toUpperCase();
          const name = c.code ? `${c.name} ${c.code}` : c.name;
          return (
            <button
              key={c.code || c.hex}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={name}
              title={name}
              onClick={() => onChange(c.hex)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${
                on ? 'scale-110 border-white' : 'border-white/20 hover:scale-105 hover:border-white/50'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {on && <Check className={`h-4 w-4 ${isLight(c.hex) ? 'text-[#0B103B]' : 'text-white'}`} strokeWidth={3} aria-hidden="true" />}
            </button>
          );
        })}
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-full border-2 border-white/20 bg-transparent"
          aria-label={`Custom ${label.toLowerCase()}`}
          title="Pick any colour"
        />
      </div>

      <p className="mt-2.5 min-h-[20px] font-nunito text-[12.5px] text-white/60" aria-live="polite">
        {current ? (
          <>
            <span className="font-bold text-white">{current.name}</span>
            {current.code && <span className="text-[#F6D47C]"> · {current.code}</span>}
            <span> · {current.collection.source}</span>
          </>
        ) : value ? (
          <>Custom colour <span className="font-bold uppercase text-white">{value}</span></>
        ) : (
          <>{collection.source}</>
        )}
      </p>
    </div>
  );
}
