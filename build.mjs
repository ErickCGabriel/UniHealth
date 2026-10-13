// Gera as páginas do site (unihealthapp.com.br) com o mesmo topo e rodapé.
// A Política de Privacidade e os Termos vêm do texto do app (../unihealth/src/data/legal.json),
// para o site e o app dizerem sempre a mesma coisa.
// Uso: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const legal = JSON.parse(readFileSync(new URL('../unihealth/src/data/legal.json', import.meta.url), 'utf8'));
const EMAIL = legal.email;
const SITE = 'https://unihealthapp.com.br';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fill = (s) => esc(s.replaceAll('{{controller}}', legal.controller).replaceAll('{{email}}', legal.email));

const icon = {
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icon[name]}</svg>`;

function page({ file, title, description, body, current, script = '' }) {
  const link = (href, label, cls = '') =>
    `<a href="${href}"${cls ? ` class="${cls}"` : ''}${current === href ? ' aria-current="page"' : ''}>${label}</a>`;
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#121214">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/assets/icon.png">
<meta property="og:url" content="${SITE}/${file === 'index.html' ? '' : file}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Syne:wght@800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="/"><img src="/assets/icon.png" alt="">UniHealth</a>
    <nav class="nav-links" aria-label="Principal">
      ${link('/#recursos', 'Recursos', 'hide-sm')}
      ${link('/suporte.html', 'Suporte')}
      ${link('/privacidade.html', 'Privacidade', 'hide-sm')}
    </nav>
  </div>
</header>
<main>
${body}
</main>
<footer>
  <div class="wrap">
    <span>© 2026 ${esc(legal.controller)} · UniHealth</span>
    <nav aria-label="Rodapé">
      <a href="/suporte.html">Suporte</a>
      <a href="/excluir-conta.html">Excluir conta</a>
      <a href="/privacidade.html">Política de Privacidade</a>
      <a href="/termos.html">Termos de Uso</a>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
    </nav>
  </div>
</footer>
${script ? `<script>${script}</script>\n` : ''}</body>
</html>
`;
  writeFileSync(new URL(`./${file}`, import.meta.url), html);
  console.log(file);
}

// ---------- Início ----------
const card = (ico, title, text, cls = '') =>
  `<div class="card ${cls}"><div class="ico">${svg(ico)}</div><h3>${title}</h3><p>${text}</p></div>`;

page({
  file: 'index.html',
  title: 'UniHealth: Treino e Saúde',
  description: 'Treino, alimentação, água e sono num só app, com metas feitas para o seu corpo e desafios com os amigos. Do zero ao avançado.',
  current: '/',
  body: `
<div class="hero">
  <div class="wrap">
    <div>
      <p class="eyebrow">Treino · Alimentação · Hábitos</p>
      <h1>Escolha o shape.<br>A gente monta o caminho.</h1>
      <p class="lead">Treinos, refeições, água e sono no mesmo quadro do dia, com metas calculadas para o seu corpo. Para quem nunca treinou e para quem treina todo dia.</p>
      <div class="cta">
        <a class="btn btn-primary" aria-disabled="true"><span class="two">Android<small>Em breve na Google Play</small></span></a>
        <a class="btn btn-ghost" aria-disabled="true"><span class="two">iPhone<small>Em breve no TestFlight</small></span></a>
      </div>
      <p class="note">Em fase de testes. Quer participar? Escreva para <a href="mailto:${EMAIL}?subject=Quero%20testar%20o%20UniHealth">${EMAIL}</a>.</p>
    </div>
    <div class="hero-art"><img src="/assets/icon.png" alt="Ícone do UniHealth: um anel de progresso com a letra U"></div>
  </div>
</div>

<section id="recursos">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Recursos</p>
      <h2>Tudo o que ajuda a manter o hábito</h2>
      <p>O UniHealth calcula as suas metas e mostra o dia inteiro num lugar só. Sem planilha, sem cinco apps diferentes.</p>
    </div>
    <div class="grid">
      ${card('activity', 'Treinos que se adaptam', 'Programas de 8 semanas pelo seu objetivo, experiência e dias livres. Registre cargas, descanso cronometrado e recordes pessoais.')}
      ${card('wind', 'Cardio também conta', 'Corrida do zero aos 10 km, pedal, caminhada e natação. Meta semanal de 150 minutos, como recomenda a OMS.')}
      ${card('camera', 'Prato por foto', 'Fotografe a refeição e receba uma estimativa de calorias e macronutrientes por inteligência artificial.', 'food')}
      ${card('droplet', 'Água e lembretes', 'Meta de água pelo seu peso, com lembretes de água, treino, refeições e pesagem no horário que você escolher.')}
      ${card('moon', 'Sono e recuperação', 'Registre como dormiu e veja a sua recuperação para saber quando ir com tudo e quando pegar leve.', 'sleep')}
      ${card('calendar', 'Ciclo menstrual', 'Acompanhe o ciclo e veja as metas ajustadas em cada fase. Opcional e só para quem quiser.', 'sleep')}
      ${card('users', 'Amigos e grupos', 'Desafios de dias treinados, passos, cardio ou Uni Pontos, com pódio no final, reações e cutucadas.')}
      ${card('award', 'Conquistas', 'Mais de 40 conquistas e níveis para comemorar cada passo, do primeiro treino ao centésimo.')}
      ${card('heart', '900+ exercícios', 'Biblioteca com fotos do movimento, separada por músculo, para montar o treino do seu jeito.')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Para quem é</p>
      <h2>Do primeiro passo ao treino de todo dia</h2>
    </div>
    <div class="split">
      <div class="card">
        <h3>Nunca treinou?</h3>
        <p>Comece pelo Primeiros Passos: duas sessões de 20 minutos por semana, em casa, sem equipamento. No seu tempo.</p>
      </div>
      <div class="card">
        <h3>Ama academia?</h3>
        <p>Programas avançados de até 6 dias, sugestão de aumento de carga e histórico completo de cada exercício.</p>
      </div>
      <div class="card">
        <h3>Prefere cardio?</h3>
        <p>Programas de corrida, pedal, natação e caminhada. O treino de cardio entra direto na sua meta da semana.</p>
      </div>
      <div class="card">
        <h3>Tem 50 anos ou mais?</h3>
        <p>Vida Ativa 50+: força, equilíbrio e mobilidade com segurança, adaptados às limitações que você informar.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap split">
    <div>
      <p class="eyebrow">Privacidade</p>
      <h2>Seus dados, suas regras</h2>
    </div>
    <ul class="check">
      <li>Funciona sem conta: os dados ficam só no seu celular.</li>
      <li>Com conta, backup na nuvem e acesso em qualquer aparelho.</li>
      <li>Sem anúncios e sem venda de dados.</li>
      <li>Na parte social, só o resumo que você permitir. Peso, refeições e saúde nunca são compartilhados.</li>
      <li>Excluir a conta apaga tudo da nuvem na hora, pelo próprio app.</li>
    </ul>
  </div>
</section>

<section class="final">
  <div class="wrap">
    <h2>Seu próximo treino começa aqui</h2>
    <p>O UniHealth está em fase de testes no Android e no iPhone. Em breve nas lojas.</p>
    <div class="cta">
      <a class="btn btn-primary" href="mailto:${EMAIL}?subject=Quero%20testar%20o%20UniHealth">Quero testar</a>
      <a class="btn btn-ghost" href="/suporte.html">Dúvidas frequentes</a>
    </div>
  </div>
</section>`,
});

// ---------- Suporte ----------
const faq = (q, a) => `<details><summary>${q}</summary>${a.map((p) => `<p>${p}</p>`).join('')}</details>`;
page({
  file: 'suporte.html',
  title: 'Suporte · UniHealth',
  description: 'Dúvidas frequentes, contato e como excluir sua conta do UniHealth.',
  current: '/suporte.html',
  body: `
<div class="doc">
  <div class="wrap">
    <h1>Suporte</h1>
    <p class="updated">Respondemos em até 15 dias, normalmente bem antes.</p>
    <div class="box accent">
      <strong>Fale com a gente</strong>
      <p>Dentro do app: <strong>Perfil → Enviar feedback</strong> (dá para anexar print).<br>Por e-mail: <a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>

    <h2>Dúvidas frequentes</h2>
    ${faq('Preciso criar uma conta?', ['Não. O UniHealth funciona sem conta e os dados ficam só no seu celular. Com conta, você ganha backup na nuvem, acesso em outros aparelhos, a análise de fotos por IA e a parte social.'])}
    ${faq('Posso entrar com @usuário em vez do e-mail?', ['Sim. Na tela de entrar, digite seu e-mail ou seu @usuário e a senha. Também dá para entrar com o Google.'])}
    ${faq('Troquei de celular. Como recupero meus dados?', ['Instale o app no celular novo e entre com a mesma conta (Perfil → Conta e backup). Treinos, refeições, sono e fotos voltam sozinhos.'])}
    ${faq('O app lê os dados do meu relógio?', ['No Android, sim: conecte o Health Connect em Treinos → Cardio e passos para trazer passos, sono, batimentos e exercícios. No iPhone, a integração com o Apple Saúde ainda não está disponível.'])}
    ${faq('A análise do prato por foto é exata?', ['É uma estimativa feita por inteligência artificial e pode errar. Confira e ajuste os valores antes de salvar. Ela precisa de conta e tem um limite diário de análises.'])}
    ${faq('Os outros veem meu peso ou o que eu como?', ['Não. Na parte social, que é opcional, só aparece o resumo que você permitir: se treinou, passos, minutos de cardio e Uni Pontos. Peso, refeições, sono, ciclo e batimentos nunca são compartilhados.'])}
    ${faq('Os lembretes não chegam. O que faço?', ['Confira se as notificações do UniHealth estão permitidas nos ajustes do celular. No Android 12 ou mais novo, ligue também "Alarmes e lembretes" para o app (Perfil → Lembretes mostra o atalho).'])}
    ${faq('O UniHealth substitui um profissional?', ['Não. O app dá informações gerais e estimativas. Procure um médico, nutricionista ou profissional de educação física antes de mudar sua rotina, principalmente se tiver alguma condição de saúde.'])}

    <h2 id="excluir-conta">Excluir sua conta</h2>
    <p>Você pode excluir a conta e todos os dados da nuvem quando quiser. Veja o passo a passo em <a href="/excluir-conta.html">Excluir conta</a>.</p>

    <h2>Documentos</h2>
    <p><a href="/privacidade.html">Política de Privacidade</a> · <a href="/termos.html">Termos de Uso</a></p>
  </div>
</div>`,
});

// ---------- Excluir conta (link pedido pela Google Play) ----------
page({
  file: 'excluir-conta.html',
  title: 'Excluir conta · UniHealth',
  description: 'Como excluir sua conta do UniHealth e os dados guardados na nuvem.',
  current: '/excluir-conta.html',
  body: `
<div class="doc">
  <div class="wrap">
    <h1>Excluir sua conta</h1>
    <p class="updated">UniHealth, por ${esc(legal.controller)}</p>

    <h2>Pelo app (na hora)</h2>
    <ol class="steps">
      <li>Abra o UniHealth e entre na sua conta.</li>
      <li>Vá em <strong>Perfil → Conta e backup</strong>.</li>
      <li>Toque em <strong>Excluir conta</strong> e confirme.</li>
    </ol>
    <p>No fim, o app pergunta se você também quer apagar os dados guardados no celular.</p>

    <h2>Sem acesso ao app</h2>
    <p>Envie um e-mail para <a href="mailto:${EMAIL}?subject=Excluir%20minha%20conta">${EMAIL}</a> com o assunto <strong>"Excluir minha conta"</strong>, a partir do e-mail cadastrado. Fazemos a exclusão em até 30 dias.</p>

    <h2>O que é apagado</h2>
    <div class="box">
      <ul>
        <li>A conta (e-mail, @usuário e login com Google).</li>
        <li>O backup na nuvem: perfil, treinos, refeições, sono, água, passos, cardio, ciclo e testes.</li>
        <li>As fotos das refeições.</li>
        <li>A parte social: perfil social, amizades, participação em grupos, resumos diários, eventos do feed, reações e cutucadas. Grupos que você criou passam para outro membro.</li>
      </ul>
    </div>
    <h2>O que pode ficar</h2>
    <p>Mensagens de feedback e relatórios de erro que você enviou ficam guardados por até 12 meses, sem ligação com a conta. Mantemos só o que a lei obrigar.</p>
    <p>Mais detalhes na <a href="/privacidade.html">Política de Privacidade</a>.</p>
  </div>
</div>`,
});

// ---------- Política e Termos (do texto do app) ----------
const paras = (ps) => {
  let out = '';
  let list = false;
  for (const p of ps) {
    const bullet = p.startsWith('•');
    if (bullet && !list) { out += '<ul>'; list = true; }
    if (!bullet && list) { out += '</ul>'; list = false; }
    out += bullet ? `<li>${fill(p.slice(1).trim())}</li>` : `<p>${fill(p)}</p>`;
  }
  return list ? `${out}</ul>` : out;
};
for (const [id, doc] of Object.entries(legal.docs)) {
  page({
    file: `${id}.html`,
    title: `${doc.title} · UniHealth`,
    description: `${doc.title} do aplicativo UniHealth.`,
    current: `/${id}.html`,
    body: `
<div class="doc">
  <div class="wrap">
    <h1>${esc(doc.title)}</h1>
    <p class="updated">Última atualização: ${esc(legal.updated)}</p>
    ${paras(doc.intro)}
    ${doc.sections.map((s) => `<h2>${esc(s.h)}</h2>\n${paras(s.p)}`).join('\n')}
  </div>
</div>`,
  });
}

// ---------- Convite (link clicável no WhatsApp que abre o app) ----------
// /convite?g=CODIGO -> entrar no grupo   |   /convite?u=usuario -> adicionar amigo
// O WhatsApp não deixa tocar em links "unihealth://", então o app compartilha este endereço
// e a página abre o app (ou mostra o código e como conseguir o app).
page({
  file: 'convite.html',
  title: 'Convite · UniHealth',
  description: 'Você recebeu um convite para treinar junto no UniHealth.',
  body: `
<div class="doc invite">
  <div class="wrap">
    <p class="eyebrow" id="inv-kind">Convite</p>
    <h1 id="inv-title">Bora treinar junto?</h1>
    <p class="lead" id="inv-text">Abra este convite no celular com o UniHealth instalado.</p>
    <div class="box accent" id="inv-box" hidden>
      <p class="invite-label" id="inv-label"></p>
      <p class="invite-code" id="inv-code"></p>
    </div>
    <div class="cta">
      <a class="btn btn-primary" id="inv-open" href="/">Abrir no UniHealth</a>
    </div>
    <h2>Ainda não tem o app?</h2>
    <p>O UniHealth está em fase de testes no Android e no iPhone. Para participar, escreva para <a href="mailto:${EMAIL}?subject=Quero%20testar%20o%20UniHealth">${EMAIL}</a>. Depois de instalar, toque de novo no link do convite<span id="inv-hint"></span>.</p>
  </div>
</div>`,
  script: `(function () {
  var q = new URLSearchParams(location.search);
  var g = (q.get('g') || '').trim().toUpperCase();
  var u = (q.get('u') || '').trim().toLowerCase().replace(/^@/, '');
  var $ = function (id) { return document.getElementById(id); };
  var path = '';
  if (/^[A-Z0-9]{4,12}$/.test(g)) {
    path = 'social/convite/' + g;
    $('inv-kind').textContent = 'Convite para grupo';
    $('inv-title').textContent = 'Entre no grupo';
    $('inv-text').textContent = 'Toque no botão para abrir o grupo no UniHealth.';
    $('inv-label').textContent = 'Código do grupo';
    $('inv-code').textContent = g;
    $('inv-hint').textContent = ' ou use o código acima em Social, Entrar com código';
  } else if (/^[a-z0-9_.]{3,20}$/.test(u)) {
    path = 'social/amigo/' + u;
    $('inv-kind').textContent = 'Convite de amizade';
    $('inv-title').textContent = 'Treine junto com @' + u;
    $('inv-text').textContent = 'Toque no botão para adicionar @' + u + ' no UniHealth.';
    $('inv-label').textContent = 'Usuário';
    $('inv-code').textContent = '@' + u;
    $('inv-hint').textContent = ' ou adicione @' + u + ' em Social, Amigos';
  }
  if (!path) return;
  $('inv-box').hidden = false;
  var ua = navigator.userAgent;
  var href = /Android/i.test(ua)
    ? 'intent://' + path + '#Intent;scheme=unihealth;package=com.erickgabriel.unihealth;end'
    : 'unihealth://' + path;
  $('inv-open').href = href;
  if (/Android|iPhone|iPad/i.test(ua)) setTimeout(function () { location.href = href; }, 300);
})();`,
});

// 404 simples
page({
  file: '404.html',
  title: 'Página não encontrada · UniHealth',
  description: 'Página não encontrada.',
  body: `<div class="doc"><div class="wrap"><h1>Página não encontrada</h1><p class="updated">O endereço pode ter mudado.</p><p><a class="btn btn-primary" href="/">Voltar ao início</a></p></div></div>`,
});
