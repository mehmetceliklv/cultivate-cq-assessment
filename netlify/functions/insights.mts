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
    scoreStats,
    bandDistribution,
    chapterMeans,
    byGender,
    byAgeBand,
    byCountry,
    byNationality,
    byEducation,
    byLanguage,
    feedback,
  ] = await Promise.all([
    sql`SELECT count(*)::int AS n FROM submissions`,
    sql`
      SELECT
        min(total_score)::int AS min_score,
        max(total_score)::int AS max_score,
        round(avg(total_score)::numeric, 1) AS mean_score,
        round(percentile_cont(0.5) WITHIN GROUP (ORDER BY total_score)::numeric, 1) AS median_score
      FROM submissions
    `,
    sql`
      SELECT
        CASE
          WHEN total_score BETWEEN 81 AND 100 THEN 'Very strong'
          WHEN total_score BETWEEN 63 AND 80 THEN 'Strong'
          WHEN total_score BETWEEN 44 AND 62 THEN 'Developing'
          WHEN total_score BETWEEN 25 AND 43 THEN 'Emerging'
          ELSE 'Needs focus'
        END AS band,
        count(*)::int AS n
      FROM submissions
      GROUP BY 1
    `,
    sql`
      SELECT
        round(avg(part1_score)::numeric, 2) AS mean_part1,
        round(avg(part2_score)::numeric, 2) AS mean_part2,
        round(avg(part3_score)::numeric, 2) AS mean_part3,
        round(avg(part4_score)::numeric, 2) AS mean_part4,
        round(avg(part5_score)::numeric, 2) AS mean_part5
      FROM submissions
    `,
    sql`
      SELECT nullif(initcap(trim(gender)), '') AS label, count(*)::int AS n
      FROM submissions GROUP BY 1 ORDER BY n DESC
    `,
    sql`
      SELECT
        CASE
          WHEN age IS NULL THEN 'Unknown'
          WHEN age < 20 THEN 'Under 20'
          WHEN age BETWEEN 20 AND 24 THEN '20-24'
          WHEN age BETWEEN 25 AND 29 THEN '25-29'
          WHEN age BETWEEN 30 AND 34 THEN '30-34'
          WHEN age >= 35 AND age < 120 THEN '35+'
          ELSE 'Unknown'
        END AS label,
        count(*)::int AS n
      FROM submissions GROUP BY 1 ORDER BY n DESC
    `,
    sql`
      SELECT nullif(initcap(trim(country)), '') AS label, count(*)::int AS n
      FROM submissions GROUP BY 1 ORDER BY n DESC LIMIT 10
    `,
    sql`
      SELECT nullif(initcap(trim(nationality)), '') AS label, count(*)::int AS n
      FROM submissions GROUP BY 1 ORDER BY n DESC LIMIT 10
    `,
    sql`
      SELECT nullif(initcap(trim(education)), '') AS label, count(*)::int AS n
      FROM submissions GROUP BY 1 ORDER BY n DESC
    `,
    sql`
      SELECT initcap(trim(lang)) AS label, count(*)::int AS n
      FROM submissions, unnest(string_to_array(languages, ',')) AS lang
      WHERE trim(lang) <> ''
      GROUP BY 1
      ORDER BY n DESC
      LIMIT 12
    `,
    sql`
      SELECT relevant_statements, unclear_wording, suggestions, interested_events
      FROM submissions
      WHERE relevant_statements IS NOT NULL
         OR unclear_wording IS NOT NULL
         OR suggestions IS NOT NULL
      ORDER BY submitted_at DESC NULLS LAST
      LIMIT 12
    `,
  ])

  const avgTotal = scoreStats[0]?.mean_score ?? null

  return new Response(
    JSON.stringify({
      totals: { n: totals[0].n, avgTotal },
      scoreStats: scoreStats[0],
      bandDistribution,
      chapterMeans: chapterMeans[0],
      byGender,
      byAgeBand,
      byCountry,
      byNationality,
      byEducation,
      byLanguage,
      feedback,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config: Config = {
  path: '/api/insights',
}
