import type { Context, Config } from '@netlify/functions'
import { createToken } from './lib/auth.mts'

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const adminPassword = Netlify.env.get('ADMIN_PASSWORD')
  const sessionSecret = Netlify.env.get('ADMIN_SESSION_SECRET')
  if (!adminPassword || !sessionSecret) {
    return new Response('Server misconfiguration', { status: 500 })
  }

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!body.password || body.password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Incorrect password' }), {
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
