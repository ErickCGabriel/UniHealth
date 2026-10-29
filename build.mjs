// Gera as páginas do site (unihealthapp.com.br) com o mesmo topo e rodapé.
// A Política de Privacidade e os Termos vêm do texto do app (../unihealth/src/data/legal.json),
// para o site e o app dizerem sempre a mesma coisa.
// Uso: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const legal = JSON.parse(readFileSync(new URL('../unihealth/src/data/legal.json', import.meta.url), 'utf8'));
const EMAIL = legal.email;
const SITE = 'https://unihealthapp.com.br';
// Versão atual do app (aparece girada no canto do topo da página inicial).
const VERSION = JSON.parse(readFileSync(new URL('../unihealth/app.json', import.meta.url), 'utf8')).expo.version.replace(/\.0$/, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fill = (s) => esc(s.replaceAll('{{controller}}', legal.controller).replaceAll('{{email}}', legal.email));


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
<meta name="theme-color" content="#e8e8e5">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE}/assets/icon.png">
<meta property="og:url" content="${SITE}/${file === 'index.html' ? '' : file}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,700..900&family=JetBrains+Mono:wght@500&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
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
    <span>© 2026 ${esc(legal.controller)} · UniHealth ${VERSION}</span>
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
// Visual editorial (29/10): "uni." gigante, o app num celular sobre o bloco de cor, texto na vertical e a versão girada.
const shot = (name, alt, lazy = true) =>
  `<div class="phone"><img src="/assets/app/${name}.png" alt="${alt}" width="390" height="844"${lazy ? ' loading="lazy"' : ''}></div>`;
const tela = (name, title, text, alt) => `<figure class="tela">${shot(name, alt)}<h3>${title}</h3><p>${text}</p></figure>`;
const recurso = (title, text) => `<li><h3>${title}</h3><p>${text}</p></li>`;
const QUERO = `mailto:${EMAIL}?subject=Quero%20testar%20o%20UniHealth`;

page({
  file: 'index.html',
  title: 'UniHealth: Treino e Saúde',
  description: 'Treino, alimentação, água e sono num só app, com metas feitas para o seu corpo e desafios com os amigos. Do zero ao avançado.',
  current: '/',
  body: `
<div class="hero">
  <div class="wrap">
    <div class="hero-text">
      <h1><span class="mark" aria-hidden="true">uni.</span><span class="sr">UniHealth: treino, alimentação, água e sono num só app</span></h1>
      <div class="hero-cols mono">
        <p><b>Treino e prato</b>Programas de 8 semanas, cargas, descanso e calorias da refeição por foto.</p>
        <p><b>Água e sono</b>Metas calculadas para o seu corpo, no mesmo quadro do dia.</p>
      </div>
      <p class="lead">Para quem nunca treinou e para quem treina todo dia. O UniHealth monta as metas e mostra o dia inteiro num lugar só.</p>
      <div class="cta">
        <a class="btn" href="${QUERO}">Quero testar</a>
      </div>
      <p class="note">Em teste no Android (Google Play) e no iPhone (TestFlight).</p>
    </div>
    <div class="hero-art">
      <div class="bloco" aria-hidden="true"></div>
      ${shot('hoje', 'Tela Hoje do UniHealth: treinos da semana, botões Treinar e Refeição', false)}
      <a class="seta" href="#dia" aria-label="Ver o app por dentro"><span aria-hidden="true">↓</span></a>
      <p class="vertical" aria-hidden="true">Escolha o shape.<br>A gente monta o caminho.</p>
    </div>
    <p class="versao" aria-label="Versão ${VERSION}">${VERSION}<small>versão</small></p>
  </div>
</div>

<section class="dia" id="dia">
  <p class="fantasma" aria-hidden="true">SEU DIA</p>
  <div class="wrap">
    <h2 class="titulo">O dia inteiro<br>num lugar só</h2>
    <p class="intro">Abra o app e veja o que falta: o treino da semana, as calorias que restam, a água e como você dormiu.</p>
    <div class="telas">
      ${tela('treinos', 'Treinos', 'Rotinas suas, treino livre e programas prontos.', 'Tela Treinos: iniciar treino vazio, nova rotina e rotinas salvas')}
      ${tela('prato', 'Prato', 'Anel das calorias e macros. Fotografe o prato.', 'Tela Prato: calorias restantes num anel, proteína, carbo e gordura')}
      ${tela('sono', 'Sono', 'A noite em destaque e a média da semana.', 'Tela Sono: 8 horas na última noite e barras dos últimos 7 dias')}
      ${tela('atividade', 'Passos e cardio', 'Passos do relógio e cardio entram no gasto do dia.', 'Tela Passos e cardio: 6.900 passos de 8.000')}
    </div>
  </div>
</section>

<section class="recursos" id="recursos">
  <div class="wrap">
    <div class="cabeca">
      <h2 class="titulo">Tudo que<br>ajuda no hábito</h2>
      <p>Sem planilha e sem cinco apps diferentes. O UniHealth calcula as suas metas e lembra você na hora certa.</p>
    </div>
    <ul class="lista">
      ${recurso('Treinos que se adaptam', 'Programas de 8 semanas pelo seu objetivo, experiência e dias livres. Cargas, descanso cronometrado e recordes.')}
      ${recurso('Cardio também conta', 'Corrida do zero aos 10 km, pedal, caminhada e natação. Meta de 150 minutos por semana, como recomenda a OMS.')}
      ${recurso('Prato por foto', 'Fotografe a refeição e receba uma estimativa de calorias e macros por IA, com os valores da tabela TACO.')}
      ${recurso('Água e lembretes', 'Meta de água pelo seu peso e lembretes de água, treino, refeições e pesagem no horário que você escolher.')}
      ${recurso('Sono e recuperação', 'Registre a noite ou traga do relógio, com as fases do sono, para saber quando ir com tudo.')}
      ${recurso('Ciclo menstrual', 'Metas ajustadas em cada fase. Opcional e só para quem quiser.')}
      ${recurso('Amigos e grupos', 'Desafios de dias treinados, passos, cardio ou Uni Pontos, com pódio, reações e cutucadas.')}
      ${recurso('900+ exercícios', 'Biblioteca com fotos do movimento, separada por músculo, para montar o treino do seu jeito.')}
    </ul>
  </div>
</section>

<section class="poster">
  <div class="wrap">
    <div class="palco">
      <p class="letras" aria-hidden="true"><span>Sha</span><span>pe.</span></p>
      ${shot('hoje-claro', 'Tela Hoje do UniHealth no tema claro')}
    </div>
    <div class="publico">
      <p class="eyebrow">Para quem é</p>
      <h2 class="titulo">Escolha o shape.<br>A gente monta o caminho.</h2>
      <dl>
        <dt>Nunca treinou?</dt><dd>Primeiros Passos: duas sessões de 20 minutos por semana, em casa, sem equipamento.</dd>
        <dt>Ama academia?</dt><dd>Programas de até 6 dias, sugestão de aumento de carga e o histórico de cada exercício.</dd>
        <dt>Prefere cardio?</dt><dd>Corrida, pedal, natação e caminhada entram direto na meta da semana.</dd>
        <dt>Tem 50 anos ou mais?</dt><dd>Vida Ativa 50+: força, equilíbrio e mobilidade, adaptados às limitações que você informar.</dd>
      </dl>
    </div>
  </div>
</section>

<section class="dados">
  <div class="wrap">
    <div>
      <p class="eyebrow">Privacidade</p>
      <h2 class="mark">seus<br>dados.</h2>
    </div>
    <ul>
      <li>Funciona sem conta: os dados ficam só no seu celular.</li>
      <li>Com conta, backup na nuvem e acesso em qualquer aparelho.</li>
      <li>Sem anúncios e sem venda de dados.</li>
      <li>Na parte social, só o resumo que você permitir. Peso, refeições e saúde nunca são compartilhados.</li>
      <li>Excluir a conta apaga tudo da nuvem na hora, pelo próprio app.</li>
    </ul>
  </div>
  <div class="wrap rodape-bloco">
    <a class="seta" href="/privacidade.html" aria-label="Ler a Política de Privacidade"><span aria-hidden="true">↓</span></a>
  </div>
</section>

<section class="final">
  <div class="wrap">
    <h2 class="titulo">Bora<br>treinar.</h2>
    <div class="aside">
      <p>O UniHealth está em teste no Android e no iPhone. Escreva para entrar no grupo de testes.</p>
      <div class="cta">
        <a class="btn btn-sinal" href="${QUERO}">Quero testar</a>
        <a class="btn btn-ghost" href="/suporte.html">Dúvidas</a>
      </div>
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
      <p>Dentro do app: <strong>Perfil → Configurações → Ajuda → Enviar feedback</strong> (dá para anexar print).<br>Por e-mail: <a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>

    <h2>Dúvidas frequentes</h2>
    ${faq('Preciso criar uma conta?', ['Não. O UniHealth funciona sem conta e os dados ficam só no seu celular. Com conta, você ganha backup na nuvem, acesso em outros aparelhos, a análise de fotos por IA e a parte social.'])}
    ${faq('Posso entrar com @usuário em vez do e-mail?', ['Sim. Na tela de entrar, digite seu e-mail ou seu @usuário e a senha. Também dá para entrar com o Google e, no iPhone, com a Apple.'])}
    ${faq('Troquei de celular. Como recupero meus dados?', ['Instale o app no celular novo e entre com a mesma conta (Perfil → Configurações → Conta e backup). Treinos, refeições, sono e fotos voltam sozinhos.'])}
    ${faq('O app lê os dados do meu relógio?', ['Sim. Em Treinos → Cardio e passos, conecte o Health Connect (Android) ou o Apple Saúde (iPhone, da versão 0.16 em diante) para trazer passos, sono, batimentos e exercícios. O app só lê esses dados.'])}
    ${faq('A análise do prato por foto é exata?', ['É uma estimativa feita por inteligência artificial e pode errar. Confira e ajuste os valores antes de salvar. Ela precisa de conta e tem um limite diário de análises.'])}
    ${faq('Os outros veem meu peso ou o que eu como?', ['Não. Na parte social, que é opcional, só aparece o resumo que você permitir: se treinou, passos, minutos de cardio e Uni Pontos. Peso, refeições, sono, ciclo e batimentos nunca são compartilhados.'])}
    ${faq('Os lembretes não chegam. O que faço?', ['Confira se as notificações do UniHealth estão permitidas nos ajustes do celular. No Android 12 ou mais novo, ligue também "Alarmes e lembretes" para o app (Perfil → Configurações → Lembretes mostra o atalho).'])}
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
      <li>Vá em <strong>Perfil → Configurações → Conta e backup</strong>.</li>
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
// /convite?g=CODIGO -> entrar no grupo   |   /convite?u=usuario -> adicionar amigo   |   /convite?t=CODIGO -> treino compartilhado
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
  var tr = (q.get('t') || '').trim().toUpperCase();
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
  } else if (/^[A-Z0-9]{8}$/.test(tr)) {
    path = 'rotina/recebida/' + tr;
    $('inv-kind').textContent = 'Treino compartilhado';
    $('inv-title').textContent = 'Te mandaram um treino';
    $('inv-text').textContent = 'Toque no botão para ver o treino no UniHealth e salvar nas suas rotinas.';
    $('inv-label').textContent = 'Código do treino';
    $('inv-code').textContent = tr;
    $('inv-hint').textContent = '';
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
