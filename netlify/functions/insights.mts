import type { Context, Config } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'

export default async (_req: Request, _context: Context) => {
  const databaseUrl = Netlify.env.get('DATABASE_URL')
  if (!databaseUrl) {
    return new Response('Server misconfiguration', { status: 500 })
  }
  const sql = neon(databaseUrl)

  const [
    totals,
    byGender,
    byAgeBand,
    byCountry,
    byNationality,
    byEducation,
  ] = await Promise.all([
    sql`
      SELECT
        count(*)::int AS n,
        round(avg(total_score))::int AS avg_total,
        round(avg(part1_score))::int AS avg_part1,
        round(avg(part2_score))::int AS avg_part2,
        round(avg(part3_score))::int AS avg_part3,
        round(avg(part4_score))::int AS avg_part4,
        round(avg(part5_score))::int AS avg_part5
      FROM submissions
    `,
    sql`
      SELECT
        nullif(initcap(trim(gender)), '') AS label,
        count(*)::int AS n,
        round(avg(total_score))::int AS avg_total
      FROM submissions
      GROUP BY 1
      ORDER BY n DESC
    `,
    sql`
      SELECT
        CASE
          WHEN age IS NULL THEN 'Unknown'
          WHEN age < 20 THEN 'Under 20'
          WHEN age BETWEEN 20 AND 29 THEN '20-29'
          WHEN age BETWEEN 30 AND 39 THEN '30-39'
          WHEN age BETWEEN 40 AND 49 THEN '40-49'
          WHEN age >= 50 AND age < 120 THEN '50+'
          ELSE 'Unknown'
        END AS label,
        count(*)::int AS n,
        round(avg(total_score))::int AS avg_total
      FROM submissions
      GROUP BY 1
      ORDER BY n DESC
    `,
    sql`
      SELECT
        nullif(initcap(trim(country)), '') AS label,
        count(*)::int AS n,
        round(avg(total_score))::int AS avg_total
      FROM submissions
      GROUP BY 1
      ORDER BY n DESC
      LIMIT 15
    `,
    sql`
      SELECT
        nullif(initcap(trim(nationality)), '') AS label,
        count(*)::int AS n,
        round(avg(total_score))::int AS avg_total
      FROM submissions
      GROUP BY 1
      ORDER BY n DESC
      LIMIT 15
    `,
    sql`
      SELECT
        nullif(initcap(trim(education)), '') AS label,
        count(*)::int AS n,
        round(avg(total_score))::int AS avg_total
      FROM submissions
      GROUP BY 1
      ORDER BY n DESC
    `,
  ])

  return new Response(
    JSON.stringify({
      totals: totals[0],
      byGender,
      byAgeBand,
      byCountry,
      byNationality,
      byEducation,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config: Config = {
  path: '/api/insights',
}
