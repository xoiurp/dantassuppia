# Dantas & Suppia Advogados — site institucional

Site estático do escritório, construído em Astro 5 + Tailwind v4 + MDX. Deploy em Netlify.

## Stack
- **Astro 5** (output static + adapter `@astrojs/netlify` para o endpoint `/api/contact`)
- **TypeScript strict**
- **Tailwind CSS v4** via Vite plugin
- **MDX** para artigos do blog
- **Resend** para envio de emails do formulário
- **Cormorant Garamond + Inter** via `@fontsource`
- **@astrojs/sitemap** + `rss.xml`

## Estrutura

```
src/
  components/        Header, Footer, WhatsAppButton, AreaIcon
  content/
    areas/           6 áreas de atuação (.md)
    blog/            12 artigos migrados do site WordPress
  layouts/Layout.astro
  lib/site.ts        Dados de contato e nav
  pages/
    index.astro
    escritorio.astro
    contato.astro
    areas-de-atuacao/{index,[slug]}.astro
    blog/{index,[slug]}.astro
    api/contact.ts   Endpoint Resend (server)
    rss.xml.ts
  styles/global.css  Tokens Tailwind, tipografia prose
public/
  images/{logo,team,blog}
  robots.txt
```

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/ + Netlify function
npm run preview
```

## Variáveis de ambiente

Copie `.env.example` → `.env` e preencha:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=contato@dantasesuppia.com.br
RESEND_TO=adm@dantasesuppia.com.br
```

No painel Netlify, defina as mesmas variáveis em **Site → Environment variables**.

## Deploy Netlify

1. Crie repositório no GitHub e suba este projeto:
   ```bash
   git init && git add . && git commit -m "feat: site Dantas & Suppia"
   gh repo create dantasesuppia --public --source=. --push
   ```
2. No Netlify: **Add new site → Import from Git → GitHub → escolha o repo**.
3. Build settings já definidas em `netlify.toml` — apenas confirme:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Adicione as 3 variáveis de ambiente Resend.
5. **Domain settings** → adicione `dantasesuppia.com.br` e `www.dantasesuppia.com.br`. Atualize DNS:
   - `A` apex → IP do Netlify (Netlify mostra) ou registro `ALIAS/ANAME`.
   - `CNAME www` → `<subdominio>.netlify.app`.
6. HTTPS automático via Let's Encrypt (Netlify gerencia).

## Resend

1. Conta em [resend.com](https://resend.com).
2. Verifique o domínio `dantasesuppia.com.br` (adicione registros SPF/DKIM no DNS).
3. Gere uma API key (escopo `send`) → cole em `RESEND_API_KEY`.
4. `RESEND_FROM` precisa ser endereço dentro de domínio verificado. Sugestão: `contato@dantasesuppia.com.br`.

## Conteúdo

- **Editar áreas:** `src/content/areas/*.md` — frontmatter `title`, `summary`, `icon`, `order`.
- **Novo post:** crie `src/content/blog/slug.md` com frontmatter:
  ```yaml
  ---
  title: "Título"
  description: "Resumo de 1-2 frases."
  pubDate: 2026-04-30
  author: "Ronaldo Dantas"
  category: "Trabalhista"
  cover: "/images/blog/exemplo.webp"
  ---
  ```
- **Imagens novas:** coloque em `public/images/blog/` e referencie como `/images/blog/...`.
- **Dados de contato/nav:** `src/lib/site.ts`.

## Migração SEO

Redirecionamentos 301 dos slugs antigos do WordPress estão em `netlify.toml`. Os 12 posts e as páginas `escritorio` / `areas-de-atuacao` / `contato` já estão mapeados.

## Acessibilidade & SEO
- Lang `pt-BR`, skip-link, alt em todas as imagens
- JSON-LD: `LegalService` na home, `AboutPage`, `ContactPage`, `BlogPosting` por post
- `sitemap-index.xml` + RSS automático
- Headers de segurança (HSTS, X-Frame-Options, Permissions-Policy) via `netlify.toml`

## Próximos passos sugeridos
- Foto profissional do segundo sócio (verificar qualidade de `manuela.webp`)
- Adicionar Decap CMS se a equipe preferir editor visual
- Plausible / GA4 conforme política de privacidade desejada
- LinkedIn da empresa — atualizar URL real em `src/lib/site.ts` (`social.linkedin`)
