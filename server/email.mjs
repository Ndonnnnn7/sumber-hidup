import nodemailer from 'nodemailer'
import { z } from 'zod'

const smtpSchema = z.object({
  SMTP_HOST: z.string().trim().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_SECURE: z.enum(['true', 'false']),
  SMTP_USER: z.string().trim().min(1),
  SMTP_PASS: z.string().min(1),
  MAIL_FROM: z.email(),
  INQUIRY_EMAIL_TO: z.email(),
})

export function createInquiryMailer(
  env = process.env,
  createTransport = nodemailer.createTransport,
) {
  const port = env.SMTP_PORT || '587'
  // Google displays app passwords in groups; SMTP authentication needs the joined value.
  const password =
    env.SMTP_HOST?.trim().toLowerCase() === 'smtp.gmail.com'
      ? env.SMTP_PASS?.replace(/\s+/g, '')
      : env.SMTP_PASS
  const parsed = smtpSchema.safeParse({
    SMTP_HOST: env.SMTP_HOST,
    SMTP_PORT: port,
    SMTP_SECURE: env.SMTP_SECURE || (port === '465' ? 'true' : 'false'),
    SMTP_USER: env.SMTP_USER,
    SMTP_PASS: password,
    MAIL_FROM: env.MAIL_FROM?.trim(),
    INQUIRY_EMAIL_TO: env.INQUIRY_EMAIL_TO?.trim(),
  })
  if (!parsed.success) {
    return {
      configured: false,
      invalidFields: [...new Set(parsed.error.issues.map((issue) => issue.path[0]))],
      async notify() {
        return { status: 'unconfigured' }
      },
    }
  }

  const config = parsed.data
  const transport = createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE === 'true',
    requireTLS: true,
    auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true,
  })

  return {
    configured: true,
    invalidFields: [],
    verify: () => transport.verify(),
    async notify(inquiry) {
      const attemptedAt = new Date().toISOString()
      try {
        const info = await transport.sendMail({
          from: { name: 'Sumber Hidup', address: config.MAIL_FROM },
          to: { address: config.INQUIRY_EMAIL_TO },
          // Visitors can supply a reply address, never the sender or recipient.
          ...(z.email().safeParse(inquiry.contact).success
            ? { replyTo: { address: inquiry.contact } }
            : {}),
          subject: `[Sumber Hidup] ${inquiry.type} (${inquiry.id.slice(0, 8)})`,
          messageId: `<inquiry-${inquiry.id}@${config.MAIL_FROM.split('@')[1]}>`,
          text: [
            'Pesan baru dari formulir kontak Sumber Hidup',
            '',
            `Nama: ${inquiry.name}`,
            `Kontak: ${inquiry.contact}`,
            `Topik: ${inquiry.type}`,
            `Waktu (UTC): ${inquiry.createdAt}`,
            `Referensi: ${inquiry.id}`,
            '',
            'Pesan:',
            inquiry.message,
          ].join('\n'),
        })
        const accepted = info.accepted?.some(
          (address) =>
            typeof address === 'string' &&
            address.toLowerCase() === config.INQUIRY_EMAIL_TO.toLowerCase(),
        )
        if (!accepted) return { status: 'failed', attemptedAt, errorCode: 'RECIPIENT_REJECTED' }
        return { status: 'sent', attemptedAt, messageId: info.messageId }
      } catch (error) {
        // Keep provider responses, message contents, and credentials out of logs/API responses.
        const errorCode = /^[A-Z_]{2,40}$/.test(error?.code || '') ? error.code : 'SMTP_ERROR'
        return { status: 'failed', attemptedAt, errorCode }
      }
    },
  }
}
