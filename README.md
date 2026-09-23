# Sumber Hidup

A React + TypeScript stationery catalog built from **PRD.Md** and the supplied visual references. The site uses Indonesian copy, a colorful stationery palette, rounded product photography, a large editorial hero, category cards, and a featured planner composition. PRD navy, orange, mustard, and paper white are joined by pink, green, blue, and purple accents across the storefront. Shared colors live in `src/styles.css`; component color treatments live in `src/theme.css`.

The admin interface and its API have been removed at the client's request. Content is stored in Supabase and maintained through its dashboard; the rest of the public catalog follows the PRD.


Requires Node.js 20.20+ and npm.

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
| `/contact`                  | Validated contact form, server-saved inquiries, optional SMTP email notifications, WhatsApp and phone links; conditional public email, address, map and hours |

WhatsApp is connected to the number provided: **+62 812-2109-7811**. Saved favorites live on the visitor's device and can be combined into one WhatsApp inquiry. There is no shopping cart, checkout, payment handling, or customer login, consistent with Phase 1 of the PRD.

Any visitor can enter an email address, including Gmail, and submit the form without a Google login. The form saves each message in the private Supabase `inquiries` table. When SMTP is configured, the server sends an email notification to `INQUIRY_EMAIL_TO`; the visitor's email is used as Reply-To, never as the authenticated sender. A typed address does not prove the visitor owns it. The `email_delivery.status` field records `sent`, `failed`, or `unconfigured`; `sent` means the SMTP server accepted the message, not that it reached the inbox. If email cannot be sent, the page explains this and offers WhatsApp. Clicking a WhatsApp link opens a draft that the visitor chooses to send.


`INQUIRY_EMAIL_TO` is the recipient. An SMTP **sender** is also required; an email address alone cannot send messages. For a Gmail sender, fill these values in `.env` on the server:

```dotenv
INQUIRY_EMAIL_TO=tokosumberhidup12@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-sending-account@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=your-sending-account@gmail.com
```

`SMTP_USER` and `MAIL_FROM` should normally be the same address. The sender may also be the recipient if the account owner chooses to use it that way. For Gmail, enable two-step verification and create an [App Password](https://support.google.com/accounts/answer/185833) for `SMTP_PASS`; use that instead of the regular Google password. If using another SMTP provider, use its host, port, security mode, credentials, and authorized sender. Never put the password in `.env.example`, the browser code, or a public repository.

Restart the server after changing `.env`, then run `npm run email:check`. This checks the SMTP connection and authentication without sending a message. Finally, submit the contact form once with a real email address and check the recipient inbox and spam folder. The success page reports whether SMTP accepted the notification. Test data stored in `.playwright-data/` is separate and never sends real email.
Keep each SMTP key on a single line in `.env`. The Gmail App Password can be pasted with its display spaces; the server removes those spaces for Gmail SMTP. The server reads `.env` when it starts, so changing the file alone does not activate the new account. Messages saved while email was not configured are not sent again automatically; submit a new test message after restarting.


The `site_content` table contains one row with `id = 1`. Edit its `products`, `categories`, and `settings` JSON columns through the Supabase Table Editor. Keep product IDs and slugs unique and preserve category/subcategory references. The `inquiries` table is private contact data and must not be exposed with a public RLS policy.

To migrate an existing local `data/store.json` after creating the Supabase tables and filling `SUPABASE_URL` and `SUPABASE_SECRET_KEY`, run:

```sh
npm run db:migrate
```

The migration inserts the catalog and imports messages without deleting the source file. It can safely be rerun when the remote content is unchanged. If `site_content` already contains different data, the script stops; review the difference first, then use `npm run db:migrate -- --force` only when the local catalog should replace the remote catalog. Existing remote messages with the same ID are never overwritten.

Product photography can use a hosted HTTPS image URL or a file placed in `public/images/`. Additional image URLs enable the detail-page gallery. Rebuild after adding local images so they are included in `dist/`.

Initial sample catalog data lives in `server/seed.json`, while the running application reads from Supabase. Keep the seed in sync when the public fallback catalog should change; the seed must contain only public catalog data, never inquiries. `data/store.json` is retained only as the local migration source and backup.
## Content still needed before publishing

- The nine seeded products, prices, specifications, and images are **sample content**, not verified Sumber Hidup inventory. Replace or confirm them in the catalog data files.
- Product photos were created with the built-in image-generation tool and are illustrative. Optimized deliverables are in `public/images/`; [the prompt set](docs/image-prompts.md) records their creation.
- The notification recipient has been supplied, but the public store email, SMTP sender credentials, address, opening hours, company history, domain, and hosting were not supplied. The site does not invent them. Until entered, visitors can ask for location and opening hours through the supplied WhatsApp number.

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
