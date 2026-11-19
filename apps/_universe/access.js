/* FinDeependence Universe · members access.
 * Same access codes as the original FinDeependence IPO Tracker: FD-YYMMDDxx-HASH, verified by the
 * fd-license Cloudflare worker (one code = one device). Same storage keys (fd_lic, fd_lic_ok, fd_dev),
 * so a browser that already unlocked the tracker on deepdalal27.github.io is already a member here.
 *
 * Set ON = false to open the whole Universe to everyone.
 * Note: this is a client-side gate, like the original tracker's. It keeps honest visitors out; anyone who
 * reads the public repository can still reach the code and data. See README "Access" for a stronger setup.
 */
(function () {
  var ON = true;
  var SECRET = 'FD!FreedomWithFinance#DeepDalal$2026';
  var WORKER = 'https://fd-license.deepuploads27.workers.dev';
  var GRACE = 72 * 3600 * 1000, RECHECK = 12 * 3600 * 1000;

  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { return null; }
    return null;
  }
  function fdHash(s) { var h = 5381; for (var i = 0; i < s.length; i++) { h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0; } return ('0000' + h.toString(36).toUpperCase()).slice(-4); }
  function norm(code) { return String(code || '').trim().toUpperCase().replace(/\s/g, ''); }
  // Date = valid until that day · false = expired · null = not a valid code
  function checkCode(code) {
    var m = norm(code).match(/^FD-?(\d{6}[A-Z0-9]{2})-?([A-Z0-9]{4})$/);
    if (!m) return null;
    if (fdHash(m[1] + SECRET) !== m[2]) return null;
    var y = 2000 + +m[1].slice(0, 2), mo = +m[1].slice(2, 4), d = +m[1].slice(4, 6);
    var exp = new Date(y, mo - 1, d, 23, 59, 59);
    return exp >= new Date() ? exp : false;
  }
  function deviceId() {
    var d = ls('fd_dev');
    if (!d) { d = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2); ls('fd_dev', d); }
    return d;
  }
  function status() {
    if (!ON) return { ok: true, open: true };
    var exp = checkCode(ls('fd_lic'));
    if (!(exp instanceof Date)) return { ok: false, reason: exp === false ? 'expired' : 'none' };
    var last = +ls('fd_lic_ok') || 0;
    if (last !== 0 && Date.now() - last > GRACE) return { ok: false, reason: 'offline', exp: exp };
    return { ok: true, exp: exp, last: last, days: Math.ceil((exp - new Date()) / 864e5) };
  }
  function verify(code) {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, 10000);
    return fetch(WORKER + '/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, device: deviceId() }), signal: c.signal })
      .then(function (r) { return r.json(); }).finally(function () { clearTimeout(t); });
  }
  var MSG = {
    invalid: 'That code isn’t valid. Check for typos, or DM @findeependence for help.',
    expired: 'This code has expired. DM @findeependence to renew.',
    device: 'This code is already active on another device. One code = one device. DM @findeependence if you changed your phone.',
    network: 'Couldn’t reach the verification server. Check your internet and try again.',
    offline: 'Go online once so we can confirm your membership.',
  };
  function unlock(code) {
    var v = norm(code), st = checkCode(v);
    if (st === false) return Promise.resolve({ ok: false, msg: MSG.expired });
    if (st === null) return Promise.resolve({ ok: false, msg: MSG.invalid });
    return verify(v).then(function (r) {
      if (!r || !r.ok) return { ok: false, msg: r && r.reason === 'device' ? MSG.device : r && r.reason === 'expired' ? MSG.expired : MSG.invalid };
      ls('fd_lic', v); ls('fd_lic_ok', String(Date.now()));
      return { ok: true, exp: st };
    }, function () { return { ok: false, msg: MSG.network }; });
  }
  // Re-check with the worker at most every 12 h. Offline is fine for 72 h after the last check.
  function revalidate() {
    var s = status();
    if (!s.ok || s.open) return Promise.resolve(s);
    if (s.last && Date.now() - s.last < RECHECK) return Promise.resolve(s);
    return verify(ls('fd_lic')).then(function (r) {
      if (r && r.ok) { ls('fd_lic_ok', String(Date.now())); return status(); }
      ls('fd_lic', null); ls('fd_lic_ok', null);
      return { ok: false, reason: r && r.reason === 'device' ? 'device' : r && r.reason === 'expired' ? 'expired' : 'invalid' };
    }, function () { return status(); });
  }
  window.FDAccess = { enabled: ON, status: status, unlock: unlock, revalidate: revalidate, messages: MSG };

  // Desk pages load this with data-guard: without a membership they go to the Universe's unlock screen.
  var me = document.currentScript;
  if (me && me.hasAttribute('data-guard') && ON && !status().ok) {
    var root = new URL('../../', me.src).href;
    var target = root + '#/unlock';
    try { document.documentElement.style.visibility = 'hidden'; } catch (e) {}
    try { if (window.top !== window && window.top.location.origin === location.origin) { window.top.location.replace(target); } else { location.replace(target); } }
    catch (e) { location.replace(target); }
  }
})();
