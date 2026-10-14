'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PROMO_DEFAULTS } from '@/constants/pageContent.js';

// Site-wide advertisement settings (edited in Admin -> Advertisement), loaded
// once per page visit from /api/content/promo. `active` is false until they
// arrive, so a switched-off ad never flashes on screen.
const PromoContext = createContext(null);

// Today's date in India (YYYY-MM-DD), for the start/end dates.
function todayInIndia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

// In admin text, "{discount}" becomes the discount number and "{title}" the offer name.
export function fillPromoText(text, promo) {
  return String(text || '').replaceAll('{discount}', String(promo.discount)).replaceAll('{title}', String(promo.title));
}

export default function PromoProvider({ children }) {
  const [state, setState] = useState({ loaded: false, fields: PROMO_DEFAULTS, image: null, version: 'default' });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/content/promo')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json?.ok) return;
        const { fields, heroImages, updatedAt } = json.data;
        setState({ loaded: true, fields: { ...PROMO_DEFAULTS, ...fields }, image: heroImages?.[0]?.url || null, version: updatedAt || 'default' });
      })
      .catch(() => !cancelled && setState((s) => ({ ...s, loaded: true })));
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => {
    const f = state.fields;
    const today = todayInIndia();
    const inDates = (!f.startDate || today >= f.startDate) && (!f.endDate || today <= f.endDate);
    return {
      ...f,
      tabLabel: fillPromoText(f.tabLabel, f),
      loaded: state.loaded,
      active: state.loaded && f.enabled && inDates,
      version: state.version,
      // Background uploaded in admin (replaces both built-in photos), or null
      customImage: state.image,
      // Saved on painting leads so the team sees which offer was claimed
      leadService: `Painting (${f.title} ${f.discount}% Off)`,
    };
  }, [state]);

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>;
}

export function usePromo() {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error('usePromo must be used inside <PromoProvider>');
  return ctx;
}
