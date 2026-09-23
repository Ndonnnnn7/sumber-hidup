import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
const source = process.argv[2]
if (!source) throw new Error('Pass the directory containing the generated originals.')
const files = {
  hero: 'exec-d51e69e5-ff2b-462a-9916-37ea5a8cf05e.png',
  'hero-colorful': 'exec-fb693361-b36d-4ae8-a641-b1da2ecf8461.png',
  planner: 'exec-f14bbae7-dbae-4204-afab-9b4f579c0916.png',
  notebook: 'exec-d7aea12e-3b31-47a6-a0f2-34205dc1f3c4.png',
  pens: 'exec-1c33aa36-99bc-4d12-9337-48b635431803.png',
  organizer: 'exec-8b0bde60-639a-41fb-872d-18dc37553351.png',
  pouch: 'exec-61313d37-2a7b-40c3-b2e8-31cba3652b71.png',
  'planner-cutout': 'exec-c2696aa8-36a9-4a10-9fe7-cd6f80113027.png',
}
await mkdir('public/images', { recursive: true })
for (const [name, filename] of Object.entries(files)) {
  const result = await sharp(path.join(source, filename))
    .resize({ width: name.startsWith('hero') ? 1536 : 900, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(`public/images/${name}.webp`)
  console.log(`${name}.webp: ${Math.round(result.size / 1024)} KB`)
}
