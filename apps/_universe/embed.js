/* FinDeependence Universe · module bridge.
 * Loaded by every module page. It only adds classes and talks to the Universe shell; it never changes a module's
 * logic, data or storage. data-skin="classic" maps the older green palette to the FinDeependence Studio palette.
 * Inside the Universe (an iframe on the same site) the module's own brand band is hidden: the shell shows it. */
(function () {
  var root = document.documentElement, me = document.currentScript;
  var skin = me && me.getAttribute('data-skin');
  if (skin) root.classList.add('fdu-skin-' + skin);
  var framed = false;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (!framed) return;
  var sameSite = false;
  try { sameSite = !!window.parent.location.href; } catch (e) { sameSite = false; }
  if (!sameSite) return;
  root.classList.add('fdu-embed');
  function post(msg) { try { window.parent.postMessage(msg, location.origin); } catch (e) {} }
  function ready() { post({ fdu: 'ready', title: document.title, path: location.pathname }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
  // Cmd/Ctrl+K inside a module opens the Universe command palette.
  window.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); post({ fdu: 'palette' }); }
  });
})();
