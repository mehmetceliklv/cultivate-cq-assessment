import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { PART_LABELS, PARTS } from '../data/questions'

interface CountRow {
  label: string | null
  n: number
}

interface InsightsData {
  type: 'all' | 'pre' | 'post'
  totals: { n: number; avgTotal: number | null }
  scoreStats: {
    min_score: number | null
    max_score: number | null
    mean_score: number | null
    median_score: number | null
  }
  bandDistribution: { band: string; n: number }[]
  chapterMeans: {
    mean_part1: number | null
    mean_part2: number | null
    mean_part3: number | null
    mean_part4: number | null
    mean_part5: number | null
  }
  byGender: CountRow[]
  byAgeBand: CountRow[]
  byCountry: CountRow[]
  byNationality: CountRow[]
  byEducation: CountRow[]
  byLanguage: CountRow[]
  feedback: {
    relevant_statements: string | null
    unclear_wording: string | null
    suggestions: string | null
    interested_events: string | null
  }[]
  compareByType: {
    assessment_type: 'pre' | 'post'
    n: number
    mean_score: number | null
    mean_part1: number | null
    mean_part2: number | null
    mean_part3: number | null
    mean_part4: number | null
    mean_part5: number | null
  }[]
}

const DONUT_COLORS = ['#2563eb', '#f59e0b', '#059669', '#e11d48', '#7c3aed', '#0891b2', '#d97706']

const BAND_ORDER = ['Very strong', 'Strong', 'Developing', 'Emerging', 'Needs focus']
const BAND_COLORS: Record<string, string> = {
  'Very strong': '#059669',
  Strong: '#2563eb',
  Developing: '#f59e0b',
  Emerging: '#f97316',
  'Needs focus': '#e11d48',
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 px-4 py-3 text-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
    </div>
  )
}

function DonutCard({ title, data }: { title: string; data: CountRow[] }) {
  const clean = data.filter((d) => d.label && d.n > 0)
  const total = clean.reduce((s, d) => s + d.n, 0)
  if (clean.length === 0 || total === 0) return null

  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-3">{title}</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={clean}
              dataKey="n"
              nameKey="label"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {clean.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v, _n, item) => [`${v} (${Math.round((Number(v) / total) * 100)}%)`, item.payload.label]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {clean.slice(0, 6).map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-600 truncate">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="text-slate-900 font-medium shrink-0">
              {Math.round((d.n / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LanguageBar({ data }: { data: CountRow[] }) {
  const clean = data.filter((d) => d.label)
  if (clean.length === 0) return null
  const max = Math.max(...clean.map((d) => d.n))

  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-3">Languages spoken</h3>
      <div className="space-y-2">
        {clean.map((d) => (
          <div key={d.label} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 text-slate-600 truncate">{d.label}</span>
            <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${(d.n / max) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-slate-500">{d.n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<'all' | 'pre' | 'post'>('pre')

  useEffect(() => {
    setData(null)
    fetch(`/api/insights?type=${type}`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load insights.')
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [type])

  const preCompare = data?.compareByType.find((c) => c.assessment_type === 'pre')
  const postCompare = data?.compareByType.find((c) => c.assessment_type === 'post')

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50/60 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Public Insights</h1>
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to assessment
          </Link>
        </div>

        <div className="flex gap-2 mb-8">
          {(['pre', 'post', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                type === t ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t === 'pre' ? 'Pre-Assessment' : t === 'post' ? 'Post-Assessment' : 'All'}
            </button>
          ))}
        </div>

        {(preCompare || postCompare) && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Pre vs Post Comparison</h2>
            <p className="text-sm text-slate-500 mb-4">
              Average overall CQ score before and after training, across all respondents.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 text-center">
                <div className="text-xs font-medium text-blue-700 mb-1">Pre-Assessment</div>
                <div className="text-3xl font-bold text-slate-900">
                  {preCompare ? preCompare.mean_score : '–'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {preCompare ? `n = ${preCompare.n}` : 'No responses yet'}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 text-center">
                <div className="text-xs font-medium text-emerald-700 mb-1">Post-Assessment</div>
                <div className="text-3xl font-bold text-slate-900">
                  {postCompare ? postCompare.mean_score : '–'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {postCompare ? `n = ${postCompare.n}` : 'No responses yet'}
                </div>
              </div>
            </div>
            {preCompare && postCompare && preCompare.mean_score !== null && postCompare.mean_score !== null && (
              <p className="text-sm text-slate-600 mt-3 text-center">
                {postCompare.mean_score > preCompare.mean_score ? 'Up' : postCompare.mean_score < preCompare.mean_score ? 'Down' : 'No change'}{' '}
                {Math.abs(Math.round((postCompare.mean_score - preCompare.mean_score) * 10) / 10)} points on average since pre-assessment.
              </p>
            )}
          </section>
        )}

        {error && <p className="text-rose-600">{error}</p>}
        {!data && !error && <p className="text-slate-500">Loading insights&hellip;</p>}

        {data && (
          <div className="space-y-10">
            {/* 3.1 Sample overview */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Sample Overview</h2>
              <p className="text-sm text-slate-500 mb-4">
                Based on {data.totals.n} respondents so far.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <DonutCard title="Gender" data={data.byGender} />
                <DonutCard title="Age" data={data.byAgeBand} />
                <DonutCard title="Education" data={data.byEducation} />
                <DonutCard title="Country of residence" data={data.byCountry} />
                <DonutCard title="Nationality" data={data.byNationality} />
                <LanguageBar data={data.byLanguage} />
              </div>
            </section>

            {/* 3.2 Overall CQ baseline */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Overall CQ Baseline</h2>
              <p className="text-sm text-slate-500 mb-4">Total score (0&ndash;100), all respondents.</p>
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <StatCard label="Respondents" value={data.totals.n} />
                  <StatCard label="Range" value={`${data.scoreStats.min_score ?? '–'}–${data.scoreStats.max_score ?? '–'}`} />
                  <StatCard label="Mean" value={data.scoreStats.mean_score ?? '–'} />
                  <StatCard label="Median" value={data.scoreStats.median_score ?? '–'} />
                </div>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={BAND_ORDER.map((band) => ({
                        band,
                        n: data.bandDistribution.find((b) => b.band === band)?.n ?? 0,
                        pct: data.totals.n
                          ? Math.round(
                              ((data.bandDistribution.find((b) => b.band === band)?.n ?? 0) /
                                data.totals.n) *
                                100
                            )
                          : 0,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="band" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip formatter={(v, name, item) => (name === 'n' ? [`${v} (${item.payload.pct}%)`, 'Respondents'] : [v, name])} />
                      <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                        {BAND_ORDER.map((band) => (
                          <Cell key={band} fill={BAND_COLORS[band]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* 3.3 Results by chapter */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Results by Tool Chapter (Parts 1&ndash;5)</h2>
              <p className="text-sm text-slate-500 mb-4">Mean score per chapter, out of 20.</p>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-left">
                    <tr>
                      <th className="px-4 py-2 font-medium">Tool Chapter</th>
                      <th className="px-4 py-2 font-medium">CQ Dimension</th>
                      <th className="px-4 py-2 font-medium text-right">Mean Score / 20</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARTS.map((part, i) => {
                      const key = `mean_part${i + 1}` as keyof typeof data.chapterMeans
                      return (
                        <tr key={part.key} className="border-t border-slate-100">
                          <td className="px-4 py-2 font-medium text-slate-800">{part.title}</td>
                          <td className="px-4 py-2 text-slate-600">{PART_LABELS[part.key]}</td>
                          <td className="px-4 py-2 text-right font-semibold text-slate-900">
                            {data.chapterMeans[key] ?? '–'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3.4 Participant feedback */}
            {data.feedback.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Participant Feedback</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Recent qualitative responses (anonymised).
                </p>
                <div className="space-y-3">
                  {data.feedback.map((f, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-4 text-sm space-y-1.5">
                      {f.relevant_statements && (
                        <p>
                          <span className="text-slate-400">Relevant statements:</span>{' '}
                          <span className="text-slate-700">&ldquo;{f.relevant_statements}&rdquo;</span>
                        </p>
                      )}
                      {f.unclear_wording && (
                        <p>
                          <span className="text-slate-400">Unclear wording:</span>{' '}
                          <span className="text-slate-700">&ldquo;{f.unclear_wording}&rdquo;</span>
                        </p>
                      )}
                      {f.suggestions && (
                        <p>
                          <span className="text-slate-400">Suggestions:</span>{' '}
                          <span className="text-slate-700">&ldquo;{f.suggestions}&rdquo;</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
