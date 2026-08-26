import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

export function createToken(secret: string): string {
  const expires = Date.now() + TOKEN_TTL_MS
  const payload = `admin.${expires}`
  const sig = sign(payload, secret)
  return `${payload}.${sig}`
}

export function verifyToken(token: string | null, secret: string): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expiresStr, sig] = parts
  if (role !== 'admin') return false
  const expires = parseInt(expiresStr, 10)
  if (Number.isNaN(expires) || Date.now() > expires) return false

  const expectedSig = sign(`${role}.${expiresStr}`, secret)
  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function bearerToken(req: Request): string | null {
  const header = req.headers.get('authorization') || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}
