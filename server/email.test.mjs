import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInquiryMailer } from './email.mjs'

const env = {
  SMTP_HOST: 'smtp.example.test',
  SMTP_PORT: '465',
  SMTP_SECURE: 'true',
  SMTP_USER: 'sender@example.test',
  SMTP_PASS: 'test-secret',
  MAIL_FROM: 'sender@example.test',
  INQUIRY_EMAIL_TO: 'brandon.geraldo28@gmail.com',
}
const inquiry = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Pengunjung',
  contact: 'pengunjung@example.test',
  type: 'Produk',
  message: 'Saya ingin menanyakan buku catatan.',
  createdAt: '2026-09-19T00:00:00.000Z',
}

test('SMTP only activates with a sending account and recipient', async () => {
  const mailer = createInquiryMailer({ ...env, SMTP_PASS: '' }, () => {
    throw new Error('A transporter must not be created without credentials')
  })
  assert.equal(mailer.configured, false)
  assert.deepEqual(mailer.invalidFields, ['SMTP_PASS'])
  assert.deepEqual(await mailer.notify(inquiry), { status: 'unconfigured' })
})

test('Gmail app password grouping spaces are removed before authentication', () => {
  let options
  const mailer = createInquiryMailer(
    { ...env, SMTP_HOST: 'smtp.gmail.com', SMTP_PASS: 'aaaa bbbb cccc dddd' },
    (config) => {
      options = config
      return { async sendMail() {} }
    },
  )
  assert.equal(mailer.configured, true)
  assert.equal(options.auth.pass, 'aaaabbbbccccdddd')
})

test('email goes to fixed recipient with visitor address only as Reply-To', async () => {
  let options
  let message
  const mailer = createInquiryMailer(env, (config) => {
    options = config
    return {
      async sendMail(mail) {
        message = mail
        return { accepted: ['brandon.geraldo28@gmail.com'], messageId: 'test-message-id' }
      },
    }
  })
  const delivery = await mailer.notify(inquiry)
  assert.equal(delivery.status, 'sent')
  assert.equal(delivery.messageId, 'test-message-id')
  assert.equal(options.requireTLS, true)
  assert.equal(options.secure, true)
  assert.deepEqual(message.from, { name: 'Sumber Hidup', address: 'sender@example.test' })
  assert.deepEqual(message.to, { address: 'brandon.geraldo28@gmail.com' })
  assert.deepEqual(message.replyTo, { address: 'pengunjung@example.test' })
  assert.match(message.text, /Saya ingin menanyakan buku catatan/)
  assert.match(message.text, /Pengunjung/)
})

test('phone contacts do not become email headers', async () => {
  let message
  const mailer = createInquiryMailer(env, () => ({
    async sendMail(mail) {
      message = mail
      return { accepted: ['brandon.geraldo28@gmail.com'] }
    },
  }))
  await mailer.notify({ ...inquiry, contact: '+6281221097811' })
  assert.equal(message.replyTo, undefined)
  assert.match(message.text, /\+6281221097811/)
})

test('SMTP failure and rejected recipients never claim delivery', async () => {
  const unavailable = createInquiryMailer(env, () => ({
    async sendMail() {
      throw Object.assign(new Error('provider details stay private'), { code: 'EAUTH' })
    },
  }))
  assert.deepEqual((await unavailable.notify(inquiry)).status, 'failed')
  assert.deepEqual((await unavailable.notify(inquiry)).errorCode, 'EAUTH')

  const rejected = createInquiryMailer(env, () => ({
    async sendMail() {
      return { accepted: [], rejected: [env.INQUIRY_EMAIL_TO] }
    },
  }))
  assert.deepEqual((await rejected.notify(inquiry)).errorCode, 'RECIPIENT_REJECTED')
})
