import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

async function replaceFile(source, destination) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await rename(source, destination)
      return
    } catch (error) {
      if (!['EACCES', 'EPERM'].includes(error.code) || attempt === 4) throw error
      await delay(25 * (attempt + 1))
    }
  }
}

// Development fallback and browser tests use a file store; production always uses Supabase.
export async function createFileStore(root, dataDirectory) {
  const dataDir = path.resolve(root, dataDirectory)
  await mkdir(dataDir, { recursive: true })
  const storePath = path.join(dataDir, 'store.json')
  let data

  try {
    data = JSON.parse(await readFile(storePath, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    data = {
      ...JSON.parse(await readFile(path.join(root, 'server/seed.json'), 'utf8')),
      inquiries: [],
    }
    await writeFile(storePath, JSON.stringify(data, null, 2))
  }

  let writes = Promise.resolve()
  function mutate(fn) {
    const operation = writes.then(async () => {
      const next = structuredClone(data)
      fn(next)
      await writeFile(`${storePath}.tmp`, JSON.stringify(next, null, 2))
      await replaceFile(`${storePath}.tmp`, storePath)
      data = next
    })
    writes = operation.catch(() => {})
    return operation
  }

  return {
    async getCatalog() {
      return {
        products: data.products,
        categories: data.categories,
        settings: data.settings,
      }
    },
    async insertInquiry(inquiry) {
      await mutate((next) => next.inquiries.unshift(inquiry))
    },
    async updateInquiryDelivery(id, delivery) {
      await mutate((next) => {
        const inquiry = next.inquiries.find((item) => item.id === id)
        if (!inquiry) throw new Error('Test inquiry not found.')
        inquiry.emailDelivery = delivery
      })
    },
  }
}
