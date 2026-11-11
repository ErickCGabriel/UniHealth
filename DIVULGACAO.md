# Site: links de divulgação e medição

Mudanças de 11/11/2026 (briefing de marketing). **Ainda não publicadas:** esperam a aprovação do Erick.

## Links para usar (cada lugar com o seu)
| Onde | Link |
|---|---|
| Bio do Instagram | https://unihealthapp.com.br/?utm_source=instagram&utm_medium=bio |
| Story ou direct do Instagram | https://unihealthapp.com.br/?utm_source=instagram&utm_medium=story |
| TikTok | https://unihealthapp.com.br/?utm_source=tiktok&utm_medium=bio |
| Personal trainer (troque `nome`) | https://unihealthapp.com.br/?utm_source=personal&utm_campaign=nome |
| Grupo de academia (troque `nome`) | https://unihealthapp.com.br/?utm_source=grupo&utm_campaign=nome |
| Indicação de amigo | https://unihealthapp.com.br/?utm_source=indicacao |

**Título B:** acrescente `&t=b` ao link (por exemplo, `...?utm_source=instagram&utm_medium=bio&t=b`). Sem o `t`, aparece o título A ("Comece por hoje."). Para comparar, use um link para cada versão em lugares parecidos por 2 a 3 semanas.

## O que é medido
Tudo fica no nosso Supabase. Não há cookies nem ferramenta de terceiros, e não se guarda IP nem identificador da pessoa.
- **Visita:** uma por sessão do navegador.
- **Cliques:** em "Quero testar no Android" e em "Baixar na App Store".
- **Cadastro enviado:** e-mail, Android ou iPhone, aceite, origem e título.
- **Na App Store:** o link leva `ct=<origem>`, que aparece no App Store Connect, em Análises → Fontes (campanhas).

Para contar, no painel do Supabase (SQL):
```sql
select * from public.site_funnel;                       -- visitas, cliques e cadastros por origem e título
select * from public.site_signups order by created_at;  -- quem pediu o teste
update public.site_signups set invited_at = now() where email = '...';  -- marcar quem já recebeu o convite
```

## Para publicar (depois da aprovação)
1. Aplicar a migração `unihealth/supabase/migrations/20261111000000_site_signups.sql`.
2. Acrescentar o parágrafo do site à Política de Privacidade (`legal.json`), aprovado pelo Erick e pelo advogado.
3. `node build.mjs`, commit e push.

## Esperando aprovação do Erick (e do jurídico, onde indicado)
1. **Textos da seção "Seus dados" (jurídico):**
   - "Com conta, backup na nuvem e acesso em qualquer aparelho. A foto do prato é enviada para análise por IA."
   - "Sem venda de dados." (saiu "Sem anúncios", que deixa de valer na 1.2)
   - "Peso e saúde nunca são compartilhados; refeições, só as que você escolher mostrar num grupo."
   - "Excluir a conta pelo próprio app apaga seus dados da nuvem." (saiu "tudo" e "na hora")
2. **Prazo do convite:** a confirmação diz "Em até 2 dias úteis você recebe no e-mail o convite do teste da Google Play".
3. **Parágrafo proposto para a Política de Privacidade (jurídico):**
   > **Site.** No site unihealthapp.com.br contamos visitas e cliques de forma agregada (de onde a pessoa veio, como Instagram ou TikTok, e qual versão da página viu), sem cookies e sem guardar IP ou identificador. Se você pedir para testar o app, guardamos o e-mail e o tipo de celular informados, só para mandar o convite do teste, até você pedir para apagar ou até 12 meses depois do pedido. Os dados ficam no Supabase, em São Paulo.
