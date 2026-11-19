import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

export function createOutboxCrypto(secret) {
  const key = createHash('sha256').update('rutea-outbox-v1\0').update(secret).digest()
  return {
    seal(value) {
      const iv = randomBytes(12)
      const cipher = createCipheriv('aes-256-gcm', key, iv)
      const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
      return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64')
    },
    open(value) {
      const data = Buffer.from(value, 'base64')
      const decipher = createDecipheriv('aes-256-gcm', key, data.subarray(0, 12))
      decipher.setAuthTag(data.subarray(12, 28))
      return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8')
    },
  }
}
