# Product Requirements Document (PRD)
## Sumber Hidup — Stationery Products Showcase Website

**Document Version:** 1.0
**Status:** Draft
**Prepared For:** Sumber Hidup
**Document Type:** Product Requirements Document (PRD)

---

## 1. Overview

Sumber Hidup is a stationery business offering writing instruments, notebooks, office supplies, and related paper goods. This PRD defines the requirements for a new company website whose primary purpose is to **showcase Sumber Hidup's product catalog** — including pens, pencils, notebooks, books, and other stationery items — in an organized, visually appealing, and easy-to-browse format.

The website is intended primarily as a **digital catalog and brand storefront**: a place where potential customers, resellers, and institutional buyers (schools, offices) can discover the full range of products, view details such as specifications and variants, and get in touch to inquire or place an order.

> **Assumption:** Based on the request, this PRD treats the website as a **product showcase / catalog site** (not a full e-commerce checkout system with online payment). If Sumber Hidup later wants online cart-and-payment functionality, that would be defined as a Phase 2 extension (see Section 10).

---

## 2. Background & Problem Statement

Currently, Sumber Hidup's product range may only be accessible through physical stores, informal channels (e.g., WhatsApp, social media), or word of mouth. This creates several problems:

- **Limited discoverability**: potential customers cannot easily browse the full product catalog online.
- **Inconsistent brand presentation**: without a central website, product photos, pricing, and descriptions may be scattered or inconsistent across channels.
- **Missed business opportunities**: schools, offices, and bulk buyers looking for a stationery supplier have no professional online reference point to evaluate Sumber Hidup before reaching out.
- **No credibility anchor**: a well-designed website builds trust and legitimacy compared to relying solely on marketplace listings or social media.

A dedicated website solves this by giving Sumber Hidup a **single, professional, always-available digital presence** to display its full range of stationery products.

---

## 3. Goals & Objectives

| Goal | Description |
|---|---|
| **Showcase the catalog** | Present all stationery product categories (writing tools, notebooks/books, office supplies, etc.) in a clear, browsable structure. |
| **Build brand trust** | Communicate Sumber Hidup's identity, values, and quality through consistent visual design and messaging. |
| **Drive inquiries/leads** | Make it easy for visitors to contact the business, request a quote, or ask about bulk/wholesale orders. |
| **Support offline sales** | Serve as a reference catalog that sales staff or resellers can point customers to. |
| **Be easy to maintain** | Allow the Sumber Hidup team to update products, prices, and stock information without needing a developer for every change. |

### Success Metrics (KPIs)
- Number of unique visitors per month.
- Number of product page views per session (indicates browsing depth).
- Number of contact form submissions / WhatsApp click-throughs per month.
- Average session duration (engagement indicator).
- Bounce rate on the homepage and category pages.
- Conversion rate from product view → inquiry/contact.

---

## 4. Target Audience

| Segment | Description | Needs |
|---|---|---|
| **Individual consumers** | Students, parents, professionals looking for stationery for personal or school use. | Easy browsing by category, clear pricing, product photos. |
| **Institutional buyers** | Schools, universities, offices needing bulk stationery supplies. | Bulk order info, wholesale pricing/contact, downloadable catalog (optional). |
| **Resellers / retailers** | Small shops or online sellers who resource stationery from Sumber Hidup. | Product specifications, minimum order quantity, contact for partnership. |
| **General visitors** | People discovering the brand via search or social media. | Quick understanding of what Sumber Hidup sells and how to reach them. |

---

## 5. Scope

### 5.1 In Scope
- A responsive, multi-page marketing/catalog website.
- Product categories and individual product detail pages (informational, not necessarily transactional).
- A search and filter mechanism for products (by category, price range, etc.).
- Company/About page describing Sumber Hidup's story, values, and quality commitment.
- Contact page with contact form, WhatsApp/phone integration, address/map, and business hours.
- Basic content management so the internal team can add/edit/remove products without code changes (e.g., via a lightweight CMS or admin panel).
- SEO-friendly structure (meta titles, descriptions, clean URLs) to help the site rank for stationery-related searches.
- Mobile-first responsive design (many visitors will browse via smartphone).

### 5.2 Out of Scope (Phase 1)
- Online payment / shopping cart / checkout system.
- User account creation and login for customers.
- Real-time inventory/stock synchronization with a physical POS system.
- Multi-language support (unless specified later — default language: Indonesian or English, to be confirmed with stakeholders).
- Advanced analytics dashboards beyond standard web analytics (e.g., Google Analytics).

---

## 6. Functional Requirements

### 6.1 Homepage
- Hero banner introducing the Sumber Hidup brand and its value proposition (e.g., quality, variety, reliability).
- Highlighted/featured product categories (e.g., "Writing Tools," "Notebooks & Books," "Office Supplies").
- Best-selling or new-arrival product highlights.
- Trust-building elements: brief company introduction, years in business, number of products, or customer testimonials if available.
- Clear call-to-action (CTA) buttons: "Browse Products," "Contact Us," or "View Catalog."

### 6.2 Product Catalog / Category Pages
- Grid-based product listing with product image, name, short description, and price (or "Contact for price" if pricing varies).
- Category and sub-category navigation (e.g., Alat Tulis → Pens → Ballpoint, Gel Pen, Mechanical Pencil).
- Filtering and sorting options (by category, price range, popularity, newest).
- Pagination or infinite scroll for large product lists.
- Search bar with keyword-based product search.

### 6.3 Product Detail Page
- High-quality product image(s), ideally with multiple angles or a gallery.
- Full product description: material, size/dimensions, color/variant options, unit of sale (e.g., per pcs, per pack, per box).
- Price display (or wholesale/retail price tiers if applicable).
- "Inquire About This Product" or "Order via WhatsApp" call-to-action.
- Related/similar product suggestions.

### 6.4 About Us Page
- Company history and background of Sumber Hidup.
- Mission, vision, and brand values (e.g., quality, affordability, supporting education).
- Optional: photos of the store, warehouse, or team.

### 6.5 Contact Page
- Contact form (name, email/phone, message).
- Direct links to WhatsApp, phone number, and email.
- Physical store/office address with an embedded map.
- Business hours.
- Optional: links to social media profiles (Instagram, Facebook, TikTok, etc.).

### 6.6 Admin / Content Management
- Simple back-end interface (or CMS such as WordPress, or a custom lightweight admin panel) for the Sumber Hidup team to:
  - Add, edit, and remove products.
  - Update prices and stock availability status ("In Stock" / "Out of Stock").
  - Organize products into categories.
  - Update homepage banners and featured products.

### 6.7 SEO & Performance
- Optimized page titles, meta descriptions, and image alt text for each product.
- Fast page load times (image compression, lazy loading).
- Clean, human-readable URL structure (e.g., `/products/notebooks/spiral-notebook-a5`).

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Pages should load within 2–3 seconds on a standard mobile connection. |
| **Responsiveness** | Fully responsive across mobile (375px), tablet (768px), laptop (1024px), and desktop (1440px) breakpoints. |
| **Accessibility** | Minimum 4.5:1 text contrast ratio in light mode; visible focus states for keyboard navigation; `prefers-reduced-motion` respected. |
| **Browser Support** | Latest versions of Chrome, Safari, Firefox, and Edge. |
| **Security** | HTTPS enforced site-wide; contact form protected against spam (e.g., CAPTCHA or honeypot field). |
| **Scalability** | Product catalog structure should support growth from tens to hundreds of products without redesign. |
| **Maintainability** | Non-technical staff should be able to update product listings without developer involvement. |

---

## 8. Recommended Design System

*(Adapted format, applied to Sumber Hidup's stationery business)*

```
+----------------------------------------------------------------------------------------+
|  TARGET: Sumber Hidup - RECOMMENDED DESIGN SYSTEM                                       |
+----------------------------------------------------------------------------------------+
|                                                                                          |
|  PATTERN: Hero-Centric + Product Catalog Grid                                           |
|     Conversion: Browsing-driven with clear category navigation and trust cues           |
|     CTA: Above fold ("Browse Products"), repeated on category and product pages         |
|     Sections:                                                                           |
|       1. Hero (brand introduction + featured categories)                                |
|       2. Product Categories (Writing Tools, Notebooks & Books, Office Supplies, etc.)   |
|       3. Featured / Best-Selling Products                                               |
|       4. Why Choose Us (quality, variety, reliability, bulk-order friendly)              |
|       5. About / Company Story                                                          |
|       6. Contact & Inquiry                                                              |
|                                                                                          |
|  STYLE: Clean Retail Minimalism with Warm Accents                                       |
|     Keywords: Organized grids, generous whitespace, clear typography hierarchy,          |
|                warm and approachable, trustworthy, creativity-inspiring                  |
|     Best For: Retail catalogs, education-adjacent brands, office/school supply stores   |
|     Performance: cost:low | Accessibility: risk:low; straightforward contrast to verify  |
|                                                                                          |
|  COLORS:                                                                                |
|     Primary:    #2B4C7E (Deep Navy Blue)   — trust, professionalism, "ink" association   |
|     Secondary:  #F4A340 (Warm Mustard/Orange) — creativity, energy, approachability       |
|     CTA:        #E8552E (Vivid Orange-Red)  — high-visibility action buttons             |
|     Background: #FAF7F2 (Warm Paper White) — evokes paper texture, easy on the eyes      |
|     Text:       #2D2D2D (Charcoal Black)   — high-contrast, readable body text            |
|     Notes: Palette evokes stationery materials (paper, ink) while staying modern and     |
|            friendly rather than corporate or cold.                                       |
|                                                                                          |
|  TYPOGRAPHY: Poppins (headings) / Inter (body)                                          |
|     Mood: Friendly, modern, clear, and highly legible at small catalog-listing sizes      |
|     Best For: Retail/e-commerce catalogs, product-dense layouts, mobile-first browsing    |
|     Google Fonts: https://fonts.google.com/specimen/Poppins ,                             |
|                    https://fonts.google.com/specimen/Inter                               |
|                                                                                          |
|  KEY EFFECTS:                                                                            |
|     Subtle card shadows on product tiles + smooth hover elevation on product cards +      |
|     Gentle color transitions on CTA buttons + Skeleton loading states for product grids   |
|                                                                                          |
|  AVOID (Anti-patterns):                                                                  |
|     Overly playful/childish illustrations + Cluttered grids with inconsistent spacing +   |
|     Low-contrast text on colored backgrounds + Generic stock photos of unrelated items    |
|                                                                                          |
|  PRE-DELIVERY CHECKLIST:                                                                 |
|     [ ] No emojis as icons (use SVG: Heroicons/Lucide)                                    |
|     [ ] cursor-pointer on all clickable elements                                          |
|     [ ] Interaction timing follows platform, component, and user preference               |
|     [ ] Light mode: text contrast 4.5:1 minimum                                           |
|     [ ] Focus states visible for keyboard nav                                             |
|     [ ] prefers-reduced-motion respected                                                  |
|     [ ] Product names, prices, and category chips reflow without clipping                 |
|     [ ] Responsive: 375px, 768px, 1024px, 1440px                                          |
|     [ ] Product images maintain consistent aspect ratio across the grid                   |
|     [ ] Category and filter labels remain legible at small mobile widths                  |
|                                                                                          |
+----------------------------------------------------------------------------------------+
```

---

## 9. Information Architecture (Sitemap)

```
Home
├── Products
│   ├── Writing Tools
│   │   ├── Ballpoint Pens
│   │   ├── Gel Pens
│   │   ├── Pencils
│   │   └── Markers & Highlighters
│   ├── Notebooks & Books
│   │   ├── School Notebooks
│   │   ├── Sketchbooks
│   │   └── Planners/Agendas
│   ├── Office Supplies
│   │   ├── Files & Folders
│   │   ├── Staplers & Punches
│   │   └── Adhesives (glue, tape)
│   └── Other Stationery
├── About Us
├── Contact Us
└── (Admin Panel — internal use only)
```

---

## 10. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-01 | Visitor | browse products by category | I can quickly find the type of stationery I need. |
| US-02 | Visitor | search for a specific product by name | I don't have to browse through every category. |
| US-03 | Visitor | view detailed product information (size, material, variants) | I can decide if the product fits my needs before contacting the seller. |
| US-04 | Institutional buyer | find a way to request bulk pricing | I can plan procurement for my school/office. |
| US-05 | Visitor | contact Sumber Hidup easily (WhatsApp/form) | I can ask questions or place an order quickly. |
| US-06 | Admin/staff | add or update a product listing | the catalog stays accurate and up to date. |
| US-07 | Visitor | browse the site comfortably on my phone | I can shop/browse on the go. |

---

## 11. Future Enhancements (Phase 2 Candidates)

- Full e-commerce functionality: shopping cart, online payment gateway (e.g., Midtrans, Xendit), and order tracking.
- Customer accounts with order history.
- Wholesale/reseller portal with tiered pricing.
- Integration with marketplaces (Tokopedia, Shopee) for unified inventory.
- Multi-language support (Indonesian/English toggle).
- Customer reviews and ratings on product pages.
- Downloadable PDF catalog for offline sharing.

---

## 12. Risks & Open Questions

| Item | Type | Notes |
|---|---|---|
| Final product data (names, prices, images, descriptions) not yet provided | Dependency | Needed before content population can begin. |
| Whether pricing should be publicly displayed or "Contact for price" | Open Question | Affects catalog page design and business strategy. |
| Whether online payment is needed in Phase 1 or only Phase 2 | Open Question | Impacts scope and timeline significantly. |
| Primary language of the site (Indonesian, English, or both) | Open Question | Affects content writing and SEO strategy. |
| Hosting/domain ownership and CMS preference | Dependency | Needs to be confirmed with stakeholders before technical setup. |

---

## 13. Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| Product Owner | | | |
| Stakeholder (Sumber Hidup) | | | |
| Designer/Developer | | | |

---

*End of Document*