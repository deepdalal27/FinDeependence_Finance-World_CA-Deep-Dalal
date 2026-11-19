/* FinDeependence Universe · members layer.
 * Paid access (codes verified by apps/_universe/access.js), and the member features:
 * alerts centre + browser notifications, watchlist, calendar reminders (.ics), priority refresh, CSV export.
 * Everything here is stored in this browser only. Keys: fdu-watch, fdu-alerts, fdu-snap, fdu-rules, fdu-seen-day. */

const RAW = 'https://raw.githubusercontent.com/deepdalal27/FinDeependence_Finance-World_CA-Deep-Dalal/';
const IG = 'https://instagram.com/findeependence';
const GATED = ['radar', 'calendar', 'rights', 'lab', 'mine'];
const RULES = [
  ['newIpo', 'New IPO announced', true], ['open', 'IPO opens today', true], ['close', 'Last day to apply', true],
  ['allot', 'Allotment day', true], ['listing', 'Listing day', true], ['gmp', 'GMP moves 3+ points (watchlist & open IPOs)', true],
  ['sub', 'Subscription crosses 1× · 10× · 50× · 100×', true], ['rights', 'Rights issue closes tomorrow', true],
];

const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } };

export function createMembers(ctx) {
  const { S, $, $$, esc, svg, toast, dShort, inr, pct, todayIST, addDays } = ctx;
  const A = window.FDAccess || { enabled: false, status: () => ({ ok: true, open: true }), revalidate: () => Promise.resolve({ ok: true, open: true }), unlock: () => Promise.resolve({ ok: true }) };
  let st = A.status();
  const isMember = () => !!st.ok;
  const rules = () => Object.assign(Object.fromEntries(RULES.map(([k, , d]) => [k, d])), read('fdu-rules', {}));
  const watch = () => new Set(read('fdu-watch', []));

  /* ---------- gate ---------- */
  function applyGate() {
    document.body.classList.toggle('members-locked', !isMember());
    GATED.forEach((id) => {
      const sec = document.getElementById(id); if (!sec) return;
      sec.classList.add('gated');
      if (!sec.querySelector(':scope > .gate-ov')) sec.insertAdjacentHTML('beforeend', `<div class="gate-ov"><div class="gate-card"><span class="lock">${svg('lock')}</span><b>Members only</b><span>Unlock live data, every desk and alerts with your personal access code.</span><button class="btn primary sm" data-unlock>Unlock with code</button></div></div>`);
    });
    renderChip();
  }
  function renderChip() {
    const box = $('#memberBox'); if (!box) return;
    if (st.open) { box.innerHTML = ''; return; }
    if (isMember()) {
      const warn = st.days != null && st.days <= 10;
      box.innerHTML = `<button class="ibtn bell" id="bellBtn" aria-label="Alerts" title="Alerts">${svg('bell')}<i class="dot" id="bellDot" hidden></i></button><span class="mchip ${warn ? 'warn' : ''}" title="Your membership">${warn ? `Renew in ${st.days}d` : `Member · till ${st.exp.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}`}</span>`;
      updateDot();
    } else {
      box.innerHTML = `<button class="btn sm unlockbtn" data-unlock>${svg('lock')}<span>Members</span></button>`;
    }
  }

  /* ---------- unlock screen ---------- */
  function showUnlock(reason) {
    let m = $('#unlockModal');
    if (!m) {
      document.body.insertAdjacentHTML('beforeend', `<div class="pal" id="unlockModal" role="dialog" aria-modal="true" aria-label="Members access"><div class="pal-box unlock">
        <div class="ul-head"><span class="badge"><img src="assets/logo.png" alt=""></span><div><span class="lbl">FinDeependence Universe</span><h3>Members-only access</h3></div><button class="ibtn" data-ulclose aria-label="Close">${svg('x')}</button></div>
        <ul class="ul-list"><li>Live IPO Radar, IPO 360° and the 7-day calendar</li><li>All five desks: IPO Tracker, QIB Allotment Desk, Max-Profit Planner, HNI Ledger, Rights Analyser</li><li>Alerts, watchlist and phone-calendar reminders</li><li>Priority data refresh and CSV exports</li></ul>
        <div class="ul-how"><b>How to get your code</b><span>Comment <b>UNIVERSE</b> on any @findeependence post, or DM us. You'll get a personal access code for one device.</span>
          <a class="btn sm" href="${IG}" target="_blank" rel="noopener">${svg('ig')}<span>Open Instagram</span></a></div>
        <form id="ulForm" class="ul-form"><input id="ulCode" placeholder="FD-XXXXXXXX-XXXX" autocomplete="off" spellcheck="false" aria-label="Access code"><button class="btn primary" type="submit">Unlock</button></form>
        <div class="ul-msg" id="ulMsg" role="status"></div></div></div>`);
      m = $('#unlockModal');
      m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-ulclose]')) hideUnlock(); });
      $('#ulForm').addEventListener('submit', async (e) => {
        e.preventDefault(); const msg = $('#ulMsg'); msg.className = 'ul-msg'; msg.textContent = 'Checking your code…';
        const r = await A.unlock($('#ulCode').value);
        if (!r.ok) { msg.className = 'ul-msg err'; msg.textContent = r.msg; return; }
        st = A.status(); msg.className = 'ul-msg ok'; msg.textContent = `Welcome! Access active till ${r.exp.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.`;
        applyGate(); ctx.onUnlock && ctx.onUnlock();
        setTimeout(hideUnlock, 1100);
      });
    }
    const msg = $('#ulMsg');
    const why = { expired: A.messages && A.messages.expired, device: A.messages && A.messages.device, offline: A.messages && A.messages.offline, invalid: 'Your code is no longer valid. DM @findeependence for help.' }[reason || st.reason];
    msg.className = why ? 'ul-msg err' : 'ul-msg'; msg.textContent = why || '';
    m.hidden = false; setTimeout(() => $('#ulCode').focus(), 30);
  }
  function hideUnlock() { const m = $('#unlockModal'); if (m) m.hidden = true; if (location.hash === '#/unlock') history.replaceState(null, '', location.pathname + location.search); }

  /* ---------- alerts ---------- */
  function updateDot() { const d = $('#bellDot'); if (d) d.hidden = !read('fdu-alerts', []).some((a) => !a.read); }
  function push(list, a) {
    const all = read('fdu-alerts', []);
    if (all.some((x) => x.id === a.id) || list.some((x) => x.id === a.id)) return;
    list.push({ ...a, at: Date.now(), read: false });
  }
  function runAlerts() {
    if (!isMember()) return;
    const R = rules(), W = watch(), t = todayIST(), snap = read('fdu-snap', null), fresh = [];
    const first = !snap; const next = {};
    S.ipos.forEach((o) => {
      const prev = snap && snap[o.key];
      next[o.key] = { gmpPct: o.gmpPct, sub: o.subTotal, status: o.status };
      if (R.newIpo && snap && !prev && o.status !== 'listed') push(fresh, { id: `new:${o.key}`, ipo: o.key, kind: 'New IPO', text: `${o.name} (${o.board}) added · opens ${dShort(o.open)}` });
      const day = (k, d, label) => { if (R[k] && d === t) push(fresh, { id: `${k}:${o.key}:${t}`, ipo: o.key, kind: label, text: `${o.name} · ${label.toLowerCase()} today` }); };
      day('open', o.open, 'Opens'); day('close', o.close, 'Last day'); day('allot', o.allot, 'Allotment'); day('listing', o.listing, 'Listing');
      if (R.gmp && prev && prev.gmpPct != null && o.gmpPct != null && (W.has(o.key) || o.status === 'open') && Math.abs(o.gmpPct - prev.gmpPct) >= 3) {
        push(fresh, { id: `gmp:${o.key}:${Math.round(o.gmpPct)}:${t}`, ipo: o.key, kind: 'GMP move', text: `${o.name} · GMP ${o.gmp != null ? inr(o.gmp) : ''} (${pct(o.gmpPct)} vs ${pct(prev.gmpPct)})` });
      }
      if (R.sub && prev && o.subTotal != null) [1, 10, 50, 100].forEach((lv) => { if ((prev.sub ?? 0) < lv && o.subTotal >= lv) push(fresh, { id: `sub:${o.key}:${lv}`, ipo: o.key, kind: 'Subscription', text: `${o.name} crossed ${lv}× (now ${o.subTotal.toFixed(2)}×)` }); });
    });
    if (R.rights) S.rights.forEach((r) => { if (r.status === 'open' && r.close === addDays(t, 1)) push(fresh, { id: `rights:${r.id}:${r.close}`, desk: 'rights', kind: 'Rights issue', text: `${r.name} rights issue closes tomorrow (${dShort(r.close)})` }); });
    write('fdu-snap', next);
    if (first) { // first run on this device: only today's date alerts, no "everything is new" flood
      for (let i = fresh.length - 1; i >= 0; i--) if (fresh[i].kind === 'New IPO') fresh.splice(i, 1);
    }
    if (!fresh.length) { updateDot(); return; }
    write('fdu-alerts', [...fresh, ...read('fdu-alerts', [])].slice(0, 120));
    updateDot();
    toast(fresh.length === 1 ? fresh[0].text : `${fresh.length} new alerts`);
    if (read('fdu-notify', false) && 'Notification' in window && Notification.permission === 'granted') {
      fresh.slice(0, 4).forEach((a) => { try { new Notification('FinDeependence · ' + a.kind, { body: a.text, icon: 'assets/logo.png', tag: a.id }); } catch (e) { /* not allowed here */ } });
    }
    if ($('#alertPanel') && !$('#alertPanel').hidden) renderAlerts();
  }
  function renderAlerts() {
    let p = $('#alertPanel');
    if (!p) {
      document.body.insertAdjacentHTML('beforeend', `<aside class="alerts" id="alertPanel" hidden aria-label="Alerts"></aside>`);
      p = $('#alertPanel');
      p.addEventListener('change', (e) => {
        const k = e.target.dataset.rule; if (k) { const r = read('fdu-rules', {}); r[k] = e.target.checked; write('fdu-rules', r); }
        if (e.target.id === 'notifyToggle') toggleNotify(e.target.checked);
      });
    }
    const all = read('fdu-alerts', []), R = rules(), W = watch();
    const notifOn = read('fdu-notify', false) && 'Notification' in window && Notification.permission === 'granted';
    p.innerHTML = `<div class="al-head"><div><span class="lbl">Members</span><h3>Alerts</h3></div><button class="ibtn" data-alclose aria-label="Close">${svg('x')}</button></div>
      <div class="al-body">
        <div class="al-tools">
          <label class="sw"><input type="checkbox" id="notifyToggle" ${notifOn ? 'checked' : ''}><span></span>Browser notifications</label>
          <button class="btn sm" data-ics ${W.size ? '' : 'disabled'}>${svg('cal')}<span>Add ${W.size || ''} watchlist IPO${W.size === 1 ? '' : 's'} to my calendar</span></button>
        </div>
        <p class="note">Alerts check every 2 minutes while the Universe is open. Calendar reminders work even when it's closed. ★ an IPO to add it to your watchlist.</p>
        <details class="al-rules"><summary>What to alert me about</summary>${RULES.map(([k, l]) => `<label><input type="checkbox" data-rule="${k}" ${R[k] ? 'checked' : ''}> ${l}</label>`).join('')}</details>
        <div class="al-list">${all.length ? all.map((a) => `<button class="al-item ${a.read ? '' : 'new'}" ${a.ipo ? `data-ipo="${esc(a.ipo)}"` : `data-open="${a.desk || 'rights'}"`}><small>${esc(a.kind)} · ${new Date(a.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>${esc(a.text)}</button>`).join('') : '<div class="empty">No alerts yet. They appear here as IPOs open, close, allot and list.</div>'}</div>
        ${all.length ? '<button class="btn sm" data-alclear>Clear all</button>' : ''}
      </div>`;
    write('fdu-alerts', all.map((a) => ({ ...a, read: true }))); updateDot();
  }
  async function toggleNotify(on) {
    if (on && 'Notification' in window) {
      const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
      write('fdu-notify', perm === 'granted');
      if (perm !== 'granted') toast('Notifications are blocked in this browser’s settings');
    } else write('fdu-notify', false);
    renderAlerts();
  }
  function openAlerts() { if (!isMember()) { showUnlock(); return; } renderAlerts(); $('#alertPanel').hidden = false; }

  /* ---------- watchlist + calendar (.ics) ---------- */
  function star(key, big) {
    if (!isMember()) return '';
    const on = watch().has(key);
    return `<button class="star ${on ? 'on' : ''} ${big ? 'big' : ''}" data-watch="${esc(key)}" aria-pressed="${on}" title="${on ? 'Remove from watchlist' : 'Add to watchlist'}">${on ? '★' : '☆'}</button>`;
  }
  function toggleWatch(key) {
    const w = watch(); if (w.has(key)) w.delete(key); else w.add(key); write('fdu-watch', [...w]);
    $$(`[data-watch="${CSS.escape(key)}"]`).forEach((b) => { const on = w.has(key); b.classList.toggle('on', on); b.textContent = on ? '★' : '☆'; b.setAttribute('aria-pressed', on); });
    toast(w.has(key) ? 'Added to your watchlist' : 'Removed from your watchlist');
  }
  function ics() {
    const W = watch(), list = S.ipos.filter((o) => W.has(o.key));
    if (!list.length) { toast('Star an IPO first'); return; }
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const ev = [];
    list.forEach((o) => [['open', o.open, 'opens'], ['close', o.close, 'last day to apply'], ['allot', o.allot, 'allotment'], ['listing', o.listing, 'lists']].forEach(([k, d, l]) => {
      if (!d) return; const ds = d.replace(/-/g, '');
      ev.push(['BEGIN:VEVENT', `UID:${o.key}-${k}-${ds}@findeependence`, `DTSTAMP:${stamp}`, `DTSTART;TZID=Asia/Kolkata:${ds}T091500`, `DTEND;TZID=Asia/Kolkata:${ds}T093000`,
        `SUMMARY:${o.name} IPO ${l}`, `DESCRIPTION:${o.board}${o.gmp != null ? ` · GMP at export ₹${o.gmp}` : ''} · FinDeependence Universe`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${o.name} IPO ${l}`, 'TRIGGER:-PT30M', 'END:VALARM', 'END:VEVENT'].join('\r\n'));
    }));
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FinDeependence//Universe//EN', 'CALSCALE:GREGORIAN', ...ev, 'END:VCALENDAR'].join('\r\n');
    download(`FinDeependence_watchlist_${todayIST()}.ics`, body, 'text/calendar');
  }

  /* ---------- exports ---------- */
  function csvCell(v) { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
  function exportRadar(rows) {
    if (!isMember()) { showUnlock(); return; }
    const head = ['IPO', 'Board', 'Exchange', 'Status', 'Price low', 'Price high', 'Lot', '1 lot ₹', 'Size ₹ Cr', 'GMP ₹', 'Est. gain %', 'Total ×', 'QIB ×', 'NII ×', 'Retail ×', 'Retail odds %', 'Open', 'Close', 'Allotment', 'Listing', 'Registrar'];
    const lines = rows.map((o) => [o.name, o.board, o.exchange, o.status, o.priceLow, o.priceHigh, o.lot, o.lotAmt, o.sizeCr, o.gmp, o.gmpPct != null ? o.gmpPct.toFixed(2) : '', o.subTotal, o.sub && o.sub.qib && o.sub.qib.times, o.sub && o.sub.nii && o.sub.nii.times, o.sub && o.sub.retail && o.sub.retail.times, o.odds.retail != null ? (o.odds.retail * 100).toFixed(2) : '', o.open, o.close, o.allot, o.listing, o.registrar].map(csvCell).join(','));
    download(`FinDeependence_IPO_Radar_${todayIST()}.csv`, '﻿' + [head.join(','), ...lines].join('\n'), 'text/csv');
  }
  function exportHistory() {
    if (!isMember()) { showUnlock(); return; }
    const head = ['IPO', 'Segment', 'Listing date', 'Issue price', 'Size ₹ Cr', 'Total subscription ×', 'Listing gain %', 'Last GMP ₹'];
    const lines = S.hist.map((h) => [h.name, h.seg, h.date, h.price, h.sizeCr, h.sub, h.gain, h.gmpFinal].map(csvCell).join(','));
    download(`FinDeependence_IPO_History_${todayIST()}.csv`, '﻿' + [head.join(','), ...lines].join('\n'), 'text/csv');
  }
  function download(name, text, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- priority data ---------- */
  // Members read the feeds straight from the repository (fresher than the Pages copy), with the site as fallback.
  function feedUrls(url) {
    if (!isMember()) return [url];
    const raw = url === 'apps/rights/data/rights.json' ? RAW + 'rights-data/data/rights.json' : RAW + 'main/' + url;
    return [raw, url];
  }
  const refreshMs = () => (isMember() ? 2 : 5) * 60 * 1000;

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const w = e.target.closest('[data-watch]'); if (w) { e.preventDefault(); e.stopPropagation(); toggleWatch(w.dataset.watch); return; }
    if (e.target.closest('[data-unlock]')) { e.preventDefault(); e.stopPropagation(); showUnlock(); return; }
    if (e.target.closest('#bellBtn')) { e.stopPropagation(); openAlerts(); return; }
    if (e.target.closest('[data-alclose]')) { $('#alertPanel').hidden = true; return; }
    if (e.target.closest('[data-alclear]')) { write('fdu-alerts', []); renderAlerts(); return; }
    if (e.target.closest('[data-ics]')) { ics(); return; }
    if (e.target.closest('[data-export="radar"]')) { e.stopPropagation(); exportRadar(ctx.radarRows()); return; }
    if (e.target.closest('[data-export="history"]')) { e.stopPropagation(); exportHistory(); return; }
    if (e.target.closest('.al-item') && $('#alertPanel')) $('#alertPanel').hidden = true;
  }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if ($('#unlockModal') && !$('#unlockModal').hidden) hideUnlock(); if ($('#alertPanel') && !$('#alertPanel').hidden) $('#alertPanel').hidden = true; } });

  return {
    init() {
      applyGate();
      A.revalidate().then((s) => { const was = isMember(); st = s.ok ? A.status() : s; applyGate(); if (was && !isMember()) { toast('Your membership needs attention'); showUnlock(s.reason); ctx.onLock && ctx.onLock(); } });
    },
    allowed: isMember, isMember, showUnlock, star, openAlerts, runAlerts, feedUrls, refreshMs,
    exportRadar: () => exportRadar(ctx.radarRows()), exportHistory,
  };
}
