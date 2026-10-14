'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, CalendarDays, Check, CheckCircle2, Home, Loader2, Lock, MessageCircle, Palette, PhoneCall, Video,
} from 'lucide-react';

import PageHero from '@/components/kv/PageHero.jsx';
import Reveal from '@/components/kv/Reveal.jsx';
import { submitLead } from '@/lib/submitLead.js';
import { usePromo } from '@/components/offers/PromoProvider.jsx';
import { LOCATIONS } from '@/constants/estimateConfig.js';
import { DIWALI_OFFER, PAINT_HOMES, PAINT_SCOPES } from '@/constants/offers.js';

// Free painting consultation (linked from the advertisement). Same flow and
// storage as /book-consultation: saved through /api/consultations, so it shows
// in Admin -> Consultations with service "Painting Consultation".

const MODES = [
  { id: 'Home visit', icon: Home, hint: 'Our expert visits, checks the walls and shows shade cards' },
  { id: 'Phone call', icon: PhoneCall, hint: 'A quick call to plan colours and budget' },
  { id: 'Video call', icon: Video, hint: 'Show us your walls live on WhatsApp video' },
];

const HELP = ['Choosing colours', 'Damp / seepage problem', 'Cracks & wall repair', 'Texture / accent wall', 'Budget estimate', 'Exterior painting'];

const label = (list, id) => list.find((x) => x.id === id)?.label || '';

export default function PaintConsultationPage() {
  const promo = usePromo();
  const offer = promo.active;
  const [sent, setSent] = useState(null);
  const [error, setError] = useState('');
  const [choices, setChoices] = useState({ home: '', scope: '', mode: 'Home visit', help: [] });
  const [choiceError, setChoiceError] = useState('');
  // Earliest selectable slot on the visitor's own clock (set after mount: the page is prerendered).
  const [minDateTime, setMinDateTime] = useState('');
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', city: '', locality: '', datetime: '', message: '', website: '' },
  });

  const pick = (key, value) => { setChoices((c) => ({ ...c, [key]: c[key] === value && key !== 'mode' ? '' : value })); setChoiceError(''); };
  const toggleHelp = (h) => setChoices((c) => ({ ...c, help: c.help.includes(h) ? c.help.filter((x) => x !== h) : [...c.help, h] }));

  // Runs on submit, and also when other fields are invalid, so every problem shows at once.
  const checkChoices = () => {
    if (choices.home && choices.scope) return true;
    setChoiceError('Please choose your home type and what needs painting.');
    document.getElementById('pc-home')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  };

  const onSubmit = async (form) => {
    if (!checkChoices()) return;
    setError('');
    const notes = [
      form.locality.trim() && `Area: ${form.locality.trim()}`,
      choices.help.length > 0 && `Needs help with: ${choices.help.join(', ')}`,
      form.message.trim() && `Message: ${form.message.trim()}`,
    ].filter(Boolean).join('\n');
    const result = await submitLead('/api/consultations', {
      name: form.name,
      phone: form.phone.replace(/\D/g, '').slice(-10),
      email: form.email,
      city: form.locality.trim() ? `${form.city}, ${form.locality.trim()}` : form.city,
      service: offer ? `Painting Consultation (${promo.title} ${promo.discount}% Off)` : 'Painting Consultation',
      projectType: `${label(PAINT_HOMES, choices.home)} · ${label(PAINT_SCOPES, choices.scope)} · ${choices.mode}`,
      datetime: form.datetime,
      message: notes,
      website: form.website,
    });
    if (!result.ok) {
      setError(Object.values(result.fields)[0] || result.message);
      return;
    }
    setSent({ name: form.name.trim().split(/\s+/)[0], phone: form.phone, datetime: form.datetime, mode: choices.mode });
    document.getElementById('paint-consultation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FAFAF7] text-[#111111]">
      <PageHero
        image="/offers/ad-desktop-1600.jpg"
        eyebrow={offer ? `${promo.title} Offer · ${promo.discount}% Off Painting` : 'Free Paint Consultation'}
        title="Book a Free Paint Consultation"
        emphasis="Paint Consultation"
        lead="Not sure which colours, finish or brand suit your home? Our painting expert helps you choose, checks your walls for damp or cracks, and plans a budget, free of charge."
        badges={['100% Free', 'Any Paint Brand', 'No Obligation']}
      />

      <section id="paint-consultation" className="kv-section scroll-mt-24 bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
            <Reveal>
              <div className="rounded-lg border-t-[4px] border-[#D9A441] bg-white p-6 shadow-card md:p-10">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center" role="status">
                      <div className="animate-scale-in mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2B21B]/15">
                        <CheckCircle2 className="h-9 w-9 text-[#D9A441]" aria-hidden="true" />
                      </div>
                      <h2 className="mt-5 font-playfair text-[26px] font-medium leading-tight text-[#0B103B] md:text-[30px]">Thank you, {sent.name}!</h2>
                      <p className="mx-auto mt-3 max-w-[460px] font-nunito text-[15px] leading-[1.7] text-[#57534C]">
                        Your <strong className="text-[#0B103B]">{sent.mode.toLowerCase()}</strong> is requested for{' '}
                        <strong className="text-[#0B103B]">
                          {new Date(sent.datetime).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                        </strong>. We&apos;ll call you on <strong className="text-[#0B103B]">{sent.phone}</strong> to confirm.
                        {offer && <> Your <strong className="text-[#0B103B]">{promo.discount}% {promo.title} discount</strong> is noted.</>}
                      </p>
                      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                        <a href={`https://wa.me/918460150027?text=${encodeURIComponent(`Hi KailVarn, I just booked a paint consultation. My name is ${sent.name}.`)}`} target="_blank" rel="noreferrer" className="kv-btn bg-[#25D366] text-white hover:bg-[#1FB457]">
                          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" /> Say hi on WhatsApp
                        </a>
                        <Link href={DIWALI_OFFER.visualizerPath} className="btn-outline-dark">
                          <Palette className="h-[18px] w-[18px]" aria-hidden="true" /> Try colours on your wall
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit, checkChoices)} noValidate className="relative">
                      <div className="mb-8 border-b border-[#0B103B]/10 pb-6">
                        <h2 className="font-playfair text-[26px] font-medium leading-[1.15] tracking-[-0.015em] text-[#0B103B] md:text-[30px]">Tell us about your home</h2>
                        <p className="mt-2 font-nunito text-[15px] text-[#57534C]">Takes under a minute. We&apos;ll confirm your slot by phone.</p>
                      </div>
                      {/* Spam trap: hidden from people, bots fill it in */}
                      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" {...register('website')} />

                      <div className="space-y-7">
                        <ChipGroup id="pc-home" title="Your home" options={PAINT_HOMES} value={choices.home} onPick={(v) => pick('home', v)} required />
                        <ChipGroup title="What needs painting?" options={PAINT_SCOPES} value={choices.scope} onPick={(v) => pick('scope', v)} required />
                        {choiceError && <p role="alert" className="-mt-3 font-nunito text-[12.5px] text-[#C62828]">{choiceError}</p>}

                        <fieldset>
                          <legend className="mb-3 font-nunito text-[14px] font-bold text-[#0B103B]">How would you like to meet?</legend>
                          <div role="radiogroup" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {MODES.map(({ id, icon: Icon, hint }) => {
                              const on = choices.mode === id;
                              return (
                                <button key={id} type="button" role="radio" aria-checked={on} onClick={() => pick('mode', id)}
                                  className={`relative rounded-xl border p-4 text-left transition-[border-color,box-shadow,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${on ? 'border-[#D9A441] bg-[#FFFBF0] shadow-[0_0_0_1px_#D9A441]' : 'border-[#0B103B]/15 bg-white hover:border-[#D9A441]/60'}`}>
                                  {on && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2B21B] text-[#0B103B]" aria-hidden="true"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>}
                                  <Icon className="mb-2 h-5 w-5 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
                                  <span className="block font-nunito text-[15px] font-bold text-[#0B103B]">{id}</span>
                                  <span className="mt-0.5 block font-nunito text-[12.5px] leading-snug text-[#57534C]">{hint}</span>
                                </button>
                              );
                            })}
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="mb-3 font-nunito text-[14px] font-bold text-[#0B103B]">
                            What do you need help with? <span className="font-normal text-[#57534C]">(optional, pick any)</span>
                          </legend>
                          <div className="flex flex-wrap gap-2.5">
                            {HELP.map((h) => <Chip key={h} on={choices.help.includes(h)} onClick={() => toggleHelp(h)} multi>{h}</Chip>)}
                          </div>
                        </fieldset>
                      </div>

                      <div className="mt-9 space-y-5 border-t border-[#0B103B]/10 pt-8">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <Field id="pc-name" label="Full name" error={errors.name?.message}>
                            <input id="pc-name" type="text" autoComplete="name" placeholder="e.g. Rahul Patel"
                              {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter your name' } })}
                              className={`form-input-base ${errors.name ? 'form-input-error' : 'form-input-focus'}`} />
                          </Field>
                          <Field id="pc-phone" label="Mobile number" error={errors.phone?.message}>
                            <div className="relative">
                              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#57534C]">+91</span>
                              <input id="pc-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210"
                                {...register('phone', { required: 'Please enter your mobile number', validate: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10)) || 'Enter a valid 10-digit mobile number' })}
                                className={`form-input-base pl-[52px] ${errors.phone ? 'form-input-error' : 'form-input-focus'}`} />
                            </div>
                          </Field>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <Field id="pc-city" label="City" error={errors.city?.message}>
                            <select id="pc-city" defaultValue="" {...register('city', { required: 'Please choose your city' })}
                              className={`form-input-base appearance-none bg-[length:16px] bg-[position:right_16px_center] bg-no-repeat pr-10 ${errors.city ? 'form-input-error' : 'form-input-focus'}`}
                              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}>
                              <option value="" disabled>Select your city</option>
                              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </Field>
                          <Field id="pc-locality" label={<>Area / society <span className="font-normal text-[#57534C]">(optional)</span></>}>
                            <input id="pc-locality" type="text" maxLength={80} autoComplete="address-level3" placeholder="e.g. Amli, GIDC, Chala…" {...register('locality')} className="form-input-base form-input-focus" />
                          </Field>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <Field id="pc-datetime" label="Preferred date & time" error={errors.datetime?.message}>
                            <input id="pc-datetime" type="datetime-local" min={minDateTime || undefined}
                              {...register('datetime', { required: 'Please choose a date and time', validate: (v) => !v || new Date(v).getTime() > Date.now() - 60_000 || 'Please choose a date and time in the future' })}
                              className={`form-input-base ${errors.datetime ? 'form-input-error' : 'form-input-focus'}`} />
                          </Field>
                          <Field id="pc-email" label={<>Email <span className="font-normal text-[#57534C]">(optional)</span></>} error={errors.email?.message}>
                            <input id="pc-email" type="email" autoComplete="email" placeholder="name@example.com"
                              {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })}
                              className={`form-input-base ${errors.email ? 'form-input-error' : 'form-input-focus'}`} />
                          </Field>
                        </div>
                        <Field id="pc-message" label={<>Anything we should know? <span className="font-normal text-[#57534C]">(optional)</span></>} error={errors.message?.message}>
                          <textarea id="pc-message" rows={3} placeholder="e.g. seepage in the bedroom, want a pooja-room accent colour"
                            {...register('message', { maxLength: { value: 500, message: 'Max 500 characters' } })}
                            className={`form-input-base resize-none ${errors.message ? 'form-input-error' : 'form-input-focus'}`} />
                        </Field>
                      </div>

                      {error && <p role="alert" className="mt-5 rounded-lg border border-[#C62828]/30 bg-[#C62828]/[0.06] px-4 py-3 font-nunito text-[14px] text-[#8C1D18]">{error}</p>}

                      <button type="submit" disabled={isSubmitting} className="btn-primary mt-8 w-full">
                        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Booking…</> : <><CalendarDays className="h-4 w-4" aria-hidden="true" /> Book my free consultation</>}
                      </button>
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-nunito text-[12px] text-[#57534C]">
                        <Lock className="h-3 w-3 shrink-0" aria-hidden="true" /> Free and no obligation. We never spam or share your number.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="space-y-6">
              <div className="rounded-lg border border-[#0B103B]/10 bg-white p-6">
                <h3 className="font-serif text-[22px] text-[#0B103B]">In your free consultation</h3>
                <ul className="mt-4 space-y-3">
                  {['Colour and shade-card guidance for every room', 'Wall check for damp, seepage and cracks', 'The right finish and brand for your budget', 'A clear idea of cost before any work'].map((item) => (
                    <li key={item} className="flex items-start gap-3 font-nunito text-[14.5px] leading-[1.55] text-[#2A2A2A]">
                      <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#D9A441]" strokeWidth={1.75} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {offer && (
                <div className="rounded-lg border border-[#E9B949]/70 bg-[linear-gradient(135deg,#7A1418_0%,#4E0B0E_100%)] p-6 text-white">
                  <p className="font-nunito text-[12px] font-bold uppercase tracking-[0.2em] text-[#F6D47C]">{promo.title} offer</p>
                  <p className="mt-2 font-serif text-[34px] font-bold leading-none text-[#FFD45A]">{promo.discount}% off painting</p>
                  <p className="mt-2 font-nunito text-[14.5px] text-white/85">with any paint brand. Already decided?</p>
                  <Link href={DIWALI_OFFER.quotePath} className="btn-primary mt-4 w-full">
                    Get my painting quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
              <div className="rounded-lg bg-[#0B103B] p-6 text-white">
                <Palette className="h-7 w-7 text-[#F2B21B]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-3 font-serif text-[22px]">Want a preview first?</h3>
                <p className="mt-2 font-nunito text-[14.5px] leading-[1.6] text-white/75">Upload a photo of your room and try shades on your own walls.</p>
                <Link href={DIWALI_OFFER.visualizerPath} className="btn-outline mt-5 w-full">Try the Colour Visualizer</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChipGroup({ id, title, options, value, onPick, required }) {
  return (
    <fieldset id={id}>
      <legend className="mb-3 font-nunito text-[14px] font-bold text-[#0B103B]">
        {title}{required && <span className="text-[#B7791F]" aria-hidden="true"> *</span>}
      </legend>
      <div role="radiogroup" className="flex flex-wrap gap-2.5">
        {options.map((o) => <Chip key={o.id} on={value === o.id} onClick={() => onPick(o.id)} radio>{o.label}</Chip>)}
      </div>
    </fieldset>
  );
}

function Chip({ on, onClick, multi, radio, children }) {
  return (
    <button
      type="button"
      role={radio ? 'radio' : undefined}
      aria-checked={radio ? on : undefined}
      aria-pressed={radio ? undefined : on}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 font-nunito text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${on ? 'border-[#D9A441] bg-[#0B103B] text-white' : 'border-[#0B103B]/15 bg-white text-[#2A2A2A] hover:border-[#D9A441]/70'}`}
    >
      {(multi || on) && <Check className={`h-3.5 w-3.5 ${on ? 'text-[#F2B21B]' : 'text-[#0B103B]/30'}`} strokeWidth={2.5} aria-hidden="true" />}
      {children}
    </button>
  );
}

function Field({ id, label: text, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-[6px] block font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">{text}</label>
      {children}
      {error && <p className="mt-1.5 font-nunito text-[12px] text-[#C62828]">{error}</p>}
    </div>
  );
}
