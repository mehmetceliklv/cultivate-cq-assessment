import type { Context, Config } from '@netlify/functions'
import { timingSafeEqual } from 'node:crypto'
import { createToken } from './lib/auth.mts'

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const adminEmail = Netlify.env.get('ADMIN_EMAIL')
  const adminPassword = Netlify.env.get('ADMIN_PASSWORD')
  const sessionSecret = Netlify.env.get('ADMIN_SESSION_SECRET')
  if (!adminEmail || !adminPassword || !sessionSecret) {
    return new Response('Server misconfiguration', { status: 500 })
  }

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const emailOk =
    !!body.email && safeEqual(body.email.trim().toLowerCase(), adminEmail.toLowerCase())
  const passwordOk = !!body.password && safeEqual(body.password, adminPassword)

  if (!emailOk || !passwordOk) {
    return new Response(JSON.stringify({ error: 'Incorrect email or password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const token = createToken(sessionSecret)
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: Config = {
  path: '/api/admin-login',
}
