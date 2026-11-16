// Página inicial: medição própria (Supabase, sem cookies e sem terceiros), botões por celular e título A/B (?t=b).
// O build.mjs embute este arquivo no fim da página.
(() => {
  const API = 'https://hdscvrkwrqewswkdbyjh.supabase.co/rest/v1/rpc/';
  const KEY = 'sb_publishable_0wr3NWqLTdw-lPA1n9FIlw_wOVLeqxK';
  const STORE = 'https://apps.apple.com/br/app/unihealth/id6821770645';
  const PLAY = 'https://play.google.com/store/apps/details?id=com.erickgabriel.unihealth';
  const q = new URLSearchParams(location.search);
  const store = (k, v) => {
    try {
      if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || 'null');
      sessionStorage.setItem(k, JSON.stringify(v));
    } catch {
      return null;
    }
  };

  // Origem: utm_source do link; sem ele, um palpite pelo site de onde a pessoa veio.
  let ref = '';
  try {
    ref = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {}
  const guess = /instagram/.test(ref) ? 'instagram' : /tiktok/.test(ref) ? 'tiktok' : /google\./.test(ref) ? 'google' : /facebook/.test(ref) ? 'facebook' : '';
  let utm = store('uh-utm');
  if (q.get('utm_source') || !utm) utm = { s: q.get('utm_source') || guess, m: q.get('utm_medium') || '', c: q.get('utm_campaign') || '' };
  store('uh-utm', utm);

  // Título A/B: ?t=b mostra a versão B e fica guardado na sessão.
  const variant = q.get('t') === 'a' || q.get('t') === 'b' ? q.get('t') : store('uh-t') || 'a';
  store('uh-t', variant);
  if (variant === 'b') {
    const h = document.getElementById('manchete');
    if (h) {
      h.innerHTML = '<span>Treino, prato</span><span>e sono.</span><span>Um app só.</span>';
      h.classList.add('manchete-b');
    }
  }

  const ua = navigator.userAgent;
  const plat = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'ios' : /Android/.test(ua) ? 'android' : 'outro';
  document.documentElement.classList.add('plat-' + plat);

  const call = (fn, body) =>
    fetch(API + fn, { method: 'POST', keepalive: true, headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const track = (kind) =>
    call('site_track', { p_kind: kind, p_variant: variant, p_platform: plat, p_source: utm.s, p_medium: utm.m, p_campaign: utm.c }).catch(() => {});
  if (!store('uh-visita')) {
    store('uh-visita', 1);
    track('visita');
  }

  // Links das lojas com a origem: App Store em Análises → Fontes (ct) e Google Play em Aquisição (referrer com utm).
  const ct = encodeURIComponent((utm.s || 'site').slice(0, 40));
  const playRef = encodeURIComponent('utm_source=' + (utm.s || 'site').slice(0, 40) + '&utm_medium=' + (utm.m || 'site').slice(0, 40) + (utm.c ? '&utm_campaign=' + utm.c.slice(0, 60) : ''));
  document.querySelectorAll('a[href^="' + STORE + '"]').forEach((a) => (a.href = STORE + '?ct=' + ct));
  document.querySelectorAll('a[href^="' + PLAY + '"]').forEach((a) => (a.href = PLAY + '&referrer=' + playRef));
  document.querySelectorAll('[data-ev]').forEach((el) => el.addEventListener('click', () => track(el.dataset.ev)));
})();
