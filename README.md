# Sumber Hidup

A React + TypeScript stationery catalog built from **PRD.Md** and the supplied visual references. The site uses Indonesian copy, a colorful stationery palette, rounded product photography, a large editorial hero, category cards, and a featured planner composition. PRD navy, orange, mustard, and paper white are joined by pink, green, blue, and purple accents across the storefront. Shared colors live in `src/styles.css`; component color treatments live in `src/theme.css`.

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. The command starts both Vite and the Express API on port 3001. Local configuration in `.env` is excluded from Git.

Development uses Supabase when both `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are configured. If either value is missing, it reports a warning and temporarily uses `data/store.json` so the local site remains usable. Production always requires Supabase.

If port 5173 is already in use, open the address printed by Vite (for example, `http://localhost:5174/`). The development and preview proxies preserve that address for contact-form origin checks. Their API target follows `PORT` from the environment or `.env`, defaulting to 3001.

For a fresh checkout, copy `.env.example` to `.env` and configure the Supabase URL and server-only secret key, port, deployment URL, and contact-form email. Keep `.env` private. No customer login is required.

## Pages and working features

| Page                        | Features                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                         | Hero, four featured categories, highlighted product, favorites, popular products, bulk inquiry CTA                                                            |
| `/products`                 | Keyword search, category/subcategory, price and stock filters, sorting, pagination; shareable URL filters                                                     |
| `/products/:category/:slug` | Product information, image gallery and zoom, variants, quantity, stock, related products, product-specific WhatsApp inquiry                                   |
| `/about`                    | Company introduction, mission, values, partnership CTA                                                                                                        |
| `/contact`                  | Validated contact form, server-saved inquiries, optional SMTP email notifications, 

## Project structure

```text
src/                 React + TypeScript pages, components, state and styles
server/index.mjs     Public catalog/contact API, validation and production serving
server/store.mjs     Supabase catalog and inquiry persistence
server/supabase.mjs  Server-only Supabase client
server/email.mjs     SMTP email notifications for contact submissions
server/seed.json     Initial editable sample catalog
api/index.mjs        Vercel Function adapter for Express routes
vercel.json          Vercel build, function and routing configuration
scripts/             Email checks and the one-time Supabase migration
public/images/      Optimized local WebP assets
tests/              Playwright browser and API checks
docs/               PRD mapping and image prompts
```

See [PRD implementation notes](docs/prd-implementation.md) for scope and design decisions. The original PRD has been preserved.
