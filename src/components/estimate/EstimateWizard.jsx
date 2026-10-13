'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BedDouble, BookOpen, Building2, CalendarCheck, Check, CookingPot, DoorClosed,
  Download, Flower2, Hammer, House, KeyRound, Lightbulb, Loader2, Lock, Mail, MapPin, Minus, PaintRoller,
  Plus, RotateCcw, Tv, UtensilsCrossed,
} from 'lucide-react';
import {
  ADD_ONS, ESTIMATE_DISCLAIMER, HOME_TYPES, LOCATIONS, PACKAGES, PROPERTY_STATUS, ROOM_ITEMS,
} from '@/constants/estimateConfig.js';
import { Field, OptionCard, ProgressBar, StepHeading } from '@/components/estimate/WizardParts.jsx';
import { defaultAddOns, defaultRooms, estimateSummary, findHome, formatInr, formatRange } from '@/lib/estimate.js';

// Multi-step estimate calculator (DesignCafe / Livspace style):
// home type -> location -> rooms -> package -> contact details -> estimate.
// The price is only shown once contact details are in; the server
// recalculates it, saves the lead and emails the estimate.

const STEPS = ['Home', 'Location', 'Rooms', 'Package', 'Details'];
const ROOM_ICONS = { kitchen: CookingPot, wardrobe: DoorClosed, bed: BedDouble, tvUnit: Tv, crockery: UtensilsCrossed, study: BookOpen, pooja: Flower2 };
const ADD_ON_ICONS = { falseCeiling: Lightbulb, painting: PaintRoller };
const STATUS_ICONS = { new: KeyRound, renovation: Hammer };
const WHATSAPP_NUMBER = '918460150027';

export default function EstimateWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selection, setSelection] = useState({
    home: '',
    status: '',
    city: '',
    locality: '',
    rooms: defaultRooms('2bhk'),
    addOns: defaultAddOns(),
    package: 'premium',
  });
  const [result, setResult] = useState(null);
  const topRef = useRef(null);

  const update = (patch) => setSelection((s) => ({ ...s, ...patch }));

  const canContinue = [
    Boolean(selection.home && selection.status),
    Boolean(selection.city),
    Object.values(selection.rooms).some((q) => q > 0) || Object.values(selection.addOns).some(Boolean),
    Boolean(selection.package),
  ][step];

  const go = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // Keep the top of the wizard in view when the step changes (matters on
  // phones, where the Next button sits far below the question).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, result]);

  const restart = () => {
    setResult(null);
    setSelection((s) => ({ ...s, home: '', status: '', city: '', locality: '', rooms: defaultRooms('2bhk'), addOns: defaultAddOns(), package: 'premium' }));
    setDirection(-1);
    setStep(0);
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      {result ? (
        <EstimateResult result={result} selection={selection} onRestart={restart} />
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
                {step === 0 && <HomeStep selection={selection} update={update} />}
                {step === 1 && <LocationStep selection={selection} update={update} />}
                {step === 2 && <RoomsStep selection={selection} update={update} />}
                {step === 3 && <PackageStep selection={selection} update={update} />}
                {step === 4 && <ContactStep selection={selection} onBack={() => go(3)} onDone={setResult} />}
              </motion.div>
            </AnimatePresence>
          </div>
          {step < 4 && (
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#0B103B]/10 pt-6">
              {step > 0 ? (
                <button type="button" onClick={() => go(step - 1)} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg px-3 font-nunito text-[14px] font-bold text-[#0B103B] hover:bg-[#0B103B]/[0.05]">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </button>
              ) : <span />}
              <button type="button" disabled={!canContinue} onClick={() => go(step + 1)} className="btn-primary min-w-[160px]">
                Next <ArrowRight className="kv-arrow h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function HomeStep({ selection, update }) {
  const pickHome = (id) => update({ home: id, rooms: defaultRooms(id) });
  return (
    <>
      <StepHeading title="What kind of home is it?" lead="We'll suggest the right rooms and sizes for it." />
      <div role="radiogroup" aria-label="Home type" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {HOME_TYPES.map((h) => {
          const Icon = h.id === 'villa' ? House : Building2;
          return (
            <OptionCard key={h.id} selected={selection.home === h.id} onClick={() => pickHome(h.id)} className="p-4">
              <Icon className="mb-3 h-6 w-6 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
              <span className="block font-nunito text-[16px] font-bold text-[#0B103B]">{h.label}</span>
              <span className="mt-0.5 block font-nunito text-[12.5px] text-[#57534C]">{h.hint}</span>
            </OptionCard>
          );
        })}
      </div>

      <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">Is it a new home or a renovation?</p>
      <div role="radiogroup" aria-label="Property status" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROPERTY_STATUS.map((s) => {
          const Icon = STATUS_ICONS[s.id];
          return (
            <OptionCard key={s.id} selected={selection.status === s.id} onClick={() => update({ status: s.id })} className="flex items-center gap-3 p-4">
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
        Need an office or shop quote?{' '}
        <Link href="/contact" className="font-bold text-[#8A6A1C] underline-offset-2 hover:underline">Tell us here</Link>.
        {' '}Only painting?{' '}
        <Link href="/painting-quote" className="font-bold text-[#8A6A1C] underline-offset-2 hover:underline">Get a painting quote</Link>.
      </p>
    </>
  );
}

function LocationStep({ selection, update }) {
  return (
    <>
      <StepHeading title="Where is your home?" lead="We work across Silvassa, Vapi and areas within about 50 km." />
      <div role="radiogroup" aria-label="City" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LOCATIONS.map((city) => (
          <OptionCard key={city} selected={selection.city === city} onClick={() => update({ city })} className="flex items-center gap-2.5 p-4">
            <MapPin className="h-4 w-4 shrink-0 text-[#D9A441]" aria-hidden="true" />
            <span className="font-nunito text-[15px] font-bold text-[#0B103B]">{city}</span>
          </OptionCard>
        ))}
      </div>
      <label htmlFor="est-locality" className="mb-[6px] mt-8 block font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">
        Society / area name <span className="font-normal text-[#57534C]">(optional)</span>
      </label>
      <input
        id="est-locality"
        type="text"
        maxLength={120}
        value={selection.locality}
        onChange={(e) => update({ locality: e.target.value })}
        placeholder={selection.city === 'Other nearby' ? 'e.g. Kachigam, Dunetha…' : 'e.g. Amli, GIDC, Chala…'}
        className="form-input-base form-input-focus"
      />
    </>
  );
}

function Stepper({ value, max, onChange, label }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} aria-label={`Fewer ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#0B103B]/15 text-[#0B103B] transition-colors hover:border-[#D9A441] disabled:opacity-35 disabled:hover:border-[#0B103B]/15">
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="w-8 text-center font-nunito text-[16px] font-bold tabular-nums text-[#0B103B]" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value === max} aria-label={`More ${label}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#0B103B]/15 text-[#0B103B] transition-colors hover:border-[#D9A441] disabled:opacity-35 disabled:hover:border-[#0B103B]/15">
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function RoomsStep({ selection, update }) {
  const home = findHome(selection.home);
  return (
    <>
      <StepHeading title="What would you like us to do?" lead={`We've pre-filled a typical ${home?.label || 'home'}. Add or remove anything.`} />
      <ul className="divide-y divide-[#0B103B]/10 rounded-xl border border-[#0B103B]/15 bg-white">
        {ROOM_ITEMS.map((item) => {
          const Icon = ROOM_ICONS[item.id];
          const qty = selection.rooms[item.id] || 0;
          return (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3.5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${qty ? 'bg-[#F2B21B]/15 text-[#8A6A1C]' : 'bg-[#0B103B]/[0.05] text-[#57534C]'}`}>
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-nunito text-[15px] font-bold text-[#0B103B]">{item.label}</span>
                <span className="block truncate font-nunito text-[12.5px] text-[#57534C]">{item.hint}</span>
              </span>
              <Stepper label={item.label} value={qty} max={item.max} onChange={(v) => update({ rooms: { ...selection.rooms, [item.id]: v } })} />
            </li>
          );
        })}
      </ul>

      <p className="mb-3 mt-7 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">Whole-home services</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ADD_ONS.map((a) => {
          const Icon = ADD_ON_ICONS[a.id];
          const on = selection.addOns[a.id];
          return (
            <button
              key={a.id}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => update({ addOns: { ...selection.addOns, [a.id]: !on } })}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${on ? 'border-[#D9A441] bg-[#FFFBF0]' : 'border-[#0B103B]/15 bg-white hover:border-[#D9A441]/60'}`}
            >
              <Icon className="h-5 w-5 shrink-0 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-nunito text-[14.5px] font-bold text-[#0B103B]">{a.label}</span>
                <span className="block font-nunito text-[12px] text-[#57534C]">{a.hint}</span>
              </span>
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-[#F2B21B]' : 'bg-[#0B103B]/20'}`} aria-hidden="true">
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function PackageStep({ selection, update }) {
  return (
    <>
      <StepHeading title="Choose your finish level" lead="You'll see the price for all three on the next screen." />
      <div role="radiogroup" aria-label="Package" className="space-y-3">
        {PACKAGES.map((p) => (
          <OptionCard key={p.id} selected={selection.package === p.id} onClick={() => update({ package: p.id })} className="p-5">
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <span className="font-playfair text-[21px] font-medium text-[#0B103B]">{p.name}</span>
              {p.popular && <span className="rounded-full bg-[#0B103B] px-2.5 py-0.5 font-nunito text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[#F6D47C]">Most popular</span>}
            </div>
            <p className="mt-1 font-nunito text-[14px] text-[#57534C]">{p.tagline}</p>
            <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 font-nunito text-[13px] text-[#2A2A2A]">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D9A441]" strokeWidth={3} aria-hidden="true" /> {f}
                </li>
              ))}
            </ul>
          </OptionCard>
        ))}
      </div>
    </>
  );
}

function ContactStep({ selection, onBack, onDone }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', whatsapp: true, website: '' },
  });

  const onSubmit = async (contact) => {
    setError('');
    try {
      const res = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selection, ...contact, phone: contact.phone.replace(/\D/g, '').slice(-10) }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        const fields = json?.error?.fields;
        setError((fields && Object.values(fields)[0]) || json?.error?.message || 'We could not create your estimate. Please try again, or call/WhatsApp 8460150027.');
        return;
      }
      onDone({ ...json.data, contact });
    } catch {
      setError('No internet connection? Please try again, or call/WhatsApp 8460150027.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      <StepHeading title="Where should we send your estimate?" lead="Your estimate appears instantly, and we'll email you a copy." />
      {/* Spam trap: hidden from people, bots fill it in */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" {...register('website')} />

      <div className="space-y-5">
        <Field id="est-name" label="Full name" error={errors.name?.message}>
          <input id="est-name" type="text" autoComplete="name" placeholder="e.g. Rahul Patel"
            {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter your name' } })}
            className={`form-input-base ${errors.name ? 'form-input-error' : 'form-input-focus'}`} />
        </Field>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id="est-phone" label="Mobile number" error={errors.phone?.message}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#57534C]">+91</span>
              <input id="est-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210"
                {...register('phone', { required: 'Please enter your mobile number', validate: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10)) || 'Enter a valid 10-digit mobile number' })}
                className={`form-input-base pl-[52px] ${errors.phone ? 'form-input-error' : 'form-input-focus'}`} />
            </div>
          </Field>
          <Field id="est-email" label="Email" error={errors.email?.message}>
            <input id="est-email" type="email" autoComplete="email" placeholder="name@example.com"
              {...register('email', { required: 'Please enter your email', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })}
              className={`form-input-base ${errors.email ? 'form-input-error' : 'form-input-focus'}`} />
          </Field>
        </div>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" {...register('whatsapp')} className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#D9A441]" />
          <span className="font-nunito text-[14px] text-[#2A2A2A]">Send me updates on WhatsApp</span>
        </label>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg border border-[#C62828]/30 bg-[#C62828]/[0.06] px-4 py-3 font-nunito text-[14px] text-[#8C1D18]">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#0B103B]/10 pt-6">
        <button type="button" onClick={onBack} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg px-3 font-nunito text-[14px] font-bold text-[#0B103B] hover:bg-[#0B103B]/[0.05]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[200px]">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Calculating…</> : <>Show my estimate <ArrowRight className="kv-arrow h-4 w-4" aria-hidden="true" /></>}
        </button>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 font-nunito text-[12px] text-[#57534C]">
        <Lock className="h-3 w-3" aria-hidden="true" /> Your details are safe with us. We never spam or share them.
      </p>
    </form>
  );
}

function EstimateResult({ result, selection, onRestart }) {
  const [shown, setShown] = useState(selection.package);
  const estimate = result.estimates[shown];
  const home = findHome(selection.home);
  const firstName = result.contact.name.trim().split(/\s+/)[0];
  const whatsappText = useMemo(
    () => `Hi KailVarn, I got an online estimate and would like to discuss it.\n\n${estimateSummary(selection, shown, estimate)}`,
    [selection, shown, estimate]
  );

  return (
    <motion.div id="estimate-print" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
      <p className="font-nunito text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#8A6A1C]">Your estimate is ready</p>
      <h2 className="mt-2 font-playfair text-[28px] font-medium leading-[1.15] tracking-[-0.015em] text-[#0B103B] md:text-[32px]">
        Here you go, {firstName}!
      </h2>
      <p className="mt-2 font-nunito text-[15px] text-[#57534C]">
        {home?.label} in {selection.city}{selection.locality ? `, ${selection.locality}` : ''}.{' '}
        {result.emailed ? (
          <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4 text-[#D9A441]" aria-hidden="true" /> A copy is on its way to <strong className="text-[#111]">{result.contact.email}</strong>.</span>
        ) : (
          'Our team will call you shortly to go through it.'
        )}
      </p>

      {/* Package switcher */}
      <div role="tablist" aria-label="Compare packages" className="mt-6 grid grid-cols-3 gap-2 print:hidden">
        {PACKAGES.map((p) => {
          const e = result.estimates[p.id];
          const active = shown === p.id;
          return (
            <button key={p.id} type="button" role="tab" aria-selected={active} onClick={() => setShown(p.id)}
              className={`rounded-xl border px-2 py-3 text-center transition-[border-color,background-color] duration-200 ${active ? 'border-[#0B103B] bg-[#0B103B] text-white' : 'border-[#0B103B]/15 bg-white text-[#0B103B] hover:border-[#D9A441]'}`}>
              <span className="block font-nunito text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-80">{p.name}</span>
              <span className="mt-1 block font-nunito text-[13px] font-bold tabular-nums sm:text-[14px]">from {formatInr(e.low)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#D9A441]/50">
        <div className="bg-gradient-to-br from-[#0B103B] to-[#19226A] px-6 py-6 text-white">
          <p className="font-nunito text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#F6D47C]">{PACKAGES.find((p) => p.id === shown)?.name} package · estimated cost</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={shown} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
              className="mt-2 font-playfair text-[34px] font-medium leading-tight tabular-nums md:text-[40px]">
              {formatRange(estimate.low, estimate.high)}
            </motion.p>
          </AnimatePresence>
        </div>
        <ul className="divide-y divide-[#0B103B]/10 bg-white px-6">
          {estimate.lines.map((l) => (
            <li key={l.label} className="flex items-baseline justify-between gap-4 py-3.5">
              <span className="font-nunito text-[14.5px] text-[#2A2A2A]">
                {l.label}{l.detail && <span className="ml-1.5 text-[13px] text-[#57534C]">{l.detail}</span>}
              </span>
              <span className="whitespace-nowrap font-nunito text-[14.5px] font-bold tabular-nums text-[#0B103B]">{formatRange(l.low, l.high)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl bg-[#F5F1E8] px-5 py-4">
        <p className="font-nunito text-[14px] font-bold text-[#0B103B]">Included free with every project</p>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {['In-house interior designer', '3D design before work starts', 'Written agreement, zero hidden cost', 'Warranty on work'].map((t) => (
            <li key={t} className="flex items-center gap-2 font-nunito text-[13px] text-[#2A2A2A]">
              <Check className="h-3.5 w-3.5 shrink-0 text-[#D9A441]" strokeWidth={3} aria-hidden="true" /> {t}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 font-nunito text-[12px] leading-relaxed text-[#57534C]">{ESTIMATE_DISCLAIMER}</p>

      <div className="mt-7 flex flex-col gap-3 print:hidden">
        <Link href="/book-consultation" className="btn-primary w-full">
          <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Book free site visit &amp; 3D design
        </Link>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="kv-btn w-full bg-[#25D366] text-white hover:bg-[#1FB457]">
            Discuss on WhatsApp
          </a>
          <button type="button" onClick={() => window.print()} className="btn-outline-dark w-full">
            <Download className="h-4 w-4" aria-hidden="true" /> Save as PDF
          </button>
        </div>
        <button type="button" onClick={onRestart} className="mx-auto mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 font-nunito text-[13.5px] font-bold text-[#57534C] hover:text-[#0B103B]">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start a new estimate
        </button>
      </div>
    </motion.div>
  );
}
