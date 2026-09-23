# Generated image assets

All images were created using the **built-in image-generation tool**, then optimized to WebP using Sharp. Original generated files remain in the local Codex generated-images directory. Runtime assets are stored in this repository; the site has no dependency on that directory.

| Saved asset                         | Use                                                |
| ----------------------------------- | -------------------------------------------------- |
| `public/images/hero.webp`           | Home hero and company page                         |
| `public/images/planner.webp`        | Planner category, cards and detail pages           |
| `public/images/planner-cutout.webp` | Transparent planner in the homepage feature banner |
| `public/images/notebook.webp`       | Sage notebook                                      |
| `public/images/pens.webp`           | Natural stationery set                             |
| `public/images/organizer.webp`      | Taupe desk organizer                               |
| `public/images/pouch.webp`          | Canvas pencil case                                 |

## Hero prompt

The original warm hero remains available as `/images/hero.webp`. The active homepage uses the colorful hero documented below.

Use case: photorealistic-natural. Asset type: full bleed wide website hero photograph for a refined Indonesian stationery brand. Create a photorealistic editorial lifestyle photograph, landscape aspect ratio 3:2. A warm off-white and pale beige desk, viewed from a high 45 degree camera angle. On the RIGHT HALF of the composition, a person's naturally proportioned hands in an oatmeal knit sweater write with an ivory pen in an open beige spiral weekly planner, hands enter from right edge, notebook lower right. A handmade cream ceramic cup of coffee near the upper center-right, tiny shallow beige ceramic bowl with a few gold paperclips nearby. Minimal light beige books at top right. LEFT 48% of the photograph is mostly empty softly lit pale cream desktop, generous clean negative space for dark website heading added separately. Warm natural window light, soft realistic shadows, tactile paper and linen texture, quiet understated Scandinavian stationery campaign, high-end real product photography. Calm warm neutrals only: cream, sand, tan. NO overlaid text, NO lettering, NO website elements, NO graphics, NO watermark.

## Product prompts

Each prompt combines this prefix, one subject, and the common suffix:

**Prefix:** Use case: product-mockup. Asset type: square stationery catalog product photography.

**Planner subject:** A closed premium warm ivory linen hardcover spiral planner with gold metal wire binding down the left side and a taupe elastic band near the right side, small elegant gold words on its cover reading 'PLAN / FOCUS / GROW' on three lines. Full notebook visible upright, viewed from slightly above. A cream pen rests diagonally beside it.

**Notebook subject:** A single sage green soft leather A5 notebook, closed, with rounded corners and a little leather strap with a brushed brass snap closure on the right. Full object centered and upright in frame, viewed from a gentle elevated three-quarter angle.

**Pens subject:** A warm ivory ceramic cylindrical pencil pot containing six minimal cream, beige and wood ballpoint pens and pencils, one darker tan pencil. Full pot and pencils visible, centered with generous margins.

**Organizer subject:** An elegant small warm taupe desk organizer tray, softly rounded square form, several compartments holding a few gold binder clips, ivory sticky notes, a cream tape roll. Full object visible, elevated three-quarter angle, center composition.

**Pouch subject:** A minimal sand beige canvas stationery pencil pouch with two gold zippers, rounded edges, small cotton pull tab, no text. Full object visible centered at an elevated three-quarter angle.

**Suffix:** Seamless warm very pale off-white beige background #f1eeea, product occupies 72% of the square image, premium photorealistic studio product photography, accurate tactile material detail, large soft diffuse natural daylight from top left, delicate shadow cast to bottom right, calm minimal Japanese stationery campaign aesthetic, no extra objects, no graphics, no watermark. Square 1:1 composition.

## Planner cutout edit prompt

Input: the generated planner image, inspected before editing.

Use case: background-extraction. Edit target: the provided planner and pen product photograph. Remove ONLY the off-white background and desk surface, creating an actual transparent alpha background around the notebook and the pen, and through the open gaps in the gold spiral rings. Keep the full ivory linen planner and matching cream pen exactly as shown, preserve all product proportions, textures, gold spiral binding, taupe elastic band, and the text PLAN FOCUS GROW. Preserve a subtle naturally fading soft contact shadow beneath the product with semitransparent alpha. Keep both objects fully in frame. The planner surface must be fully opaque. Transparent PNG product cutout, no replacement background, no checkerboard pattern baked into image, no extra objects or edits.

Sharp optimization preserves the cutout alpha channel. `scripts/prepare-images.mjs` records the original-to-deliverable mapping and can recreate the WebP outputs when supplied the local directory containing those originals. Committed WebP assets are sufficient to run or deploy the website.

## Colorful stationery hero

- Tool: built-in image generation, new photograph based on the user's colorful stationery direction.
- Original: `C:/Users/Victus/.codex/generated_images/01a0b470-2fef-7082-89cc-44f5818d3e19/exec-fb693361-b36d-4ae8-a641-b1da2ecf8461.png`.
- Delivered asset: `public/images/hero-colorful.webp`, 1536 × 1024, approximately 132 KB, WebP quality 84.
- Used by the homepage and About page through the editable `heroImage` setting. The previous hero asset is retained.

Exact generation prompt:

Use case: photorealistic-natural. Asset type: wide homepage hero photograph for Sumber Hidup, an Indonesian stationery catalog. Primary request: a bright, colorful, realistic stationery flat lay inspired by school and office supplies arranged around a white painted wood desk. Landscape 3:2 composition, overhead camera. Keep the LEFT 48% and CENTER-LEFT as beautifully clean almost-white desk with subtle horizontal white wood grain and generous empty space for website text. The RIGHT HALF contains a carefully styled rich arrangement: a cobalt blue A5 notebook partly under a coral-red notebook, a sunny yellow notebook behind, a small fanned collection of sharpened red, orange, yellow, emerald green, sky blue and violet colored pencils, pink-handled scissors, a clear aqua triangular ruler, emerald green paperclips, a yellow sharpener, a blue ballpoint pen, two bright pink and orange highlighters and a small stack of pastel sticky notes. Items spread naturally with clear visual hierarchy, some enter from the top right and bottom right edges. A few small colored binder clips near the top edge but avoid objects in the left text area. Make the colors vivid and diverse with equal emphasis on blue, pink, green, orange and yellow, not predominantly beige, one color or rainbow gradients. Soft bright natural daylight, gentle realistic shadows, premium editorial product photography, friendly and inviting but professional, credible real materials, subtle texture. White desk occupies more than half the image. No people, no words, no branding, no text, no watermark, no UI.
