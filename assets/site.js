// Página inicial: medição própria (Supabase, sem cookies e sem terceiros), botões por celular e título A/B (?t=b).
// O build.mjs embute este arquivo no fim da página (e troca {{email}}).
(() => {
  const API = 'https://hdscvrkwrqewswkdbyjh.supabase.co/rest/v1/rpc/';
  const KEY = 'sb_publishable_0wr3NWqLTdw-lPA1n9FIlw_wOVLeqxK';
  const EMAIL = '{{email}}';
  const STORE = 'https://apps.apple.com/br/app/unihealth/id6821770645';
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

  // Link da App Store com a origem (aparece no App Store Connect em Análises → Fontes).
  const ct = encodeURIComponent((utm.s || 'site').slice(0, 40));
  document.querySelectorAll('a[data-ev="loja"]').forEach((a) => (a.href = STORE + '?ct=' + ct));
  document.querySelectorAll('[data-ev]').forEach((el) => el.addEventListener('click', () => track(el.dataset.ev)));

  const form = document.getElementById('form-teste');
  if (!form) return;
  if (plat !== 'outro') {
    const r = form.querySelector('input[value="' + plat + '"]');
    if (r) r.checked = true;
  }
  const msg = form.querySelector('.form-msg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const email = String(d.get('email') || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return void (msg.textContent = 'Confira o e-mail.');
    if (!d.get('platform')) return void (msg.textContent = 'Escolha Android ou iPhone.');
    if (!d.get('consent')) return void (msg.textContent = 'Para mandar o convite, marque a caixa de aceite.');
    const button = form.querySelector('button');
    button.disabled = true;
    msg.textContent = 'Enviando...';
    try {
      const r = await call('site_signup', {
        p_email: email, p_platform: d.get('platform'), p_consent: true, p_variant: variant, p_source: utm.s, p_medium: utm.m, p_campaign: utm.c,
      });
      if (!r.ok || (await r.json()) !== 'ok') throw new Error();
      form.classList.add('enviado');
      msg.innerHTML =
        d.get('platform') === 'ios'
          ? 'Pronto! No iPhone não precisa esperar: <a href="' + STORE + '?ct=' + ct + '">baixe na App Store</a>.'
          : 'Pronto! Em até 2 dias úteis você recebe no e-mail o convite do teste da Google Play, com o link para instalar. Confira também a caixa de spam.';
    } catch {
      button.disabled = false;
      msg.innerHTML = 'Não deu para enviar agora. Tente de novo ou escreva para <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
    }
  });
})();
