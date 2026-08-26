import type { Context, Config } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'

interface Demographics {
  email: string
  age: string
  gender: string
  country: string
  nationality: string
  education: string
  professionalAffiliation: string
  languages: string
  countriesVisited: string
  consent: boolean
}

interface Feedback {
  relevantStatements: string
  unclearWording: string
  interestedEvents: string
  suggestions: string
}

interface Payload {
  demographics: Demographics
  answers: Record<string, number>
  feedback: Feedback
  toolDurationSeconds: number
}

function toIntOrNull(v: string | undefined): number | null {
  if (v === undefined || v === null || v.trim() === '') return null
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? null : n
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return `${seconds} seconds`
  return `${minutes} minute${minutes === 1 ? '' : 's'}`
}

const PART_RANGES: [number, number][] = [
  [1, 5],
  [6, 10],
  [11, 15],
  [16, 20],
  [21, 25],
]

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const databaseUrl = Netlify.env.get('DATABASE_URL')
  if (!databaseUrl) {
    return new Response('Server misconfiguration: missing DATABASE_URL', { status: 500 })
  }

  let payload: Payload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { demographics: d, answers, feedback: f, toolDurationSeconds } = payload

  if (!d || !d.email || !d.consent) {
    return new Response('Missing required demographic fields or consent', { status: 400 })
  }
  for (let i = 1; i <= 25; i++) {
    if (typeof answers[i] !== 'number') {
      return new Response(`Missing answer for question ${i}`, { status: 400 })
    }
  }

  const partScores = PART_RANGES.map(([start, end]) => {
    let sum = 0
    for (let i = start; i <= end; i++) sum += answers[i] ?? 0
    return sum
  })
  const totalScore = partScores.reduce((a, b) => a + b, 0)

  const sql = neon(databaseUrl)

  try {
    await sql`
      INSERT INTO submissions (
        email, age, gender, country, nationality, education,
        professional_affiliation, languages, countries_visited,
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
        q11, q12, q13, q14, q15, q16, q17, q18, q19, q20,
        q21, q22, q23, q24, q25,
        part1_score, part2_score, part3_score, part4_score, part5_score, total_score,
        tool_duration, relevant_statements, unclear_wording, interested_events, suggestions,
        consent
      ) VALUES (
        ${d.email}, ${toIntOrNull(d.age)}, ${d.gender}, ${d.country}, ${d.nationality}, ${d.education},
        ${d.professionalAffiliation || null}, ${d.languages}, ${toIntOrNull(d.countriesVisited)},
        ${answers[1]}, ${answers[2]}, ${answers[3]}, ${answers[4]}, ${answers[5]},
        ${answers[6]}, ${answers[7]}, ${answers[8]}, ${answers[9]}, ${answers[10]},
        ${answers[11]}, ${answers[12]}, ${answers[13]}, ${answers[14]}, ${answers[15]},
        ${answers[16]}, ${answers[17]}, ${answers[18]}, ${answers[19]}, ${answers[20]},
        ${answers[21]}, ${answers[22]}, ${answers[23]}, ${answers[24]}, ${answers[25]},
        ${partScores[0]}, ${partScores[1]}, ${partScores[2]}, ${partScores[3]}, ${partScores[4]}, ${totalScore},
        ${formatDuration(toolDurationSeconds)}, ${f?.relevantStatements || null}, ${f?.unclearWording || null},
        ${f?.interestedEvents || null}, ${f?.suggestions || null},
        ${d.consent}
      )
    `
  } catch (err) {
    console.error('Insert failed', err)
    return new Response('Failed to save submission', { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: Config = {
  path: '/api/submit',
}
