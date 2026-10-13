import { readUsageEntries, usageTotals } from '@/server/aiUsage.js';
import { isDbConfigured } from '@/server/db.js';
import { DEFAULT_USD_TO_INR } from '@/constants/aiPricing.js';
import { Alert, Card, PageHeader } from '@/components/admin/ui.jsx';

// Sign-in is enforced by proxy.js and the (panel) layout like every other
// admin page. Always render fresh numbers.
export const dynamic = 'force-dynamic';

const FEATURE_LABELS = {
  'paint-visualizer': 'Paint Visualizer (wall/ceiling detection)',
  'paint-preview': 'Paint Visualizer (AI realistic preview)',
  'room-redesign': 'Try AI Design (room redesign)',
  'room-advisor': 'Design Advisor (room analysis)',
  'wall-painter': 'Wall Painter (Gemini test page)',
};

const DAYS_IN_CHART = 14;
const RECENT_COUNT = 25;
// Dates are grouped by the business's local day, not the server's (Vercel
// runs in UTC).
const TIME_ZONE = 'Asia/Kolkata';

const dayKey = (d) => d.toLocaleDateString('en-CA', { timeZone: TIME_ZONE });

function summarize(entries) {
  let calls = 0, tokens = 0, costUsd = 0, unpriced = 0;
  for (const e of entries) {
    calls++;
    tokens += e.input + e.textOutput + e.imageOutput;
    if (e.costUsd == null) unpriced++;
    else costUsd += e.costUsd;
  }
  return { calls, tokens, costUsd, unpriced };
}

function formatInr(usd, rate) {
  return `₹${(usd * rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatCard({ label, summary, rate }) {
  return (
    <Card className="p-5">
      <span className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#57534C]">{label}</span>
      <p className="mt-3 font-serif text-[36px] leading-none text-[#0B103B] tabular-nums">{formatInr(summary.costUsd, rate)}</p>
      <p className="mt-2 text-[13px] text-[#57534C]">
        ${summary.costUsd.toFixed(3)} · {summary.calls} AI calls · {summary.tokens.toLocaleString('en-IN')} tokens
      </p>
      {summary.unpriced > 0 && (
        <p className="mt-1 text-[12px] text-[#6B4E00]">+ {summary.unpriced} calls with no price set</p>
      )}
    </Card>
  );
}

const TH = 'px-4 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-[#57534C]';
const TD = 'px-4 py-3 text-[14px] text-[#111]';

export default async function AiUsagePage() {
  const rate = Number(process.env.USD_TO_INR) || DEFAULT_USD_TO_INR;
  const now = new Date();
  const today = dayKey(now);
  const [year, month] = today.split('-').map(Number);
  // The earliest date shown: the start of this month or of the 14-day chart,
  // whichever is earlier. Older history is only needed for the all-time total.
  const chartStart = new Date(now.getTime() - (DAYS_IN_CHART + 1) * 86_400_000);
  const monthStartUtc = new Date(Date.UTC(year, month - 1, 1) - 6 * 3_600_000);
  const from = chartStart < monthStartUtc ? chartStart : monthStartUtc;

  let entries = [];
  let allTime = { calls: 0, tokens: 0, costUsd: 0, unpriced: 0 };
  let error = '';
  if (!isDbConfigured()) {
    error = 'MongoDB is not configured, so AI usage is not being recorded.';
  } else {
    try {
      [entries, allTime] = await Promise.all([readUsageEntries(from), usageTotals()]);
    } catch (err) {
      console.error('[ai-usage] could not load usage:', err?.message);
      error = 'Could not load AI usage. Please try again.';
    }
  }
  entries = entries.map((e) => ({ ...e, day: dayKey(e.at) }));

  const monthPrefix = today.slice(0, 7);
  const todayEntries = entries.filter((e) => e.day === today);
  const monthEntries = entries.filter((e) => e.day.startsWith(monthPrefix));

  const byFeature = Object.entries(
    monthEntries.reduce((acc, e) => {
      (acc[e.feature] ||= []).push(e);
      return acc;
    }, {})
  )
    .map(([feature, list]) => ({ feature, ...summarize(list) }))
    .sort((a, b) => b.costUsd - a.costUsd);

  const days = [];
  for (let i = DAYS_IN_CHART - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const key = dayKey(d);
    days.push({
      key,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: TIME_ZONE }),
      ...summarize(entries.filter((e) => e.day === key)),
    });
  }
  const maxDayCost = Math.max(...days.map((d) => d.costUsd), 0.0001);

  const recent = entries.slice(-RECENT_COUNT).reverse();

  return (
    <>
      <PageHeader
        title="AI Usage & Cost"
        subtitle={`Estimated from tokens reported by Google at ₹${rate}/$. The exact bill is in Google AI Studio.`}
      />
      {error && <Alert>{error}</Alert>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
        <StatCard label="Today" summary={summarize(todayEntries)} rate={rate} />
        <StatCard
          label={now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: TIME_ZONE })}
          summary={summarize(monthEntries)}
          rate={rate}
        />
        <StatCard label="All time" summary={allTime} rate={rate} />
      </div>

      <h2 className="font-serif text-[22px] text-[#0B103B] mb-3">Last {DAYS_IN_CHART} days</h2>
      <Card className="p-5 mb-10 overflow-x-auto">
        <div className="flex items-end gap-2 h-40 min-w-[560px]">
          {days.map((d) => (
            <div
              key={d.key}
              className="flex-1 flex flex-col items-center justify-end h-full"
              title={`${d.label}: ${formatInr(d.costUsd, rate)} · ${d.calls} calls`}
            >
              <span className="text-[10.5px] text-[#57534C] mb-1 tabular-nums">{d.calls ? formatInr(d.costUsd, rate).replace('.00', '') : ''}</span>
              <div className="w-full rounded-t bg-[#F2B21B]" style={{ height: `${(d.costUsd / maxDayCost) * 100}%`, minHeight: d.calls ? 2 : 0 }} />
              <span className="text-[10.5px] text-[#57534C] mt-1.5 whitespace-nowrap">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="font-serif text-[22px] text-[#0B103B] mb-3">This month by feature</h2>
      <Card className="mb-10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#0B103B]/10">
              <th className={TH}>Feature</th>
              <th className={`${TH} text-right`}>Calls</th>
              <th className={`${TH} text-right`}>Tokens</th>
              <th className={`${TH} text-right`}>Cost</th>
              <th className={`${TH} text-right`}>Per call</th>
            </tr>
          </thead>
          <tbody>
            {byFeature.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[14px] text-[#57534C]">No AI calls yet this month.</td></tr>
            )}
            {byFeature.map((f) => (
              <tr key={f.feature} className="border-b border-[#0B103B]/5 last:border-0">
                <td className={TD}>{FEATURE_LABELS[f.feature] || f.feature}</td>
                <td className={`${TD} text-right tabular-nums`}>{f.calls}</td>
                <td className={`${TD} text-right tabular-nums`}>{f.tokens.toLocaleString('en-IN')}</td>
                <td className={`${TD} text-right tabular-nums`}>{f.unpriced === f.calls ? '—' : formatInr(f.costUsd, rate)}</td>
                <td className={`${TD} text-right tabular-nums`}>
                  {f.unpriced === f.calls ? '—' : formatInr(f.costUsd / (f.calls - f.unpriced), rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <h2 className="font-serif text-[22px] text-[#0B103B] mb-3">Recent calls</h2>
      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#0B103B]/10">
              <th className={TH}>Time</th>
              <th className={TH}>Feature</th>
              <th className={`${TH} text-right`}>Input</th>
              <th className={`${TH} text-right`}>Output</th>
              <th className={`${TH} text-right`}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[14px] text-[#57534C]">No AI calls recorded yet.</td></tr>
            )}
            {recent.map((e, i) => (
              <tr key={`${e.at.toISOString()}-${i}`} className="border-b border-[#0B103B]/5 last:border-0">
                <td className={`${TD} whitespace-nowrap`}>
                  {e.at.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: TIME_ZONE })}
                </td>
                <td className={TD}>{FEATURE_LABELS[e.feature] || e.feature}</td>
                <td className={`${TD} text-right tabular-nums`}>{e.input.toLocaleString('en-IN')}</td>
                <td className={`${TD} text-right tabular-nums`}>{(e.textOutput + e.imageOutput).toLocaleString('en-IN')}</td>
                <td className={`${TD} text-right tabular-nums`}>{e.costUsd == null ? '—' : formatInr(e.costUsd, rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
