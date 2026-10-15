'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Building2, CalendarClock, Check, CheckCircle2, DoorOpen, Droplets, Gift, Hammer, House, Layers,
  Loader2, Lock, MapPin, MessageCircle, Palette, Search, Sofa, Sparkles, Store, Umbrella, Building,
} from 'lucide-react';

import { submitLead } from '@/lib/submitLead.js';
import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';
import { LOCATIONS } from '@/constants/estimateConfig.js';
import {
  DIWALI_OFFER, PAINT_BRANDS, PAINT_EXTRAS, PAINT_HOMES, PAINT_RANGE_HELP, PAINT_SCOPES, PAINT_TIER_SHADES, PAINT_TIERS, PAINT_TIMING,
} from '@/constants/offers.js';
import { Field, OptionCard, ProgressBar, StepHeading } from '@/components/estimate/WizardParts.jsx';
import { usePromo } from '@/components/offers/PromoProvider.jsx';

// Step-by-step painting quote, same pattern as the interior EstimateWizard:
// home & scope -> location -> paint brand -> that brand's range -> extras &
// timing -> contact.
// Saved through /api/quotes; the choices travel in projectType / budget /
// message so they show in the admin Quotes list without a schema change.

const STEPS = ['Home', 'Location', 'Brand', 'Range', 'Extras', 'Details'];
const DETAILS = STEPS.length - 1;
const HOME_ICONS = { villa: House, shop: Store };
const SCOPE_ICONS = { interior: Sofa, exterior: Building, both: Layers };
const EXTRA_ICONS = { damp: Droplets, putty: Hammer, texture: Sparkles, wood: DoorOpen, terrace: Umbrella };
const TIMING_ICONS = { diwali: Gift, month: CalendarClock, exploring: Search };

const label = (list, id) => list.find((x) => x.id === id)?.label || '';
const findBrand = (id) => PAINT_BRANDS.find((b) => b.id === id);
const rangesOf = (brandId) => [...(findBrand(brandId)?.ranges || []), PAINT_RANGE_HELP];
const shadesOf = (range) => range?.shades || PAINT_TIER_SHADES[range?.tier] || [];

// "Asian Paints · Royale (Luxury)" for the summary and the saved lead.
function paintChoice(sel) {
  const brand = findBrand(sel.brand);
  const range = rangesOf(sel.brand).find((r) => r.id === sel.range);
  if (!brand || !range) return '';
  if (range.id === 'help') return `${brand.id === 'suggest' ? 'Brand & range' : `${brand.label} · range`} to be suggested`;
  const tier = PAINT_TIERS[range.tier];
  return brand.id === 'suggest' ? `${range.label} (any brand)` : `${brand.label} · ${range.label}${tier ? ` (${tier})` : ''}`;
}

export default function PaintQuoteWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sel, setSel] = useState({ home: '', scope: '', city: '', locality: '', brand: '', range: '', shade: '', extras: [], timing: '' });
  const [sent, setSent] = useState(null);
  const topRef = useRef(null);

  const update = (patch) => setSel((s) => ({ ...s, ...patch }));
  const canContinue = [Boolean(sel.home && sel.scope), Boolean(sel.city), Boolean(sel.brand), Boolean(sel.range), true][step];

  const go = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // Keep the top of the wizard in view when the step changes (phones).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, sent]);

  const summary = [
    `Painting: ${label(PAINT_SCOPES, sel.scope)} (${label(PAINT_HOMES, sel.home)})`,
    `Location: ${sel.city}${sel.locality.trim() ? `, ${sel.locality.trim()}` : ''}`,
    `Paint: ${paintChoice(sel)}`,
    sel.shade && `Liked shade: ${sel.shade}`,
    sel.extras.length > 0 && `Extras: ${sel.extras.map((id) => label(PAINT_EXTRAS, id)).join(', ')}`,
    sel.timing && `When: ${label(PAINT_TIMING, sel.timing)}`,
  ].filter(Boolean);

  const restart = () => {
    setSent(null);
    setSel({ home: '', scope: '', city: '', locality: '', brand: '', range: '', shade: '', extras: [], timing: '' });
    setDirection(-1);
    setStep(0);
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      {sent ? (
        <Success name={sent} summary={summary} onRestart={restart} />
      ) : (
        <>
          <ProgressBar steps={STEPS} step={step} />
          <div className="relative min-h-[420px]">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -32 }}
                transition={{ duration: 0.28, ease: [0.22, 0.61, 0.21, 1] }}
              >
                {step === 0 && <HomeStep sel={sel} update={update} />}
                {step === 1 && <LocationStep sel={sel} update={update} />}
                {step === 2 && <BrandStep sel={sel} update={update} />}
                {step === 3 && <RangeStep sel={sel} update={update} />}
                {step === 4 && <ExtrasStep sel={sel} update={update} />}
                {step === DETAILS && <ContactStep sel={sel} summary={summary} onBack={() => go(DETAILS - 1)} onDone={setSent} />}
              </motion.div>
            </AnimatePresence>
          </div>
          {step < DETAILS && (
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#0B103B]/10 pt-6">
              {step > 0 ? (
                <button type="button" onClick={() => go(step - 1)} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg px-3 font-nunito text-[14px] font-bold text-[#0B103B] hover:bg-[#0B103B]/[0.05]">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </button>
              ) : <span />}
              <button type="button" disabled={!canContinue} onClick={() => go(step + 1)} className="btn-primary min-w-[160px]">
                {step === 4 && !sel.extras.length && !sel.timing ? 'Skip' : 'Next'} <ArrowRight className="kv-arrow h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function HomeStep({ sel, update }) {
  return (
    <>
      <StepHeading title="What do you want painted?" lead="Tell us your home type so our expert comes prepared." />
      <div role="radiogroup" aria-label="Home type" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PAINT_HOMES.map((h) => {
          const Icon = HOME_ICONS[h.id] || Building2;
          return (
            <OptionCard key={h.id} selected={sel.home === h.id} onClick={() => update({ home: h.id })} className="p-4">
              <Icon className="mb-3 h-6 w-6 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
              <span className="block font-nunito text-[16px] font-bold text-[#0B103B]">{h.label}</span>
              <span className="mt-0.5 block font-nunito text-[12.5px] text-[#57534C]">{h.hint}</span>
            </OptionCard>
          );
        })}
      </div>

      <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">Which walls?</p>
      <div role="radiogroup" aria-label="Painting scope" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PAINT_SCOPES.map((s) => {
          const Icon = SCOPE_ICONS[s.id];
          return (
            <OptionCard key={s.id} selected={sel.scope === s.id} onClick={() => update({ scope: s.id })} className="flex items-center gap-3 p-4 pr-9">
              <Icon className="h-5 w-5 shrink-0 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
              <span>
                <span className="block font-nunito text-[15px] font-bold text-[#0B103B]">{s.label}</span>
                <span className="block font-nunito text-[12.5px] text-[#57534C]">{s.hint}</span>
              </span>
            </OptionCard>
          );
        })}
      </div>
      <p className="mt-6 font-nunito text-[13px] text-[#57534C]">
        Need full home interiors too?{' '}
        <Link href="/get-free-quote" className="font-bold text-[#8A6A1C] underline-offset-2 hover:underline">Get an interior estimate</Link>.
      </p>
    </>
  );
}

function LocationStep({ sel, update }) {
  return (
    <>
      <StepHeading title="Where is your home?" lead="We paint across Silvassa, Vapi and areas within about 50 km." />
      <div role="radiogroup" aria-label="City" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LOCATIONS.map((city) => (
          <OptionCard key={city} selected={sel.city === city} onClick={() => update({ city })} className="flex items-center gap-2.5 p-4">
            <MapPin className="h-4 w-4 shrink-0 text-[#D9A441]" aria-hidden="true" />
            <span className="font-nunito text-[15px] font-bold text-[#0B103B]">{city}</span>
          </OptionCard>
        ))}
      </div>
      <label htmlFor="pq-locality" className="mb-[6px] mt-8 block font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">
        Society / area name <span className="font-normal text-[#57534C]">(optional)</span>
      </label>
      <input
        id="pq-locality"
        type="text"
        maxLength={80}
        value={sel.locality}
        onChange={(e) => update({ locality: e.target.value })}
        placeholder={sel.city === 'Other nearby' ? 'e.g. Kachigam, Dunetha…' : 'e.g. Amli, GIDC, Chala…'}
        className="form-input-base form-input-focus"
      />
    </>
  );
}

const TIER_STYLES = {
  luxury: 'bg-[#0B103B] text-[#F6D47C]',
  premium: 'bg-[#8E1B1F] text-white',
  mid: 'bg-[#F2B21B]/25 text-[#6B4E00]',
  economy: 'bg-[#1F7A4D]/[0.12] text-[#16613C]',
  decorative: 'bg-[#6B3FA0]/[0.12] text-[#5A2F8A]',
  specialty: 'bg-[#2B5DD8]/10 text-[#1E3F9A]',
};

function BrandStep({ sel, update }) {
  const promo = usePromo();
  return (
    <>
      <StepHeading
        title="Which paint brand do you prefer?"
        lead={promo.active ? `The ${promo.discount}% ${promo.title} discount works with every brand.` : 'We work with every major brand.'}
      />
      <div role="radiogroup" aria-label="Paint brand" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PAINT_BRANDS.map((b) => {
          const suggest = b.id === 'suggest';
          return (
            <OptionCard
              key={b.id}
              selected={sel.brand === b.id}
              // A new brand means its own ranges, so clear the range picked for the old one.
              onClick={() => update(sel.brand === b.id ? {} : { brand: b.id, range: '', shade: '' })}
              className={`flex min-h-[92px] flex-col justify-center p-4 pr-9 ${suggest ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <span className={`block font-nunito font-bold text-[#0B103B] ${suggest ? 'text-[15px]' : 'text-[17px]'}`}>{b.label}</span>
              <span className="mt-0.5 block font-nunito text-[12.5px] text-[#57534C]">
                {suggest ? 'Choose by budget instead' : `${b.ranges.length} interior ranges`}
              </span>
            </OptionCard>
          );
        })}
      </div>
    </>
  );
}

function RangeStep({ sel, update }) {
  const brand = findBrand(sel.brand);
  const ranges = rangesOf(sel.brand);
  return (
    <>
      <StepHeading
        title={brand?.id === 'suggest' ? 'What finish are you looking for?' : `Choose your ${brand?.label} range`}
        lead={brand?.id === 'suggest' ? 'Pick by budget; our expert suggests the best brand for it.' : 'From luxury to budget. Not sure? Pick "Help me choose".'}
      />
      <div role="radiogroup" aria-label={`${brand?.label} range`} className="space-y-3">
        {ranges.map((r) => {
          const shades = shadesOf(r);
          const selected = sel.range === r.id;
          return (
            <div key={r.id}>
              <OptionCard selected={selected} onClick={() => update(selected ? {} : { range: r.id, shade: '' })} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <span className="font-playfair text-[20px] font-medium text-[#0B103B]">{r.label}</span>
                  {r.tier && (
                    <span className={`rounded-full px-2.5 py-0.5 font-nunito text-[10.5px] font-extrabold uppercase tracking-[0.1em] ${TIER_STYLES[r.tier]}`}>
                      {PAINT_TIERS[r.tier]}
                    </span>
                  )}
                  {selected && sel.shade && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1F7A4D]/10 px-2.5 py-0.5 font-nunito text-[11px] font-bold text-[#1F7A4D]">
                      <Check className="h-3 w-3" strokeWidth={2.5} /> {sel.shade}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-nunito text-[13.5px] leading-[1.55] text-[#57534C]">{r.examples}</p>
                {shades.length > 0 && !selected && (
                  <div className="mt-3.5 flex flex-wrap items-center gap-2.5 pt-2.5 border-t border-[#0B103B]/5">
                    <div className="flex items-center -space-x-1.5" aria-hidden="true">
                      {shades.map((c) => (
                        <span
                          key={c.code || c.name}
                          title={`${c.name} (${c.code})`}
                          className="h-6 w-6 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-transform hover:scale-110 hover:z-10"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                    <span className="font-nunito text-[12px] font-semibold text-[#8A6A1C] flex items-center gap-1.5">
                      <span>5 signature shades</span>
                      <span className="text-[#0B103B]/25">·</span>
                      <span className="text-[#57534C] font-normal">Tap to preview on walls</span>
                    </span>
                  </div>
                )}
              </OptionCard>
              <AnimatePresence initial={false}>
                {selected && shades.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 0.61, 0.21, 1] }}
                    className="overflow-hidden"
                  >
                    <ShadePreview
                      range={r}
                      shades={shades}
                      shade={sel.shade}
                      onPick={(c) => {
                        const pickedKey = `${c.name} (${c.code})`;
                        update({ shade: sel.shade === pickedKey || sel.shade === c.name ? '' : pickedKey });
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Mini architectural room preview whose back wall reflects the chosen shade in realistic home lighting.
function ShadePreview({ range, shades, shade, onPick }) {
  const active = shades.find((c) => c.name === shade || `${c.name} (${c.code})` === shade) || shades[0];

  return (
    <div className="mt-2.5 rounded-2xl border border-[#D9A441]/35 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F0] to-[#F5EFE4] p-4 sm:p-5 shadow-sm">
      {/* Header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#0B103B]/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#D9A441]" aria-hidden="true" />
            <h4 className="font-playfair text-[17px] font-semibold text-[#0B103B]">
              {range.label} · 5 Popular Shades
            </h4>
          </div>
          <p className="mt-0.5 font-nunito text-[12.5px] text-[#57534C]">
            Interactive wall simulation · Tap any swatch to preview in the room
          </p>
        </div>
        <span className="rounded-full bg-[#0B103B]/[0.06] px-3 py-1 font-nunito text-[11px] font-bold uppercase tracking-wider text-[#0B103B]">
          Authentic Brand Codes
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-5 items-start">
        {/* Room simulation */}
        <RoomScene wall={active.hex} shadeName={active.name} shadeCode={active.code} />

        {/* 5 Shades Swatch Cards */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="mb-2 font-nunito text-[12px] font-bold uppercase tracking-wider text-[#8A6A1C]">
              Select a shade for your quote (Optional)
            </p>
            <div role="radiogroup" aria-label={`${range.label} shades`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {shades.map((c) => {
                const shadeKey = `${c.name} (${c.code})`;
                const on = shade === c.name || shade === shadeKey;
                return (
                  <button
                    key={c.code || c.name}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${c.name}, shade code ${c.code}`}
                    onClick={() => onPick(c)}
                    className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${
                      on
                        ? 'border-[#0B103B] bg-white shadow-md ring-2 ring-[#0B103B]/10'
                        : 'border-[#0B103B]/10 bg-white/70 hover:border-[#D9A441] hover:bg-white'
                    }`}
                  >
                    {/* Color Swatch Chip with realistic sheen */}
                    <div
                      className="relative h-10 w-10 shrink-0 rounded-lg border border-black/10 shadow-inner flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: c.hex }}
                    >
                      {on && (
                        <Check
                          className={`h-5 w-5 ${isDark(c.hex) ? 'text-white' : 'text-[#0B103B]'}`}
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Shade Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate font-nunito text-[14px] font-bold text-[#0B103B]">
                          {c.name}
                        </span>
                        {on && (
                          <span className="shrink-0 rounded-full bg-[#0B103B] px-2 py-0.5 font-nunito text-[10px] font-bold uppercase tracking-wider text-[#F2B21B]">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="rounded bg-[#0B103B]/[0.06] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#57534C]">
                          {c.code}
                        </span>
                        <span className="font-mono text-[11px] text-[#8C877E]">
                          {c.hex}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Helper caption */}
          <div className="mt-3.5 rounded-lg bg-[#0B103B]/[0.03] p-2.5 text-left border border-[#0B103B]/5">
            <p className="font-nunito text-[12px] leading-[1.5] text-[#57534C]">
              {shade ? (
                <span>
                  Picked: <strong className="text-[#0B103B]">{shade}</strong>. Our expert brings the physical shade card to your free site visit.
                </span>
              ) : (
                <span>
                  Showing: <strong className="text-[#0B103B]">{active.name} ({active.code})</strong>. Tap any shade to include it in your quote.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function isDark(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

function RoomScene({ wall, shadeName, shadeCode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#0B103B]/10 bg-white shadow-sm">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-[#0B103B]/85 px-3 py-1 text-white shadow-md backdrop-blur-md">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/60 shadow-sm" style={{ backgroundColor: wall }} />
        <span className="font-nunito text-[11.5px] font-semibold tracking-wide">
          {shadeName} {shadeCode ? `· ${shadeCode}` : ''}
        </span>
      </div>
      <svg
        viewBox="0 0 380 230"
        className="h-auto w-full transition-all duration-300"
        role="img"
        aria-label={`Living room preview painted in ${shadeName}`}
      >
        <defs>
          <linearGradient id="wall-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id="lamp-glow" cx="88%" cy="40%" r="35%">
            <stop offset="0%" stopColor="#FFF3D1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF3D1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="floor-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Feature back wall */}
        <rect width="380" height="175" fill={wall} style={{ transition: 'fill 350ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
        {/* Soft daylight and room lighting overlays */}
        <rect width="380" height="175" fill="url(#wall-light)" />
        <rect width="380" height="175" fill="url(#lamp-glow)" />

        {/* Ceiling Cove Molding */}
        <rect width="380" height="5" fill="#FFFFFF" opacity="0.95" />
        <line x1="0" y1="5" x2="380" y2="5" stroke="#000000" strokeOpacity="0.08" strokeWidth="1" />

        {/* Baseboard Skirting */}
        <rect y="170" width="380" height="6" fill="#FFFFFF" opacity="0.95" />
        <line x1="0" y1="170" x2="380" y2="170" stroke="#000000" strokeOpacity="0.1" strokeWidth="1" />

        {/* Hardwood Parquet Floor */}
        <rect y="176" width="380" height="54" fill="#C29B70" />
        <rect y="176" width="380" height="54" fill="#000000" opacity="0.12" />
        {/* Floor plank perspective lines */}
        <line x1="0" y1="192" x2="380" y2="192" stroke="#A88055" strokeWidth="0.75" opacity="0.6" />
        <line x1="0" y1="210" x2="380" y2="210" stroke="#A88055" strokeWidth="0.75" opacity="0.6" />
        <line x1="70" y1="176" x2="50" y2="230" stroke="#A88055" strokeWidth="0.75" opacity="0.45" />
        <line x1="160" y1="176" x2="140" y2="230" stroke="#A88055" strokeWidth="0.75" opacity="0.45" />
        <line x1="250" y1="176" x2="230" y2="230" stroke="#A88055" strokeWidth="0.75" opacity="0.45" />
        <line x1="340" y1="176" x2="320" y2="230" stroke="#A88055" strokeWidth="0.75" opacity="0.45" />

        {/* Window with outside view and linen curtains */}
        <rect x="22" y="24" width="70" height="95" rx="3" fill="#FFFFFF" />
        <rect x="26" y="28" width="62" height="87" fill="#D8ECF8" />
        <ellipse cx="50" cy="55" rx="16" ry="6" fill="#FFFFFF" opacity="0.7" />
        <ellipse cx="65" cy="52" rx="12" ry="5" fill="#FFFFFF" opacity="0.7" />
        <line x1="57" y1="28" x2="57" y2="115" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="26" y1="70" x2="88" y2="70" stroke="#FFFFFF" strokeWidth="2.5" />
        <rect x="14" y="20" width="12" height="110" rx="3" fill="#F4EDE0" opacity="0.95" />
        <rect x="88" y="20" width="12" height="110" rx="3" fill="#F4EDE0" opacity="0.95" />

        {/* Modern Gold-Framed Wall Art */}
        <rect x="195" y="28" width="82" height="54" rx="2" fill="#D4AF37" />
        <rect x="198" y="31" width="76" height="48" fill="#FDFCF9" />
        <circle cx="230" cy="55" r="15" fill="#E6C594" opacity="0.75" />
        <path d="M205 68 Q225 40 248 58 T270 45" fill="none" stroke="#2B3A4A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="252" cy="46" r="4" fill="#C2593F" />

        {/* Floor shadow under sofa */}
        <ellipse cx="230" cy="180" rx="90" ry="8" fill="url(#floor-shadow)" />

        {/* Modern Designer 3-Seater Sofa */}
        <rect x="150" y="108" width="168" height="44" rx="10" fill="#3D4556" />
        <rect x="152" y="110" width="164" height="40" rx="8" fill="#4B5568" />
        <line x1="206" y1="112" x2="206" y2="148" stroke="#374151" strokeWidth="1.5" />
        <line x1="262" y1="112" x2="262" y2="148" stroke="#374151" strokeWidth="1.5" />
        <rect x="142" y="134" width="184" height="34" rx="9" fill="#374151" />
        <rect x="144" y="136" width="180" height="30" rx="8" fill="#4B5568" />
        <line x1="204" y1="136" x2="204" y2="164" stroke="#374151" strokeWidth="1.5" />
        <line x1="264" y1="136" x2="264" y2="164" stroke="#374151" strokeWidth="1.5" />
        <rect x="136" y="124" width="18" height="42" rx="6" fill="#3D4556" />
        <rect x="314" y="124" width="18" height="42" rx="6" fill="#3D4556" />
        <rect x="158" y="120" width="24" height="24" rx="5" transform="rotate(-6 158 120)" fill="#D9A441" />
        <rect x="286" y="118" width="22" height="22" rx="5" transform="rotate(8 286 118)" fill="#EAE4D5" />
        <polygon points="152,168 156,168 153,180 149,180" fill="#20232A" />
        <polygon points="196,168 200,168 198,180 194,180" fill="#20232A" />
        <polygon points="270,168 274,168 272,180 268,180" fill="#20232A" />
        <polygon points="314,168 318,168 319,180 315,180" fill="#20232A" />

        {/* Minimalist Floor Lamp */}
        <path d="M360 182 L360 85 Q360 55 338 52" fill="none" stroke="#2B2D38" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="330,52 346,52 352,66 324,66" fill="#F8E5B9" />
        <ellipse cx="360" cy="182" rx="10" ry="3" fill="#2B2D38" />

        {/* Indoor Plant in planter */}
        <ellipse cx="112" cy="180" rx="14" ry="4" fill="#000000" opacity="0.25" />
        <polygon points="103,156 121,156 118,180 106,180" fill="#C26A4A" />
        <ellipse cx="112" cy="156" rx="9" ry="3" fill="#8E462D" />
        <path d="M112 156 Q100 135 88 138 Q96 150 112 156 Z" fill="#2D6A4F" />
        <path d="M112 156 Q112 128 110 120 Q122 135 112 156 Z" fill="#3F8862" />
        <path d="M112 156 Q125 138 134 140 Q126 150 112 156 Z" fill="#2D6A4F" />
        <path d="M112 156 Q94 144 86 148 Q98 156 112 156 Z" fill="#52B788" />
        <path d="M112 156 Q128 146 138 148 Q124 158 112 156 Z" fill="#52B788" />
      </svg>
    </div>
  );
}

function ExtrasStep({ sel, update }) {
  const promo = usePromo();
  const timing = PAINT_TIMING.filter((t) => promo.active || t.id !== 'diwali');
  const toggle = (id) => update({ extras: sel.extras.includes(id) ? sel.extras.filter((x) => x !== id) : [...sel.extras, id] });
  return (
    <>
      <StepHeading title="Anything else to fix?" lead="Optional. Add what your walls need so the quote covers it." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PAINT_EXTRAS.map((x) => {
          const Icon = EXTRA_ICONS[x.id];
          const on = sel.extras.includes(x.id);
          return (
            <button
              key={x.id}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => toggle(x.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${on ? 'border-[#D9A441] bg-[#FFFBF0]' : 'border-[#0B103B]/15 bg-white hover:border-[#D9A441]/60'}`}
            >
              <Icon className="h-5 w-5 shrink-0 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-nunito text-[14.5px] font-bold text-[#0B103B]">{x.label}</span>
                <span className="block font-nunito text-[12px] text-[#57534C]">{x.hint}</span>
              </span>
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-[#F2B21B]' : 'bg-[#0B103B]/20'}`} aria-hidden="true">
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </span>
            </button>
          );
        })}
      </div>

      <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">When do you want it done?</p>
      <div role="radiogroup" aria-label="Timing" className={`grid grid-cols-1 gap-3 ${timing.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {timing.map((t) => {
          const Icon = TIMING_ICONS[t.id];
          return (
            <OptionCard key={t.id} selected={sel.timing === t.id} onClick={() => update({ timing: sel.timing === t.id ? '' : t.id })} className="flex items-center gap-3 p-4 pr-9">
              <Icon className="h-5 w-5 shrink-0 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
              <span>
                <span className="block font-nunito text-[15px] font-bold text-[#0B103B]">{t.label}</span>
                <span className="block font-nunito text-[12.5px] text-[#57534C]">{t.hint}</span>
              </span>
            </OptionCard>
          );
        })}
      </div>
    </>
  );
}

function ContactStep({ sel, summary, onBack, onDone }) {
  const promo = usePromo();
  const offer = promo.active;
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', notes: '', whatsapp: true, website: '' },
  });

  const onSubmit = async (form) => {
    setError('');
    const result = await submitLead('/api/quotes', {
      name: form.name,
      phone: form.phone.replace(/\D/g, '').slice(-10),
      email: form.email,
      city: sel.locality.trim() ? `${sel.city}, ${sel.locality.trim()}` : sel.city,
      service: offer ? promo.leadService : 'Painting',
      projectType: `${label(PAINT_SCOPES, sel.scope)} · ${label(PAINT_HOMES, sel.home)}`,
      budget: paintChoice(sel),
      contactMethod: form.whatsapp ? 'WhatsApp' : 'Phone call',
      source: offer ? `${promo.title} offer (advertisement)` : 'Painting quote page',
      message: [...summary.slice(2), form.notes.trim() && `Notes: ${form.notes.trim()}`].filter(Boolean).join('\n'),
      website: form.website,
    });
    if (!result.ok) {
      setError(Object.values(result.fields)[0] || result.message);
      return;
    }
    onDone(form.name.trim().split(/\s+/)[0]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      <StepHeading title="Where should our expert call you?" lead="We'll call to fix your free site visit and colour consultation." />
      {/* Spam trap: hidden from people, bots fill it in */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" {...register('website')} />

      {offer && (
        <p className="mb-6 flex items-center gap-3 rounded-xl border border-[#D9A441]/60 bg-[#FFFBF0] px-4 py-3 font-nunito text-[14px] text-[#2A2A2A]">
          <Gift className="h-5 w-5 shrink-0 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
          <span>Your <strong className="text-[#0B103B]">{promo.discount}% {promo.title} discount</strong> will be noted on this request.</span>
        </p>
      )}

      <div className="space-y-5">
        <Field id="pq-name" label="Full name" error={errors.name?.message}>
          <input id="pq-name" type="text" autoComplete="name" placeholder="e.g. Rahul Patel"
            {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter your name' } })}
            className={`form-input-base ${errors.name ? 'form-input-error' : 'form-input-focus'}`} />
        </Field>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id="pq-phone" label="Mobile number" error={errors.phone?.message}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#57534C]">+91</span>
              <input id="pq-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210"
                {...register('phone', { required: 'Please enter your mobile number', validate: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10)) || 'Enter a valid 10-digit mobile number' })}
                className={`form-input-base pl-[52px] ${errors.phone ? 'form-input-error' : 'form-input-focus'}`} />
            </div>
          </Field>
          <Field id="pq-email" label={<>Email <span className="font-normal text-[#57534C]">(optional)</span></>} error={errors.email?.message}>
            <input id="pq-email" type="email" autoComplete="email" placeholder="name@example.com"
              {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })}
              className={`form-input-base ${errors.email ? 'form-input-error' : 'form-input-focus'}`} />
          </Field>
        </div>
        <Field id="pq-notes" label={<>Anything we should know? <span className="font-normal text-[#57534C]">(optional)</span></>}>
          <textarea id="pq-notes" rows={3} maxLength={1000} placeholder="e.g. seepage in bedroom wall, want a pooja-room accent colour"
            {...register('notes')} className="form-input-base form-input-focus resize-none" />
        </Field>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" {...register('whatsapp')} className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#D9A441]" />
          <span className="font-nunito text-[14px] text-[#2A2A2A]">Contact me on WhatsApp</span>
        </label>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg border border-[#C62828]/30 bg-[#C62828]/[0.06] px-4 py-3 font-nunito text-[14px] text-[#8C1D18]">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#0B103B]/10 pt-6">
        <button type="button" onClick={onBack} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg px-3 font-nunito text-[14px] font-bold text-[#0B103B] hover:bg-[#0B103B]/[0.05]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[200px]">
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</>
            : <>{offer ? `Claim ${promo.discount}% off` : 'Get my quote'} <ArrowRight className="kv-arrow h-4 w-4" aria-hidden="true" /></>}
        </button>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-nunito text-[12px] text-[#57534C]">
        <Lock className="h-3 w-3 shrink-0" aria-hidden="true" /> Free site visit. No obligation. We never spam or share your number.
      </p>
    </form>
  );
}

function Success({ name, summary, onRestart }) {
  const promo = usePromo();
  const offer = promo.active;
  const { openWhatsApp } = useWhatsAppLink();
  const text = `Hi KailVarn, I just requested a painting quote${offer ? ` with the ${promo.title} ${promo.discount}% offer` : ''}.\n\n${summary.join('\n')}`;
  return (
    <div className="py-4 text-center" role="status">
      <div className="animate-scale-in mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2B21B]/15">
        <CheckCircle2 className="h-9 w-9 text-[#D9A441]" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-playfair text-[26px] font-medium leading-tight text-[#0B103B] md:text-[30px]">Thank you, {name}!</h2>
      <p className="mx-auto mt-3 max-w-[460px] font-nunito text-[15px] leading-[1.7] text-[#57534C]">
        Our painting expert will call you shortly to fix your free site visit.
        {offer && <> Your <strong className="text-[#0B103B]">{promo.discount}% {promo.title} discount</strong> is noted on your request.</>}
      </p>
      <ul className="mx-auto mt-6 max-w-[440px] space-y-1.5 rounded-xl bg-[#F5F1E8] px-5 py-4 text-left font-nunito text-[13.5px] text-[#2A2A2A]">
        {summary.map((line) => <li key={line}>{line}</li>)}
      </ul>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => openWhatsApp('', text)} className="kv-btn bg-[#25D366] text-white hover:bg-[#1FB457]">
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" /> WhatsApp us now
        </button>
        <Link href={DIWALI_OFFER.visualizerPath} className="btn-outline-dark">
          <Palette className="h-[18px] w-[18px]" aria-hidden="true" /> Try colours on your wall
        </Link>
      </div>
      <button type="button" onClick={onRestart} className="mt-5 min-h-[44px] font-nunito text-[13.5px] font-bold text-[#8A6A1C] underline-offset-2 hover:underline">
        Start a new quote
      </button>
    </div>
  );
}
