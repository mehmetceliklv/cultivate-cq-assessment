import type { Context, Config } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'
import { verifyToken, bearerToken } from './lib/auth.mts'

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const sessionSecret = Netlify.env.get('ADMIN_SESSION_SECRET')
  const databaseUrl = Netlify.env.get('DATABASE_URL')
  if (!sessionSecret || !databaseUrl) {
    return new Response('Server misconfiguration', { status: 500 })
  }

  const token = bearerToken(req)
  if (!verifyToken(token, sessionSecret)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const sql = neon(databaseUrl)
  const rows = await sql`
    SELECT
      id, assessment_type, joined_training, email, submitted_at, age, gender, country, nationality, education,
      professional_affiliation, languages, countries_visited,
      q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
      q11, q12, q13, q14, q15, q16, q17, q18, q19, q20,
      q21, q22, q23, q24, q25,
      part1_score, part2_score, part3_score, part4_score, part5_score, total_score,
      tool_duration, relevant_statements, unclear_wording, interested_events, suggestions
    FROM submissions
    ORDER BY submitted_at DESC NULLS LAST
  `

  return new Response(JSON.stringify({ rows }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: Config = {
  path: '/api/admin-data',
}
