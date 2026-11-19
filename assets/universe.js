/* FinDeependence Universe · shell.
 * Reads the public data feeds that the six desks already publish, merges them into one IPO picture,
 * and hosts every desk (unchanged) inside one app. Desk data stays in this browser. */

/* =================== desks =================== */
import { createMembers } from './members.js';

const I = {
  radar: '<path d="M12 12 19 5"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  bank: '<path d="M3 10h18L12 4z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.2 4.4 2 5 5"/>',
  deal: '<path d="M3 12l4-4 4 3 3-3 7 6"/><path d="M7 8 4 5M17 14l-3 3-3-2-2 2"/><path d="M2 13l5 5M22 13l-5 5"/>',
  rights: '<path d="M4 4h12l4 4v12H4z"/><path d="M16 4v4h4"/><path d="m8 14 2.5 2.5L16 11"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  lab: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3"/><path d="M7 14h10"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17" r=".9" fill="currentColor"/>',
  reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bell: '<path d="M18 15.5V11a6 6 0 0 0-12 0v4.5L4.5 18h15z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  ig: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/>',
};
const svg = (k, sw = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[k] || ''}</svg>`;

const DESKS = [
  { id: 'ipo-tracker', n: '01', name: 'IPO Tracker', long: 'Live IPO Tracker & Decision Toolkit', color: '#7FD3D6', icon: 'radar', path: 'apps/ipo-tracker/index.html',
    plain: 'See every live IPO, how much each investor group has applied for, and your real chance of getting shares.',
    feats: ['Live QIB · sHNI · bHNI · Retail', 'SEBI allotment odds', 'Family PAN planner', 'Capital planner', 'Scenarios', 'My Book P/L'],
    steps: ['Choose Open, Upcoming or Closed / Listed at the top.', 'Tap “Full Details & Calculator” on any IPO card for odds, quota split, GMP and the verdict score.', 'Use 💰 Plan to spread your money across IPOs, 🎯 Scenarios to stress-test, and 📒 My Book to log results.'],
    tabs: ['Open', 'Upcoming', 'Closed / Listed', 'Calendar', 'Plan', 'Scenarios', 'My Book', 'QIB mode', 'Excel export'],
    tour: ['Live category-wise subscription for every Mainboard and SME IPO', 'Allotment odds under SEBI rules, with a family PAN planner', 'Capital Allocation Planner, Scenario engine and fund-manager EV ranking'] },
  { id: 'qib-desk', n: '02', name: 'QIB Allotment Desk', long: 'SEBI ICDR Schedule XIV allotment, to the share', color: '#E8B04A', icon: 'bank', path: 'apps/qib-desk/docs/index.html',
    plain: 'Type your QIB bid amount and see exactly how many shares you will get under SEBI rules, and your listing profit.',
    feats: ['Net QIB ex-anchor', '5% MF reserve', 'Exact mode (BoA)', 'Calibration', 'GMP ladder', 'A4 PDF report'],
    steps: ['Pick the IPO from the list at the top (or use manual entry).', 'Enter your bid amount, or lots / shares. Live QIB ×, net QIB and MF demand are pre-filled.', 'Read the expected allotment and P&L ladder, then press ⬇ PDF report.'],
    tabs: ['Open', 'Upcoming', 'Closed', 'Listed', 'Method & working', 'Verify vs past allotments', 'PDF report'],
    tour: ['Uses net QIB (ex-anchor) and the 5% mutual-fund reserve, like the registrar', 'Exact mode from the Basis of Allotment, calibrated on your real allotments', 'Profit ladder from current GMP and a one-page A4 PDF'] },
  { id: 'max-profit', n: '03', name: 'Max-Profit Planner', long: 'QIB application, allotment & profit desk', color: '#5FC22A', icon: 'trend', path: 'apps/max-profit/index.html',
    plain: 'Put in your amount and see the profit at every subscription level, then compare all IPOs on the same money.',
    feats: ['4-number calculator', 'Profit vs subscription', 'Compare IPOs', 'Rounding modes', 'PDF reports', 'Import / export'],
    steps: ['① Pick an IPO.', '② Check your 4 numbers (pre-filled with live data). Just type to change them.', '③ Read what you get, then ④ download the PDF. Use Compare IPOs to rank all IPOs on one amount.'],
    tabs: ['Calculator & Report', 'Compare IPOs', 'Manage IPOs', 'Refresh GMP & subscription'],
    tour: ['Pre-filled live GMP, subscription and max QIB bid', 'Profit at every subscription level, with SEBI / registrar rounding', 'Side-by-side yield comparison with a comparison PDF'] },
  { id: 'hni-ledger', n: '04', name: 'HNI IPO Ledger', long: 'sHNI / bHNI applications across family accounts', color: '#8DB8F0', icon: 'users', path: 'apps/hni-ledger/site/index.html',
    plain: 'Record which family account applied in which IPO (sHNI or bHNI), check allotment in one click, and download reports.',
    feats: ['sHNI / bHNI lot rules', 'Unique application no.', 'One-click allotment', 'Bigshare auto-check', 'Excel · PDF', 'Backup / restore'],
    steps: ['Apply tab: pick the IPO, then tap sHNI, bHNI or None for each account and enter the application no.', 'Allotment tab: “Check allotment ↗” opens the registrar with the number copied. Mark Allotted / Not allotted.', 'Reports tab: By IPO, By account, Matrix or All rows, then Excel or PDF.'],
    tabs: ['Apply', 'Allotment', 'Reports', 'IPOs', 'Accounts', 'Backup'],
    tour: ['Lots auto-set to the sHNI / bHNI minimum at the upper band', 'One-click registrar checks; Bigshare results fill in by themselves', 'IPO-wise and account-wise reports in Excel and PDF'] },
  { id: 'deal-desk', n: '05', name: 'IPO Deal Desk', long: 'Kostak · Subject-to · premium deals and P&L', color: '#B79CFF', icon: 'deal', path: 'apps/deal-desk/site/index.html',
    plain: 'Track IPO deals with investors and brokers (Kostak, Subject-to, premium) and see your profit, receivables and payables.',
    feats: ['Profit dashboard', 'Deals & settlement', 'SEBI chance of allotment', 'Predictor (past IPOs)', 'Ledgers Excel · PDF', 'Investors & brokers'],
    steps: ['Investors & Brokers: add people one by one or in bulk (name + PAN).', 'Deals: for each investor pick the category, the deal and the broker. Record the allotment and settle up.', 'Dashboard and Reports show profit, receivables and payables by IPO, investor, broker and month.'],
    tabs: ['Dashboard', 'IPOs & GMP', 'Deals', 'Calculator', 'Predictor', 'Reports', 'Investors & Brokers', 'Data & Settings'],
    tour: ['What you will receive, pay and earn, per IPO, investor and broker', 'Predictor trained on hundreds of past IPOs', 'Monthly, IPO-wise, investor and broker ledgers'] },
  { id: 'rights', n: '06', name: 'Rights Issue Analyser', long: 'Live rights issues, RE ratings & credit check', color: '#FF9F7A', icon: 'rights', path: 'apps/rights/index.html',
    plain: 'See every open and upcoming rights issue with a 0–100 rating, a credit check and a plain “apply or sell your RE” action.',
    feats: ['RE rating 0–100', 'Credit & default check', 'Date-wise subscription', 'Volume & highs / lows', 'TERP · RE fair value', 'Calendar'],
    steps: ['Open the ⭐ RE Ratings tab to see every live issue scored out of 100.', 'Tap “Full analysis →” on an issue for the action if you hold the shares, and if you don’t.', 'Use Subscription, Volume & Highs/Lows and Calendar for the details.'],
    tabs: ['Open', 'Upcoming', 'Closed', 'RE Ratings', 'Subscription', 'Volume & Highs/Lows', 'Calendar'],
    tour: ['Every rights issue scored 0–100 with a 5-star rating', 'Credit rating and default history from the agencies’ own documents', 'TERP, RE fair value and an entitlement calculator'] },
];
const DESK = Object.fromEntries(DESKS.map((d) => [d.id, d]));

/* =================== helpers =================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v) => (v === null || v === undefined || v === '' || Number.isNaN(+v) ? null : +v);
const IST = () => new Date(Date.now() + 5.5 * 3600e3);
const todayIST = () => IST().toISOString().slice(0, 10);
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dShort = (iso) => { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${+m[3]} ${MON[+m[2] - 1]}` : '—'; };
const inr = (n, d = 0) => (n == null ? '—' : '₹' + (+n).toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: 0 }));
const money = (n) => { if (n == null) return '—'; const a = Math.abs(n); return a >= 1e7 ? `₹${(n / 1e7).toFixed(a >= 1e9 ? 0 : 2)} Cr` : a >= 1e5 ? `₹${(n / 1e5).toFixed(2)} L` : inr(n); };
const cr = (n) => (n == null ? '—' : `₹${(+n).toLocaleString('en-IN', { maximumFractionDigits: n < 100 ? 1 : 0 })} Cr`);
const x = (n) => (n == null ? '—' : `${(+n).toLocaleString('en-IN', { maximumFractionDigits: n >= 100 ? 0 : n >= 10 ? 1 : 2 })}×`);
const pct = (n, d = 1) => (n == null ? '—' : `${n > 0 ? '+' : ''}${(+n).toFixed(d)}%`);
const ago = (iso) => { if (!iso) return 'unknown'; const t = new Date(iso).getTime(); if (!t) return 'unknown'; const m = Math.round((Date.now() - t) / 6e4); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const nameKey = (s) => String(s ?? '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/\b(ltd|limited|ipo|india|the|company|co|pvt|private|sme|nse|bse|tentative|date)\b/g, '').replace(/[^a-z0-9]/g, '');
const sameName = (a, b) => { const p = nameKey(a), q = nameKey(b); if (!p || !q) return false; if (p === q) return true; const [s, l] = p.length < q.length ? [p, q] : [q, p]; return s.length >= 6 && l.startsWith(s); };
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); };
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =================== data =================== */
const FEEDS = {
  deal: { url: 'apps/deal-desk/site/ipos.json', label: 'IPO list, GMP & subscription', desk: 'deal-desk' },
  qib: { url: 'apps/qib-desk/docs/data/ipos.json', label: 'QIB demand, net QIB & anchor', desk: 'qib-desk' },
  hni: { url: 'apps/hni-ledger/site/ipos.json', label: 'NSE IPO feed & registrars', desk: 'hni-ledger' },
  gmp: { url: 'apps/max-profit/gmp.json', label: 'GMP & max QIB bid', desk: 'max-profit' },
  rights: { url: 'apps/rights/data/rights.json', label: 'Rights issues, prices & credit', desk: 'rights' },
  hist: { url: 'apps/deal-desk/site/history.json', label: 'Past IPO history (listing gains)', desk: 'deal-desk' },
};
const S = { ipos: [], rights: [], hist: [], meta: {}, tab: null, board: 'all', q: '', sort: { k: 'key', dir: 1 }, lab: { seg: 'all', per: 12 } };
const M = createMembers({ S, $, $$, esc, svg, toast, dShort, inr, pct, todayIST, addDays, radarRows: () => radarRows(),
  onUnlock: () => { loadAll().then(() => { refreshAll(); M.runAlerts(); }); }, onLock: () => closeDesk() });

async function getJSON(url) {
  let err;
  for (const u of M.feedUrls(url)) { // members: repository first (fresher), then this site
    try {
      const r = await fetch(u + (u.includes('?') ? '&' : '?') + 't=' + Math.floor(Date.now() / 6e4), { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) { err = e; }
  }
  throw err;
}

function statusOf(o, today) {
  if (o.listing && today >= o.listing) return 'listed';
  if (o.open && today < o.open) return 'upcoming';
  if (o.open && o.close && today >= o.open && today <= o.close) return 'open';
  if (o.close && today > o.close) return 'closed';
  return 'upcoming';
}

function mergeIpos(feeds) {
  const list = [];
  const find = (name) => list.find((o) => sameName(o.name, name));
  const fill = (o, src) => { for (const [k, v] of Object.entries(src)) if (v !== null && v !== undefined && v !== '' && (o[k] === null || o[k] === undefined || o[k] === '')) o[k] = v; };
  const add = (rec, srcName) => { let o = find(rec.name); if (!o) { o = { src: [] }; list.push(o); } fill(o, rec); if (!o.src.includes(srcName)) o.src.push(srcName); return o; };

  (feeds.deal?.ipos || []).forEach((i) => add({
    name: i.name, board: i.type === 'SME' ? 'SME' : 'Mainboard', exchange: i.exchange, priceLow: num(i.priceLow), priceHigh: num(i.priceHigh), lot: num(i.lotSize),
    sizeCr: num(i.issueSizeCr), open: i.openDate, close: i.closeDate, allot: i.allotmentDate, listing: i.listingDate, gmp: num(i.gmp),
    gmpHist: (i.gmpHistory || []).map((g) => ({ t: g.t, v: num(g.g) })).filter((g) => g.v != null), subTotal: num(i.subTotal), sub: i.sub, apps: i.apps, lots: i.lots,
    registrar: i.registrar, listingPrice: num(i.listingPrice), symbol: i.symbol, url: i.ippUrl, subAt: i.sub ? i.subUpdated : null,
  }, 'Deal Desk'));

  const q = feeds.qib?.ipos; const qv = Array.isArray(q) ? q : Object.values(q || {});
  qv.forEach((i) => {
    if (!i || !i.name) return;
    const sub = i.subscription ? Object.fromEntries(Object.entries(i.subscription).map(([k, v]) => [k, { times: num(v && v.times), offered: num(v && v.shares_offered), applied: num(v && v.shares_bid) }])) : null;
    const eff = i.effective || {};
    add({
      name: i.name.replace(/\s*\(.*?\)\s*/g, ' ').trim(), board: i.is_sme ? 'SME' : 'Mainboard', exchange: i.exchange, priceLow: num(i.price_band_low), priceHigh: num(i.price_band_high), lot: num(i.lot_size),
      open: i.open_date, close: i.close_date, allot: i.allotment_date, listing: i.listing_date, gmp: num(i.gmp),
      gmpHist: (i.gmp_history || []).map((g) => ({ t: g.at, v: num(g.gmp) })).filter((g) => g.v != null), sub, subTotal: sub && sub.total ? sub.total.times : null,
      subAt: sub ? (((i.subscription_history || []).slice(-1)[0] || {}).at || feeds.qib.updated) : null, netQib: num(eff.net_qib_shares ?? i.qib_shares_offered), anchor: num(i.anchor_shares), mfDemand: num(eff.mf_demand_shares), listingPrice: num(eff.listing_price ?? i.listing_price), url: i.url,
    }, 'QIB Desk');
  });

  (feeds.hni?.ipos || []).forEach((i) => add({
    name: i.name.replace(/\s+Limited$/i, ''), board: i.type === 'SME' ? 'SME' : 'Mainboard', exchange: i.exchange, priceLow: num(i.priceLow), priceHigh: num(i.priceHigh), lot: num(i.lotSize),
    open: i.openDate, close: i.closeDate, allot: i.allotmentDate, listing: i.listingDate, registrar: i.registrar, symbol: i.symbol,
  }, 'NSE'));

  (feeds.gmp?.ipos || []).forEach((i) => add({
    name: i.name, board: /sme/i.test(i.exch || '') ? 'SME' : 'Mainboard', exchange: i.exch, priceLow: num(i.priceLow), priceHigh: num(i.priceHigh), lot: num(i.lot),
    sizeCr: num(i.issueCr), open: i.open, close: i.close, allot: i.allot, listing: i.listing, gmp: num(i.gmp), subTotal: num(i.subs), maxQib: num(i.maxQibSh),
  }, 'Planner'));

  const today = todayIST();
  list.forEach((o) => {
    o.key = nameKey(o.name) || Math.random().toString(36).slice(2);
    o.status = statusOf(o, today);
    if (o.sub && o.sub.total && num(o.sub.total.times) != null) o.subTotal = num(o.sub.total.times); // one source for total + categories
    o.price = o.priceHigh || o.priceLow || null;
    o.gmpPct = o.price && o.gmp != null ? (o.gmp / o.price) * 100 : null;
    o.estList = o.price && o.gmp != null ? o.price + o.gmp : null;
    o.lotAmt = o.price && o.lot ? o.price * o.lot : null;
    o.listGain = o.listingPrice && o.price ? ((o.listingPrice - o.price) / o.price) * 100 : null;
    const ap = o.apps || {};
    const od = (t) => (t == null ? null : t <= 1 ? 1 : 1 / t);
    o.odds = { retail: od(ap.retail && num(ap.retail.times)), snii: od(ap.snii && num(ap.snii.times)), bnii: od(ap.bnii && num(ap.bnii.times)) };
    o.oddsApprox = !o.odds.retail && o.sub && o.sub.retail && num(o.sub.retail.times) != null ? od(num(o.sub.retail.times)) : null;
    o.when = o.status === 'upcoming' ? o.open : o.status === 'open' ? o.close : o.status === 'closed' ? (o.listing || o.close) : o.listing;
  });
  // keep the useful window: everything live, plus 45 days of listings
  return list.filter((o) => o.status !== 'listed' || (o.listing && dayDiff(o.listing, today) <= 45));
}

async function loadAll() {
  const keys = Object.keys(FEEDS).filter((k) => k !== 'hist');
  const res = await Promise.allSettled(keys.map((k) => getJSON(FEEDS[k].url)));
  const feeds = {};
  res.forEach((r, i) => {
    const k = keys[i];
    if (r.status === 'fulfilled') {
      feeds[k] = r.value;
      const v = r.value;
      S.meta[k] = { ok: true, at: v.updatedAt || v.updated || v.generatedAt || v.checkedAt || null, n: (Array.isArray(v.ipos) ? v.ipos.length : v.ipos ? Object.keys(v.ipos).length : (v.issues || []).length) };
    } else S.meta[k] = { ok: false };
  });
  S.ipos = mergeIpos(feeds);
  const t = todayIST();
  S.rights = (feeds.rights?.issues || []).map((r) => ({
    ...r, feedStatus: r.status,
    status: r.open && r.close ? (t < r.open ? 'upcoming' : t <= r.close ? 'open' : 'closed') : r.status,
    disc: r.cmp && r.price ? ((r.cmp - r.price) / r.cmp) * 100 : null,
  }));
}

async function loadHistory() {
  try {
    const h = await getJSON(FEEDS.hist.url);
    S.meta.hist = { ok: true, at: h.ippUpdatedAt || h.updatedAt, n: (h.ipos || []).length };
    S.hist = (h.ipos || []).filter((i) => num(i.listingGainPct) != null && num(i.total) != null && i.listingDate)
      .map((i) => ({ name: i.name, seg: /sme/i.test(i.seg || i.exchange || '') ? 'SME' : 'Mainboard', sub: +i.total, gain: +i.listingGainPct, date: i.listingDate, gmpFinal: num(i.gmpFinal), price: num(i.price), sizeCr: num(i.sizeCr) }));
  } catch (e) { S.meta.hist = { ok: false }; S.hist = []; }
}

/* =================== hero: KPIs + ticker =================== */
function renderKpis() {
  const open = S.ipos.filter((o) => o.status === 'open'), up = S.ipos.filter((o) => o.status === 'upcoming');
  const g = open.filter((o) => o.gmpPct != null), avg = g.length ? g.reduce((a, o) => a + o.gmpPct, 0) / g.length : null;
  const today = todayIST(), wk = addDays(today, 7);
  const listing = S.ipos.filter((o) => o.listing && o.listing >= today && o.listing <= wk).length;
  const rOpen = S.rights.filter((r) => r.status === 'open').length;
  const k = [['Open now', open.length, 'IPOs'], ['Upcoming', up.length, ''], ['Avg GMP · open', avg == null ? '—' : (avg >= 0 ? '+' : '') + avg.toFixed(1), avg == null ? '' : '%'], ['Listing in 7d', listing, ''], ['Rights open', rOpen, '']];
  $('#kpis').innerHTML = k.map(([l, v, s]) => `<div class="kpi"><div class="lbl">${l}</div><div class="v" data-count="${typeof v === 'number' ? v : ''}">${esc(v)}<small>${s}</small></div></div>`).join('');
  $$('#kpis [data-count]').forEach((el) => { const n = +el.dataset.count; if (!el.dataset.count || reduceMotion) return; const small = el.querySelector('small').outerHTML; let s = 0; const t0 = performance.now(); const step = (t) => { s = Math.min((t - t0) / 900, 1); el.innerHTML = Math.round(n * (1 - Math.pow(1 - s, 3))) + small; if (s < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  $('#liveLine').textContent = `Live · ${S.ipos.length} IPOs · ${S.rights.filter((r) => r.status !== 'closed').length} rights issues · 6 desks`;
}

function renderTicker() {
  const items = S.ipos.filter((o) => o.status !== 'listed').sort((a, b) => (a.when || '').localeCompare(b.when || ''));
  const html = items.map((o) => `<button class="tk" data-ipo="${esc(o.key)}"><span class="chip ${o.status}">${o.status === 'open' ? 'OPEN' : o.status === 'upcoming' ? 'SOON' : 'CLOSED'}</span><b>${esc(o.name)}</b><span class="mono" style="font-size:11px;color:#8FA3B6">${o.board.toUpperCase()}</span>${o.gmp != null ? `<span class="g ${o.gmp > 0 ? 'pos' : o.gmp < 0 ? 'neg' : ''}">GMP ${inr(o.gmp)} ${o.gmpPct != null ? `(${pct(o.gmpPct)})` : ''}</span>` : ''}${o.subTotal ? `<span class="mono" style="font-size:12px">${x(o.subTotal)}</span>` : ''}<span style="color:#8FA3B6;font-size:12px">${o.status === 'upcoming' ? 'opens ' + dShort(o.open) : o.status === 'open' ? 'closes ' + dShort(o.close) : 'lists ' + dShort(o.listing)}</span></button>`).join('');
  $('#tickerTrack').innerHTML = html ? html + html : '<span class="tk">Live IPOs appear here once the feeds load.</span>';
}

/* =================== desks =================== */
function renderDesks() {
  $('#deskGrid').innerHTML = DESKS.map((d) => `<button class="desk rv" style="--c:${d.color}" data-open="${d.id}">
    <span class="num-tag">${d.n}</span><span class="orb">${svg(d.icon, 1.9)}</span>
    <h3>${esc(d.name)}</h3><p class="plain">${esc(d.plain)}</p>
    <div class="feat">${d.feats.map((f) => `<span>${esc(f)}</span>`).join('')}</div>
    <div class="go"><span>Open desk</span><span aria-hidden="true">→</span></div></button>`).join('');
  $('#quick').innerHTML = [
    ['search', 'Look up any IPO', 'GMP, subscription, odds and dates in one view', 'pal'],
    ['play', 'Take the 60-second tour', 'A guided flight through all six desks', 'tour'],
    ['cal', 'What happens this week', 'Openings, closings, allotments and listings', 'cal'],
  ].map(([i, b, s, a]) => `<button data-quick="${a}">${svg(i)}<span><b>${b}</b><small>${s}</small></span></button>`).join('');
  if (!matchMedia('(hover: hover)').matches || reduceMotion) return;
  $$('.desk').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateZ(6px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* =================== radar =================== */
const ST = [['open', 'Open'], ['upcoming', 'Upcoming'], ['closed', 'Awaiting listing'], ['listed', 'Listed'], ['all', 'All']];
function sparkline(h, w = 70, ht = 26) {
  const v = (h || []).map((p) => p.v).filter((n) => n != null).slice(-14);
  if (v.length < 2) return `<svg class="spark" viewBox="0 0 ${w} ${ht}"></svg>`;
  const mn = Math.min(...v, 0), mx = Math.max(...v), rg = mx - mn || 1;
  const pts = v.map((n, i) => [(i / (v.length - 1)) * (w - 4) + 2, ht - 3 - ((n - mn) / rg) * (ht - 6)]);
  const up = v[v.length - 1] >= v[0], c = up ? 'var(--pos)' : 'var(--neg)';
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${ht}" aria-hidden="true"><path d="${d} L${last[0].toFixed(1)} ${ht} L2 ${ht}Z" fill="${c}" opacity=".12"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="2.2" fill="${c}"/></svg>`;
}
function subBars(o) {
  const s = o.sub || {}; const rows = [['QIB', s.qib], ['NII', s.nii], ['RET', s.retail]].filter(([, v]) => v && num(v.times) != null);
  if (!rows.length) return o.subTotal ? `<div class="subx"><div class="row"><span>TOT</span><span class="bar"><i style="width:${Math.min(100, Math.log10(1 + o.subTotal) / 2.7 * 100)}%"></i></span><b>${x(o.subTotal)}</b></div></div>` : '<span class="muted">—</span>';
  return `<div class="subx">${rows.map(([l, v]) => `<div class="row"><span>${l}</span><span class="bar"><i style="width:${Math.min(100, Math.log10(1 + v.times) / 2.7 * 100)}%"></i></span><b>${x(v.times)}</b></div>`).join('')}</div>`;
}
function whenTxt(o) {
  const t = todayIST();
  if (o.status === 'upcoming') { const d = o.open ? dayDiff(t, o.open) : null; return [`Opens ${dShort(o.open)}`, d == null ? '' : d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`]; }
  if (o.status === 'open') { const d = dayDiff(t, o.close); return [`Closes ${dShort(o.close)}`, d === 0 ? 'last day today' : d === 1 ? 'tomorrow' : `${d} days left`]; }
  if (o.status === 'closed') return [`Lists ${dShort(o.listing)}`, o.allot ? `allotment ${dShort(o.allot)}` : ''];
  return [`Listed ${dShort(o.listing)}`, o.listGain != null ? `listing gain ${pct(o.listGain)}` : ''];
}
function oddsTxt(o) { const v = o.odds.retail; return v == null ? '<span class="muted">—</span>' : `<b class="mono">${v >= 1 ? '100%' : (v * 100).toFixed(v < 0.1 ? 2 : 1) + '%'}</b>`; }
function radarRows() {
  let r = S.ipos.filter((o) => (S.tab === 'all' || o.status === S.tab) && (S.board === 'all' || o.board === S.board));
  if (S.q) { const q = S.q.toLowerCase(); r = r.filter((o) => o.name.toLowerCase().includes(q) || String(o.symbol || '').toLowerCase().includes(q)); }
  const { k, dir } = S.sort;
  r.sort((a, b) => { const p = a[k], q = b[k]; if (k === 'odds') return ((a.odds.retail ?? -1) - (b.odds.retail ?? -1)) * dir; if (p == null && q == null) return 0; if (p == null) return 1; if (q == null) return -1; return (typeof p === 'string' ? p.localeCompare(q) : p - q) * dir; });
  if (k === 'key') r.sort((a, b) => String(a.when || '9').localeCompare(String(b.when || '9')) * (S.tab === 'listed' ? -1 : 1) * dir);
  return r;
}
function renderRadar() {
  const counts = Object.fromEntries(ST.map(([k]) => [k, S.ipos.filter((o) => k === 'all' || o.status === k).length]));
  if (!S.tab) S.tab = counts.open ? 'open' : counts.upcoming ? 'upcoming' : 'all';
  $('#stSeg').innerHTML = ST.map(([k, l]) => `<button data-st="${k}" class="${S.tab === k ? 'on' : ''}" role="tab" aria-selected="${S.tab === k}">${l}<span class="c">${counts[k]}</span></button>`).join('');
  const rows = radarRows();
  $('#radarTbl tbody').innerHTML = rows.length ? rows.map((o) => { const [w1, w2] = whenTxt(o); return `<tr data-ipo="${esc(o.key)}" tabindex="0">
    <td class="nm"><b>${esc(o.name)}</b><small><span class="pill ${o.board === 'SME' ? 'sme' : 'main'}">${o.board}</span> <span class="pill ${o.status}">${o.status === 'closed' ? 'awaiting listing' : o.status}</span> ${esc(o.exchange && o.exchange !== o.board ? o.exchange : '')}</small></td>
    <td class="r num">${o.priceLow && o.priceHigh && o.priceLow !== o.priceHigh ? `${inr(o.priceLow)}–${o.priceHigh}` : inr(o.price)}</td>
    <td class="r num">${o.lotAmt ? money(o.lotAmt) : '—'}<br><small class="muted">${o.lot ? o.lot.toLocaleString('en-IN') + ' sh' : ''}</small></td>
    <td class="r num">${cr(o.sizeCr)}</td>
    <td class="r"><div class="gmp">${sparkline(o.gmpHist)}<div class="v"><b class="${o.gmp > 0 ? 'pos' : o.gmp < 0 ? 'neg' : ''}">${o.gmp == null ? '—' : inr(o.gmp)}</b><small class="${o.gmpPct > 0 ? 'pos' : o.gmpPct < 0 ? 'neg' : 'muted'}">${o.gmpPct == null ? '' : pct(o.gmpPct)}</small></div></div></td>
    <td>${subBars(o)}</td>
    <td class="r">${oddsTxt(o)}</td>
    <td class="when"><b>${w1}</b><small>${w2}</small></td>
    <td><span style="display:inline-flex;gap:6px;align-items:center">${M.star(o.key)}<button class="go-btn" data-ipo="${esc(o.key)}">360° →</button></span></td></tr>`; }).join('') : `<tr><td colspan="9" class="empty">No IPOs here right now. Try another tab.</td></tr>`;
  $('#radarCards').innerHTML = rows.length ? rows.map((o) => { const [w1, w2] = whenTxt(o); return `<button class="mcard" data-ipo="${esc(o.key)}"><div class="r1"><div class="nm"><b>${esc(o.name)}</b><small><span class="pill ${o.board === 'SME' ? 'sme' : 'main'}">${o.board}</span> <span class="pill ${o.status}">${o.status === 'closed' ? 'awaiting listing' : o.status}</span></small></div>${sparkline(o.gmpHist)}</div>
    <div class="r2"><div><span>GMP</span><b class="${o.gmp > 0 ? 'pos' : ''}">${o.gmp == null ? '—' : inr(o.gmp)}</b></div><div><span>Est. gain</span><b class="${o.gmpPct > 0 ? 'pos' : o.gmpPct < 0 ? 'neg' : ''}">${pct(o.gmpPct)}</b></div><div><span>Subscribed</span><b>${x(o.subTotal)}</b></div></div>
    <div class="when"><b>${w1}</b> <small>${w2}</small></div></button>`; }).join('') : '<div class="empty">No IPOs here right now.</div>';
  $$('#radarTbl th[data-sort]').forEach((th) => { th.querySelector('.ar')?.remove(); if (th.dataset.sort === S.sort.k) th.insertAdjacentHTML('beforeend', ` <span class="ar">${S.sort.dir > 0 ? '↑' : '↓'}</span>`); });
  const m = S.meta.deal || S.meta.qib; $('#radarStamp').textContent = m && m.at ? `Feed updated ${ago(m.at)}` : '';
}

/* =================== calendar =================== */
function renderDays() {
  const t = todayIST(), days = Array.from({ length: 7 }, (_, i) => addDays(t, i));
  const ev = Object.fromEntries(days.map((d) => [d, []]));
  const push = (d, e) => { if (ev[d]) ev[d].push(e); };
  S.ipos.forEach((o) => {
    push(o.open, { c: 'var(--pos)', k: 'Opens', n: o.name, ipo: o.key, b: o.board });
    if (o.close !== o.open) push(o.close, { c: 'var(--amber)', k: 'Closes', n: o.name, ipo: o.key, b: o.board });
    push(o.allot, { c: 'var(--pen)', k: 'Allotment', n: o.name, ipo: o.key, b: o.board });
    push(o.listing, { c: 'var(--gold)', k: 'Lists', n: o.name, ipo: o.key, b: o.board });
  });
  S.rights.forEach((r) => { if (r.status === 'closed') return; push(r.open, { c: 'var(--coral)', k: 'Rights opens', n: r.name, desk: 'rights' }); push(r.close, { c: 'var(--coral)', k: 'Rights closes', n: r.name, desk: 'rights' }); });
  $('#days').innerHTML = days.map((d, i) => { const dt = new Date(d + 'T00:00:00Z'); return `<div class="day ${i === 0 ? 'today' : ''}"><h4>${dt.getUTCDate()} ${MON[dt.getUTCMonth()]}<small>${i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DOW[dt.getUTCDay()]}</small></h4>${ev[d].length ? ev[d].map((e) => `<button class="ev" style="--c:${e.c}" ${e.ipo ? `data-ipo="${esc(e.ipo)}"` : `data-open="${e.desk}"`}><small>${e.k}${e.b ? ' · ' + e.b : ''}</small>${esc(e.n)}</button>`).join('') : '<div class="none">Quiet day</div>'}</div>`; }).join('');
}

/* =================== rights =================== */
function renderRights() {
  const r = S.rights.filter((i) => i.status !== 'closed').sort((a, b) => (a.status === b.status ? String(a.close).localeCompare(String(b.close)) : a.status === 'open' ? -1 : 1)).slice(0, 9);
  $('#rgrid').innerHTML = r.length ? r.map((i) => `<button class="rcard" data-open="rights"><div class="hd">${i.logo ? `<img src="${esc(i.logo)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<div><b>${esc(i.name)}</b><br><span class="pill ${i.status}">${i.status}</span> <span class="pill">${esc(i.ratio || '')}</span></div></div>
    <div class="kv"><div><span>Issue</span><b>${inr(i.price, 2)}</b></div><div><span>CMP</span><b>${inr(i.cmp, 2)}</b></div><div><span>Discount</span><b class="${i.disc > 0 ? 'pos' : 'neg'}">${i.disc == null ? '—' : i.disc.toFixed(1) + '%'}</b></div></div>
    <div class="ft"><span>${i.status === 'open' ? 'Closes ' + dShort(i.close) : 'Opens ' + dShort(i.open)} · ${cr(i.sizeCr)}</span><span>${i.subscription && i.subscription.times != null ? x(i.subscription.times) + ' subscribed' : ''}</span></div></button>`).join('') : '<div class="empty panel">No open or upcoming rights issues right now.</div>';
}

/* =================== research lab =================== */
function renderLab() {
  const box = $('#scatter');
  if (!S.hist.length) { box.innerHTML = `<div class="empty">${S.meta.hist && !S.meta.hist.ok ? 'History feed unavailable right now.' : 'Loading past IPOs…'}</div>`; return; }
  const since = S.lab.per ? addDays(todayIST(), -Math.round(S.lab.per * 30.4)) : '0';
  const pts = S.hist.filter((h) => (S.lab.seg === 'all' || h.seg === S.lab.seg) && h.date >= since && h.sub > 0);
  const W = 720, H = 420, L = 46, R = 14, T = 14, B = 40;
  const gx = (v) => L + (Math.log10(Math.max(v, 0.1)) + 1) / 4.2 * (W - L - R);
  const yMin = -60, yMax = 200, gy = (v) => T + (1 - (Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * (H - T - B);
  const xt = [0.1, 1, 10, 100, 1000], yt = [-50, 0, 50, 100, 150, 200];
  const col = (h) => (h.seg === 'SME' ? 'var(--gold)' : 'var(--teal)');
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Scatter of total subscription against listing gain for ${pts.length} IPOs">
    ${yt.map((v) => `<line x1="${L}" x2="${W - R}" y1="${gy(v)}" y2="${gy(v)}" stroke="var(--line)" ${v === 0 ? 'stroke-width="1.5" stroke="var(--line-2)"' : ''}/><text x="${L - 8}" y="${gy(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}%</text>`).join('')}
    ${xt.map((v) => `<line x1="${gx(v)}" x2="${gx(v)}" y1="${T}" y2="${H - B}" stroke="var(--line)"/><text x="${gx(v)}" y="${H - B + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}×</text>`).join('')}
    <text x="${(W + L) / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)" letter-spacing="1.5">TOTAL SUBSCRIPTION (LOG SCALE)</text>
    ${pts.map((h, i) => `<circle cx="${gx(h.sub).toFixed(1)}" cy="${gy(h.gain).toFixed(1)}" r="4" fill="${col(h)}" fill-opacity=".55" stroke="${col(h)}" stroke-width="1" data-i="${i}" style="${reduceMotion ? '' : `animation:popin .5s ${Math.min(i * 4, 900)}ms both`}"/>`).join('')}
  </svg><div class="legend" style="margin-top:6px"><span><i style="background:var(--teal)"></i>Mainboard</span><span><i style="background:var(--gold)"></i>SME</span><span>${pts.length} IPOs${S.lab.per ? ' listed in the last 12 months' : ''}</span></div><div class="tip" hidden></div>`;
  const tip = box.querySelector('.tip');
  box.querySelector('svg').addEventListener('pointermove', (e) => {
    const c = e.target.closest('circle'); if (!c) { tip.hidden = true; return; }
    const h = pts[+c.dataset.i], br = box.getBoundingClientRect(), cr2 = c.getBoundingClientRect();
    tip.hidden = false; tip.style.left = cr2.left - br.left + 4 + 'px'; tip.style.top = cr2.top - br.top + 'px';
    tip.innerHTML = `<b>${esc(h.name)}</b><br><span class="mono">${x(h.sub)} · listing ${pct(h.gain)} · ${dShort(h.date)} ${h.date.slice(0, 4)}</span>`;
  });
  box.querySelector('svg').addEventListener('pointerleave', () => { tip.hidden = true; });

  const med = (a) => { if (!a.length) return null; const s = [...a].sort((p, q) => p - q), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const gains = pts.map((h) => h.gain), posShare = pts.length ? pts.filter((h) => h.gain > 0).length / pts.length * 100 : null;
  const withG = pts.filter((h) => h.gmpFinal != null && h.price);
  const gmpErr = med(withG.map((h) => Math.abs(h.gmpFinal / h.price * 100 - h.gain)));
  $('#labStats').innerHTML = [
    ['IPOs in view', pts.length, ''], ['Listed in profit', posShare == null ? '—' : posShare.toFixed(0), '%'],
    ['Median listing gain', med(gains) == null ? '—' : pct(med(gains)), ''], ['GMP miss (median)', gmpErr == null ? '—' : gmpErr.toFixed(1), gmpErr == null ? '' : ' pts'],
  ].map(([l, v, s]) => `<div class="stat"><div class="lbl">${l}</div><div class="v">${esc(v)}<small>${s}</small></div></div>`).join('');
  const bk = [[0, 10, 'Under 10×'], [10, 50, '10× – 50×'], [50, 150, '50× – 150×'], [150, 1e9, 'Over 150×']].map(([a, b, l]) => { const g = pts.filter((h) => h.sub >= a && h.sub < b); return { l, n: g.length, med: med(g.map((h) => h.gain)), pos: g.length ? g.filter((h) => h.gain > 0).length / g.length * 100 : null }; });
  const mx = Math.max(...bk.map((b) => Math.abs(b.med || 0)), 1);
  $('#labBuckets').innerHTML = `<thead><tr><th>Demand</th><th class="r">IPOs</th><th class="r">In profit</th><th class="r">Median gain</th><th></th></tr></thead><tbody>${bk.map((b) => `<tr><td>${b.l}</td><td class="r">${b.n}</td><td class="r">${b.pos == null ? '—' : b.pos.toFixed(0) + '%'}</td><td class="r ${b.med > 0 ? 'pos' : b.med < 0 ? 'neg' : ''}">${b.med == null ? '—' : pct(b.med)}</td><td><div class="hbar"><i style="width:${Math.max(0, (b.med || 0) / mx * 100)}%"></i></div></td></tr>`).join('')}</tbody>`;
  $('#labNote').textContent = `Listing gain = listing price vs issue price. “GMP miss” = gap between the last GMP before listing and the real listing gain, in percentage points (${withG.length} IPOs with a final GMP). Past results don’t promise future listings.`;
}

/* =================== your universe + health =================== */
function readLS(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
function renderMine() {
  const hni = readLS('findeependence-ipo-ledger-v1') || {}, deal = readLS('fd-ipo-deal-desk-v1') || {}, book = readLS('fd_book') || [], qib = readLS('qib-apps') || [], plan = readLS('ipoPlanner.v1');
  const hniApps = Object.values(hni.apps || {}).filter((a) => a && (a.category === 'SHNI' || a.category === 'BHNI')).length;
  const cells = [
    ['hni-ledger', Object.keys(hni.accounts || {}).length, 'Family accounts', 'HNI Ledger'],
    ['hni-ledger', hniApps, 'HNI applications', 'HNI Ledger'],
    ['deal-desk', (deal.deals || []).length, 'IPO deals', 'Deal Desk'],
    ['deal-desk', (deal.investors || []).length + (deal.brokers || []).length, 'Investors & brokers', 'Deal Desk'],
    ['ipo-tracker', Array.isArray(book) ? book.length : 0, 'Records in My Book', 'IPO Tracker'],
    ['qib-desk', Array.isArray(qib) ? qib.length : 0, 'QIB applications', 'QIB Desk'],
  ];
  if (plan && Array.isArray(plan.ipos)) cells.push(['max-profit', plan.ipos.length, 'IPOs in your planner', 'Max-Profit']);
  $('#mgrid').innerHTML = cells.slice(0, 6).map(([d, v, l, s]) => `<button style="--c:${DESK[d].color}" data-open="${d}"><div class="v">${v}</div><small>${l} · ${s}</small></button>`).join('');
  const lev = (m) => { if (!m || !m.ok) return 'bad'; const h = m.at ? (Date.now() - new Date(m.at)) / 36e5 : 999; return h < 8 ? 'ok' : h < 72 ? 'warn' : 'bad'; };
  $('#health').innerHTML = Object.entries(FEEDS).map(([k, f]) => { const m = S.meta[k]; return `<li><i class="${lev(m)}"></i><span>${esc(f.label)} <small>· ${esc(DESK[f.desk].name)}</small></span><small>${!m ? 'loading…' : m.ok ? `${m.n ?? ''} · ${ago(m.at)}` : 'unavailable'}</small></li>`; }).join('');
}

/* =================== IPO 360 drawer =================== */
function openIpo(key, push = true) {
  const o = S.ipos.find((i) => i.key === key); if (!o) return;
  if (!M.allowed()) { M.showUnlock(); return; }
  const t = todayIST();
  const stages = [['Open', o.open], ['Close', o.close], ['Allotment', o.allot], ['Listing', o.listing]];
  const idx = stages.reduce((a, [, d], i) => (d && t >= d ? i : a), -1);
  const s = o.sub || {};
  const cats = [['QIB', s.qib, 'var(--gold)'], ['bHNI', s.bnii, 'var(--pen)'], ['sHNI', s.snii, 'var(--teal)'], ['NII', !s.bnii && s.nii, 'var(--pen)'], ['Retail', s.retail, 'var(--amber)'], ['Employee', s.employee, 'var(--violet)'], ['Total', s.total, 'var(--green)']].filter(([, v]) => v && num(v.times) != null);
  const ring = (v, lbl, c, approx) => `<div style="--c:${c}"><div class="ring" style="--p:${v == null ? 0 : Math.max(2, Math.min(100, v * 100))}"><b>${v == null ? '—' : v >= 1 ? '100%' : (v * 100).toFixed(v < 0.1 ? 2 : 1) + '%'}</b></div><b style="font-size:13px">${lbl}</b><small>${v == null ? 'no data yet' : approx ? '≈ from share demand' : 'per application'}</small></div>`;
  const acts = [['ipo-tracker', 'Full analysis & odds', 'IPO Tracker'], ['qib-desk', 'Exact QIB allotment', 'QIB Desk'], ['max-profit', 'Profit at every subscription', 'Max-Profit'], ['hni-ledger', 'Record family applications', 'HNI Ledger'], ['deal-desk', 'Record a deal', 'Deal Desk'], ['ipo-tracker', 'Plan capital across IPOs', 'IPO Tracker · Plan']];
  $('#drawer').innerHTML = `<div class="dhead"><div><span class="pill ${o.board === 'SME' ? 'sme' : 'main'}">${o.board}</span> <span class="pill ${o.status}">${o.status === 'closed' ? 'awaiting listing' : o.status}</span> <span class="lbl" style="margin-left:4px">${esc(o.exchange || '')}</span><h3>${esc(o.name)}</h3><span class="muted" style="font-size:13px">IPO 360° · merged from ${o.src.map(esc).join(' + ')}</span></div>${M.star(o.key, true)}<button class="ibtn x" id="dClose" aria-label="Close" style="color:var(--ink);border-color:var(--line-2)">${svg('x')}</button></div>
  <div class="dbody">
    <div class="big3">
      <div><div class="lbl">GMP</div><div class="v ${o.gmp > 0 ? 'pos' : o.gmp < 0 ? 'neg' : ''}">${o.gmp == null ? '—' : inr(o.gmp)}</div><small class="muted">${o.gmpPct == null ? 'not quoted' : pct(o.gmpPct) + ' on upper band'}</small></div>
      <div><div class="lbl">Est. listing</div><div class="v">${o.estList == null ? '—' : inr(o.estList)}</div><small class="muted">${o.listingPrice ? 'actual ' + inr(o.listingPrice, 2) + ' (' + pct(o.listGain) + ')' : 'price + GMP'}</small></div>
      <div><div class="lbl">Subscribed</div><div class="v">${x(o.subTotal)}</div><small class="muted">${o.subAt ? 'as of ' + esc(String(o.subAt).replace('T', ' ').slice(0, 16)) : 'total, all categories'}</small></div>
    </div>
    <div class="dsec"><h5>Timeline</h5><div class="timeline"><span class="fill" style="width:${idx < 0 ? 0 : Math.min(idx, 3) / 3 * 76}%"></span>${stages.map(([l, d], i) => `<div class="${i < idx ? 'done' : i === idx ? 'now' : ''}"><i></i><b>${dShort(d)}</b><small>${l}</small></div>`).join('')}</div></div>
    <div class="dsec"><h5>GMP journey <span>${(o.gmpHist || []).length} readings</span></h5>${(o.gmpHist || []).length > 1 ? sparkline(o.gmpHist, 520, 90).replace('class="spark"', 'class="spark" style="width:100%;height:90px"') : '<div class="muted" style="font-size:13px">No GMP history yet.</div>'}</div>
    ${cats.length ? `<div class="dsec"><h5>Subscription by category <span>times subscribed</span></h5><div class="cbars">${cats.map(([l, v, c]) => `<div class="row" style="--c:${c}"><span>${l}</span><span class="bar"><i style="width:0" data-w="${Math.min(100, Math.log10(1 + v.times) / 2.8 * 100)}"></i></span><b>${x(v.times)}</b></div>`).join('')}</div></div>` : ''}
    <div class="dsec"><h5>Chance of allotment <span>SEBI lottery · minimum application</span></h5><div class="odds">${ring(o.odds.retail ?? o.oddsApprox, 'Retail', 'var(--amber)', !o.odds.retail && o.oddsApprox != null)}${ring(o.odds.snii, 'sHNI', 'var(--teal)')}${ring(o.odds.bnii, 'bHNI', 'var(--pen)')}</div></div>
    <div class="dsec"><h5>Key facts</h5><div class="kgrid">
      <div><span>Price band</span><b>${o.priceLow && o.priceLow !== o.priceHigh ? inr(o.priceLow) + '–' + o.priceHigh : inr(o.price)}</b></div>
      <div><span>Lot</span><b>${o.lot ? o.lot.toLocaleString('en-IN') + ' sh' : '—'}</b></div>
      <div><span>1 lot costs</span><b>${money(o.lotAmt)}</b></div>
      <div><span>Issue size</span><b>${cr(o.sizeCr)}</b></div>
      ${o.lots && o.lots.snii ? `<div><span>sHNI min</span><b>${o.lots.snii.lots} lots · ${money(o.lots.snii.amount)}</b></div>` : ''}
      ${o.lots && o.lots.bnii ? `<div><span>bHNI min</span><b>${o.lots.bnii.lots} lots · ${money(o.lots.bnii.amount)}</b></div>` : ''}
      ${o.netQib ? `<div><span>Net QIB (ex-anchor)</span><b>${o.netQib.toLocaleString('en-IN')}</b></div>` : ''}
      ${o.anchor ? `<div><span>Anchor shares</span><b>${o.anchor.toLocaleString('en-IN')}</b></div>` : ''}
      ${o.registrar ? `<div style="grid-column:1/-1"><span>Registrar</span><b style="font-family:var(--sans)">${esc(o.registrar)}</b></div>` : ''}
    </div></div>
    <div class="dsec"><h5>Do something with it</h5><div class="actions">${acts.map(([d, b, s2]) => `<button data-open="${d}" style="--c:${DESK[d].color}"><i>${svg(DESK[d].icon)}</i><span><b>${b}</b><small>${s2}</small></span></button>`).join('')}</div></div>
    ${o.url ? `<a class="btn sm" href="${esc(o.url)}" target="_blank" rel="noopener">Source page ↗</a>` : ''}
    <p class="disc">Indicative view from public feeds. GMP is unofficial. Exact allotment and profit maths live in the desks.</p>
  </div>`;
  $('#drawer').classList.add('on'); $('#scrim').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => setTimeout(() => $$('#drawer .cbars i').forEach((i) => { i.style.width = i.dataset.w + '%'; }), 60));
  $('#dClose').onclick = () => closeIpo(); $('#dClose').focus();
  if (push && location.hash !== '#/ipo/' + key) history.pushState(null, '', '#/ipo/' + key);
}
function closeIpo(back = true) {
  if (!$('#drawer').classList.contains('on')) return;
  $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); $('#drawer').setAttribute('aria-hidden', 'true');
  if (back && location.hash.startsWith('#/ipo/')) history.pushState(null, '', location.pathname + location.search);
}

/* =================== deck (module host) =================== */
let current = null;
function renderDock() {
  $('#dock').innerHTML = `<button data-home style="--c:#7FD3D6" data-tip="Command Center" aria-label="Command Center">${svg('home')}</button><hr>` +
    DESKS.map((d) => `<button data-open="${d.id}" style="--c:${d.color}" data-tip="${esc(d.name)}" aria-label="${esc(d.name)}" class="${current === d.id ? 'on' : ''}">${svg(d.icon)}</button>`).join('') +
    `<hr><button data-pal style="--c:#7FD3D6" data-tip="Search (Ctrl K)" aria-label="Search">${svg('search')}</button>`;
}
function openDesk(id, push = true) {
  const d = DESK[id]; if (!d) return;
  if (!M.allowed()) { M.showUnlock(); return; }
  closeIpo(false); closePal();
  current = id;
  let f = $(`#frames iframe[data-id="${id}"]`);
  const frames = $('#frames');
  if (!f) {
    frames.insertAdjacentHTML('beforeend', `<div class="loader" data-for="${id}" style="--c:${d.color}"><div><div class="ring"></div><div class="lbl" style="text-align:center">Opening ${esc(d.name)}</div></div></div>`);
    f = document.createElement('iframe'); f.dataset.id = id; f.title = d.name; f.src = d.path; f.setAttribute('allow', 'clipboard-read; clipboard-write; fullscreen');
    f.addEventListener('load', () => { const l = $(`.loader[data-for="${id}"]`); if (l) { l.classList.add('gone'); setTimeout(() => l.remove(), 500); } });
    frames.appendChild(f);
  }
  $$('#frames iframe').forEach((x2) => x2.classList.toggle('on', x2 === f));
  $('#stageBar').style.setProperty('--c', d.color);
  $('#stageBar').innerHTML = `<span class="orb">${svg(d.icon)}</span><div class="tt"><b>${esc(d.name)}</b><small>${esc(d.long)}</small></div><span class="sp"></span>
    <button class="btn sm" id="howBtn">${svg('help')}<span class="hide-m">How to use</span></button>
    <button class="btn sm hide-m" id="reloadBtn" title="Reload this desk">${svg('reload')}</button>
    <a class="btn sm" href="${d.path}" target="_blank" rel="noopener" title="Open this desk on its own page">${svg('ext')}<span class="hide-m">Full screen</span></a>
    <button class="btn sm" data-home aria-label="Back to the Command Center">${svg('x')}</button>
    <div class="howto" id="howto" hidden style="--c:${d.color}"><h4>${esc(d.name)} in 3 steps</h4><ol>${d.steps.map((s) => `<li><span>${esc(s)}</span></li>`).join('')}</ol><div class="tabs">${d.tabs.map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>`;
  $('#howBtn').onclick = (e) => { e.stopPropagation(); $('#howto').hidden = !$('#howto').hidden; };
  $('#reloadBtn').onclick = () => { try { f.contentWindow.location.reload(); } catch (e) { f.src = d.path; } };
  renderDock();
  $('#deck').classList.add('open'); $('#deck').setAttribute('aria-hidden', 'false'); document.body.classList.add('deck-open', 'locked');
  if (cosmos) { cosmos.focus(id); setTimeout(() => cosmos && document.body.classList.contains('deck-open') && cosmos.pause(), 900); }
  try { if (!localStorage.getItem('fdu-howto-' + id)) { $('#howto').hidden = false; localStorage.setItem('fdu-howto-' + id, '1'); } } catch (e) {}
  if (push && location.hash !== '#/desk/' + id) history.pushState(null, '', '#/desk/' + id);
}
function closeDesk(push = true) {
  if (!current) return;
  current = null; $('#deck').classList.remove('open'); $('#deck').setAttribute('aria-hidden', 'true'); document.body.classList.remove('deck-open', 'locked');
  if (cosmos) { cosmos.resume(); cosmos.focus(null); }
  renderMine();
  if (push && location.hash.startsWith('#/desk/')) history.pushState(null, '', location.pathname + location.search);
}

/* =================== command palette =================== */
let palItems = [], palIdx = 0;
function palData(q) {
  q = q.trim().toLowerCase();
  const m = (s) => !q || String(s).toLowerCase().includes(q);
  const desks = DESKS.filter((d) => m(d.name + ' ' + d.long + ' ' + d.feats.join(' ') + ' ' + d.tabs.join(' '))).map((d) => ({ g: 'Desks', c: d.color, i: d.icon, b: d.name, s: d.long, run: () => openDesk(d.id) }));
  const ipos = S.ipos.filter((o) => m(o.name + ' ' + (o.symbol || '') + ' ' + o.board)).sort((a, b) => ['open', 'upcoming', 'closed', 'listed'].indexOf(a.status) - ['open', 'upcoming', 'closed', 'listed'].indexOf(b.status)).slice(0, q ? 12 : 6)
    .map((o) => ({ g: 'IPOs', c: o.status === 'open' ? '#5FC22A' : '#7FD3D6', i: 'radar', b: o.name, s: `${o.board} · ${o.status === 'closed' ? 'awaiting listing' : o.status} · ${whenTxt(o)[0]}`, r: o.gmp != null ? `GMP ${inr(o.gmp)}` : '', run: () => openIpo(o.key) }));
  const rights = S.rights.filter((r) => r.status !== 'closed' && q && m(r.name + ' rights')).slice(0, 5).map((r) => ({ g: 'Rights issues', c: '#FF9F7A', i: 'rights', b: r.name, s: `${r.status} · ${r.ratio || ''} · closes ${dShort(r.close)}`, r: r.disc != null ? `${r.disc.toFixed(1)}% off` : '', run: () => openDesk('rights') }));
  const acts = [
    ['Take the 60-second tour', 'play', () => startTour()], ['Go to IPO Radar', 'radar', () => goSec('radar')], ['This week on Dalal Street', 'cal', () => goSec('calendar')],
    ['Research Lab: demand vs listing gain', 'lab', () => goSec('lab')], ['Switch light / dark theme', 'sun', () => toggleTheme()], ['Alerts & watchlist (members)', 'bell', () => M.openAlerts()], ['Download IPO Radar as CSV (members)', 'ext', () => M.exportRadar()], ['Command Center (home)', 'home', () => { closeDesk(); goSec('top'); }],
  ].filter(([b]) => m(b)).map(([b, i, run]) => ({ g: 'Actions', c: '#7FD3D6', i, b, s: '', run }));
  return [...ipos, ...desks, ...rights, ...acts];
}
function renderPal() {
  palItems = palData($('#palQ').value); palIdx = Math.min(palIdx, Math.max(palItems.length - 1, 0));
  let g = '';
  $('#palList').innerHTML = palItems.length ? palItems.map((it, i) => { const h = it.g !== g ? `<div class="pal-g">${it.g}</div>` : ''; g = it.g; return h + `<button class="pal-i ${i === palIdx ? 'on' : ''}" data-i="${i}" role="option" aria-selected="${i === palIdx}" style="--c:${it.c}"><i>${svg(it.i)}</i><span><b>${esc(it.b)}</b>${it.s ? `<small>${esc(it.s)}</small>` : ''}</span>${it.r ? `<span class="r">${esc(it.r)}</span>` : ''}</button>`; }).join('') : '<div class="empty">Nothing found. Try an IPO name or a desk.</div>';
  $('#palList .pal-i.on')?.scrollIntoView({ block: 'nearest' });
}
function openPal() { $('#pal').hidden = false; $('#palQ').value = ''; palIdx = 0; renderPal(); setTimeout(() => $('#palQ').focus(), 10); }
function closePal() { $('#pal').hidden = true; }
function runPal(i) { const it = palItems[i]; if (!it) return; closePal(); it.run(); }

/* =================== tour (pitch mode) =================== */
let tourI = -1, tourTimer = null, tourT0 = 0;
const TOUR_MS = 7000;
function tourSlides() {
  const live = S.ipos.filter((o) => o.status !== 'listed').length;
  return [
    { c: '#7FD3D6', k: 'FinDeependence Universe', h: 'Six desks. One universe.', p: 'Everything an IPO investor, HNI family office, QIB desk or deal broker needs, in one place, with no login.', stats: [[live, 'live IPOs'], [S.hist.length || '600+', 'past IPOs studied'], [S.rights.length, 'rights issues']] },
    ...DESKS.map((d) => ({ c: d.color, k: `Desk ${d.n}`, h: d.name, p: d.plain, li: d.tour, focus: d.id, desk: d.id })),
    { c: '#E8B04A', k: 'Built for', h: 'Retail · HNI · QIB · Brokers', p: 'From a first-time retail applicant to a family office running 24 PANs and a broker settling Kostak deals: plain words, big buttons, institutional maths underneath.', li: ['SEBI ICDR allotment rules, not guesses', 'Live feeds that refresh on their own', 'Your data never leaves your browser'] },
    { c: '#5FC22A', k: 'Freedom with Finance', h: 'Created by CA Deep Dalal', p: 'Chartered Accountant · Fund Manager. Want this for your desk, family office or clients?', cta: true },
  ];
}
function showTour(i) {
  const sl = tourSlides(); tourI = (i + sl.length) % sl.length; const s = sl[tourI];
  const card = $('#tourCard'); card.style.setProperty('--c', s.c);
  card.innerHTML = `<span class="lbl">${esc(s.k)} · ${tourI + 1}/${sl.length}</span><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p>
    ${s.stats ? `<div class="stats-row">${s.stats.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
    ${s.li ? `<ul>${s.li.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
    ${s.cta ? `<div class="cta" style="margin-bottom:16px"><a class="btn primary" href="https://instagram.com/findeependence" target="_blank" rel="noopener">Message on Instagram ↗</a><a class="btn ghost" href="mailto:deepuploads27@gmail.com?subject=FinDeependence%20Universe">Email</a></div>` : ''}
    <div class="ctrl"><button class="btn sm ghost" data-t="prev" aria-label="Previous">←</button><button class="btn sm ghost" data-t="next" aria-label="Next">→</button>${s.desk ? `<button class="btn sm primary" data-open="${s.desk}">Open this desk</button>` : ''}<button class="btn sm ghost" data-t="end">Exit</button>
    <span class="dots">${sl.map((x2, j) => `<button data-t="${j}" class="${j === tourI ? 'on' : ''}" aria-label="Slide ${j + 1}"></button>`).join('')}</span></div>`;
  card.style.transition = 'none'; card.style.opacity = 0; card.style.transform = 'translateY(14px)';
  requestAnimationFrame(() => { card.style.transition = ''; card.style.opacity = ''; card.style.transform = ''; });
  if (cosmos) cosmos.focus(s.focus || null);
  tourT0 = performance.now();
}
function tourTick() {
  if (tourI < 0) return;
  const p = Math.min((performance.now() - tourT0) / TOUR_MS, 1); $('#tourProg').style.width = p * 100 + '%';
  if (p >= 1) { if (tourI === tourSlides().length - 1) { $('#tourProg').style.width = '100%'; } else showTour(tourI + 1); }
  tourTimer = requestAnimationFrame(tourTick);
}
function startTour() {
  closeDesk(false); closeIpo(false); closePal();
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  document.body.classList.add('locked', 'touring'); $('.hero-copy').style.opacity = 0; $('#tour').classList.add('on');
  if (cosmos) cosmos.resume();
  showTour(0); cancelAnimationFrame(tourTimer); tourTimer = requestAnimationFrame(tourTick);
  if (location.hash !== '#/tour') history.pushState(null, '', '#/tour');
}
function endTour(push = true) {
  if (tourI < 0) return;
  tourI = -1; cancelAnimationFrame(tourTimer); $('#tour').classList.remove('on'); $('.hero-copy').style.opacity = ''; document.body.classList.remove('locked', 'touring');
  if (cosmos) cosmos.focus(null);
  if (push && location.hash === '#/tour') history.pushState(null, '', location.pathname + location.search);
}

/* =================== theme, routing, events =================== */
function toggleTheme() {
  const light = document.documentElement.dataset.theme !== 'light';
  if (light) document.documentElement.dataset.theme = 'light'; else delete document.documentElement.dataset.theme;
  try { localStorage.setItem('fdu-theme', light ? 'light' : 'dark'); } catch (e) {}
  $('#themeBtn').innerHTML = svg(light ? 'sun' : 'moon');
  renderLab();
}
function goSec(id) { endTour(false); closeDesk(false); closeIpo(false); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
function route() {
  const h = location.hash;
  if (h.startsWith('#/desk/')) { endTour(false); openDesk(h.slice(7), false); return; }
  if (h.startsWith('#/ipo/')) { endTour(false); closeDesk(false); openIpo(decodeURIComponent(h.slice(6)), false); return; }
  if (h === '#/unlock') { endTour(false); closeDesk(false); M.showUnlock(); return; }
  if (h === '#/tour') { startTour(); return; }
  if (h === '#/' || h === '' || h === '#') { endTour(false); closeDesk(false); closeIpo(false); return; }
  closeDesk(false); closeIpo(false); endTour(false);
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-open],[data-ipo],[data-home],[data-pal],[data-quick],[data-st],[data-b],[data-sort],[data-s],[data-p],[data-t]');
  if (!t) { if (!e.target.closest('#howto,#howBtn')) $('#howto') && ($('#howto').hidden = true); return; }
  if (t.closest('#tourCard') && t.dataset.t) { const v = t.dataset.t; if (v === 'prev') showTour(tourI - 1); else if (v === 'next') showTour(tourI + 1); else if (v === 'end') endTour(); else showTour(+v); return; }
  if (t.dataset.open) { e.preventDefault(); endTour(false); openDesk(t.dataset.open); return; }
  if (t.dataset.ipo) { e.preventDefault(); openIpo(t.dataset.ipo); return; }
  if (t.hasAttribute('data-home')) { closeDesk(); return; }
  if (t.hasAttribute('data-pal')) { openPal(); return; }
  if (t.dataset.quick) { const q = t.dataset.quick; if (q === 'pal') openPal(); else if (q === 'tour') startTour(); else goSec('calendar'); return; }
  if (t.dataset.st) { S.tab = t.dataset.st; renderRadar(); return; }
  if (t.dataset.b) { S.board = t.dataset.b; $$('#bdSeg button').forEach((b) => b.classList.toggle('on', b === t)); renderRadar(); return; }
  if (t.dataset.sort) { const k = t.dataset.sort; S.sort = { k, dir: S.sort.k === k ? -S.sort.dir : (k === 'name' || k === 'key' ? 1 : -1) }; renderRadar(); return; }
  if (t.dataset.s) { S.lab.seg = t.dataset.s; $$('#labSeg button').forEach((b) => b.classList.toggle('on', b === t)); renderLab(); return; }
  if (t.dataset.p !== undefined && t.closest('#labPer')) { S.lab.per = +t.dataset.p; $$('#labPer button').forEach((b) => b.classList.toggle('on', b === t)); renderLab(); }
});
$('#radarTbl tbody').addEventListener('keydown', (e) => { const tr = e.target.closest('tr[data-ipo]'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openIpo(tr.dataset.ipo); } });
$('#radarQ').addEventListener('input', (e) => { S.q = e.target.value; renderRadar(); });
$('#scrim').addEventListener('click', () => closeIpo());
$('#openPal').addEventListener('click', openPal);
$('#themeBtn').addEventListener('click', toggleTheme);
['#tourBtn', '#heroTour', '#footTour'].forEach((s) => $(s).addEventListener('click', startTour));
$('#pal').addEventListener('click', (e) => { if (e.target.id === 'pal') closePal(); const b = e.target.closest('.pal-i'); if (b) runPal(+b.dataset.i); });
$('#palQ').addEventListener('input', () => { palIdx = 0; renderPal(); });
$('#palQ').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); palIdx = Math.min(palIdx + 1, palItems.length - 1); renderPal(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); palIdx = Math.max(palIdx - 1, 0); renderPal(); }
  else if (e.key === 'Enter') { e.preventDefault(); runPal(palIdx); }
});
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); $('#pal').hidden ? openPal() : closePal(); return; }
  if (e.key === 'Escape') { if (!$('#pal').hidden) closePal(); else if (tourI >= 0) endTour(); else if ($('#drawer').classList.contains('on')) closeIpo(); else if (current) closeDesk(); return; }
  if (tourI >= 0 && e.key === 'ArrowRight') showTour(tourI + 1);
  if (tourI >= 0 && e.key === 'ArrowLeft') showTour(tourI - 1);
  if (e.key === '/' && !e.target.closest('input,textarea,select') && !current) { e.preventDefault(); openPal(); }
});
window.addEventListener('message', (e) => { if (e.origin !== location.origin || !e.data || !e.data.fdu) return; if (e.data.fdu === 'palette') openPal(); });
window.addEventListener('popstate', route);
window.addEventListener('hashchange', () => {
  if (location.hash.startsWith('#/')) { route(); return; }
  const el = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
  if (current || tourI >= 0 || $('#drawer').classList.contains('on')) { closeDesk(false); closeIpo(false); endTour(false); if (el) setTimeout(() => el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 30); }
});

/* scroll: reveal + camera dolly + nav highlight */
const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
function observeReveal() { $$('.rv:not(.in)').forEach((el) => io.observe(el)); }
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    ticking = false; const h = innerHeight, y = scrollY;
    if (cosmos) { cosmos.setScroll(y / h); if (y > h * 2.2) cosmos.pause(); else if (!current) cosmos.resume(); }
    const secs = ['desks', 'radar', 'calendar', 'rights', 'lab']; let on = y < h * 0.6 ? 'home' : null;
    secs.forEach((s) => { const el = document.getElementById(s); if (el && el.getBoundingClientRect().top < h * 0.4) on = s; });
    $$('.nav [data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === on));
  });
}, { passive: true });

/* =================== cosmos =================== */
let cosmos = null;
async function startCosmos() {
  const canvas = $('#cosmos');
  try {
    const t = document.createElement('canvas'); if (!(t.getContext('webgl2') || t.getContext('webgl'))) throw new Error('no webgl');
    const { createCosmos } = await import('./cosmos.js');
    const labels = {};
    $('#labels').innerHTML = DESKS.map((d) => `<div class="plabel" data-l="${d.id}" style="--c:${d.color}"><button data-open="${d.id}" aria-label="Open ${esc(d.name)}"><i></i>${esc(d.name)}</button></div>`).join('');
    DESKS.forEach((d) => { labels[d.id] = $(`.plabel[data-l="${d.id}"]`); });
    cosmos = createCosmos(canvas, { modules: DESKS.map((d) => ({ id: d.id, color: d.color })), labels, logo: 'assets/logo.png', onPick: (id) => openDesk(id) });
    window.__fduCosmos = cosmos; // handle for video capture / debugging
  } catch (e) { canvas.hidden = true; $('#fallback').hidden = false; }
}
function cosmosBars() {
  if (!cosmos) return;
  const live = S.ipos.filter((o) => o.gmpPct != null).map((o) => ({ v: o.listGain ?? o.gmpPct }));
  const hist = S.hist.slice(-40).map((h) => ({ v: h.gain }));
  cosmos.setBars([...live, ...hist].slice(0, 48));
}

/* =================== boot =================== */
function refreshAll() { renderKpis(); renderTicker(); renderRadar(); renderDays(); renderRights(); renderMine(); renderLab(); }
async function boot() {
  $('#themeBtn').innerHTML = svg(document.documentElement.dataset.theme === 'light' ? 'sun' : 'moon');
  renderDesks(); renderDock(); M.init(); observeReveal();
  const cos = startCosmos();
  const minShow = new Promise((r) => setTimeout(r, reduceMotion ? 50 : 900));
  await Promise.allSettled([loadAll(), cos, minShow]);
  refreshAll(); observeReveal(); M.runAlerts();
  cosmosBars();
  $('#boot').classList.add('done'); document.body.classList.remove('locked');
  if (cosmos) cosmos.replayIntro();
  route();
  loadHistory().then(() => { renderLab(); renderMine(); cosmosBars(); });
  const tick = async () => { try { await loadAll(); refreshAll(); M.runAlerts(); } finally { setTimeout(tick, M.refreshMs()); } };
  setTimeout(tick, M.refreshMs());
}
boot();
