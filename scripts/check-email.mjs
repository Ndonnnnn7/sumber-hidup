import 'dotenv/config'
import { createInquiryMailer } from '../server/email.mjs'

const mailer = createInquiryMailer()
if (!mailer.configured) {
  console.error(`Lengkapi konfigurasi email di .env: ${mailer.invalidFields.join(', ')}`)
  process.exitCode = 1
} else {
  try {
    await mailer.verify()
    console.log('Koneksi dan autentikasi SMTP berhasil. Tidak ada email yang dikirim.')
    console.log('Penerimaan pesan oleh alamat tujuan perlu diuji melalui formulir kontak.')
  } catch (error) {
    const code = /^[A-Z_]{2,40}$/.test(error?.code || '') ? error.code : 'SMTP_ERROR'
    console.error(
      `Pemeriksaan SMTP gagal (${code}). Periksa pengaturan dan kredensial pengirim di .env.`,
    )
    process.exitCode = 1
  }
}
