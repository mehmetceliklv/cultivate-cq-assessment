import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface GroupRow {
  label: string | null
  n: number
  avg_total: number | null
}

interface InsightsData {
  totals: {
    n: number
    avg_total: number | null
    avg_part1: number | null
    avg_part2: number | null
    avg_part3: number | null
    avg_part4: number | null
    avg_part5: number | null
  }
  byGender: GroupRow[]
  byAgeBand: GroupRow[]
  byCountry: GroupRow[]
  byNationality: GroupRow[]
  byEducation: GroupRow[]
}

const PART_LABELS = ['Metacognitive', 'Cognitive', 'Motivational', 'Behavioural', 'Youth Work']

function GroupChart({ title, data }: { title: string; data: GroupRow[] }) {
  const clean = data
    .filter((d) => d.label)
    .map((d) => ({ name: d.label as string, n: d.n, avg: d.avg_total ?? 0 }))

  if (clean.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4">Average overall CQ score, by group (sample size in parentheses)</p>
      <div style={{ width: '100%', height: Math.max(180, clean.length * 34) }}>
        <ResponsiveContainer>
          <BarChart data={clean} layout="vertical" margin={{ left: 8, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 12 }}
              tickFormatter={(v: string, i: number) => `${v} (${clean[i]?.n})`}
            />
            <Tooltip formatter={(v) => [v as number, 'Avg. total CQ']} />
            <Bar dataKey="avg" fill="#2563eb" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/insights')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load insights.')
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50/40 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Public Insights</h1>
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            \u2190 Back to assessment
          </Link>
        </div>

        {error && <p className="text-rose-600">{error}</p>}
        {!data && !error && <p className="text-slate-500">Loading insights…</p>}

        {data && (
          <div className="space-y-10">
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-6 text-center">
              <div className="text-sm font-medium text-blue-700 mb-1">
                Respondents so far
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-4">{data.totals.n}</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                {[
                  data.totals.avg_part1,
                  data.totals.avg_part2,
                  data.totals.avg_part3,
                  data.totals.avg_part4,
                  data.totals.avg_part5,
                ].map((val, i) => (
                  <div key={i}>
                    <div className="text-slate-500">{PART_LABELS[i]}</div>
                    <div className="font-semibold text-slate-900">{val ?? '–'}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-600">
                Average overall CQ score:{' '}
                <span className="font-semibold text-slate-900">{data.totals.avg_total ?? '–'}</span>{' '}
                / 100
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GroupChart title="By gender" data={data.byGender} />
              <GroupChart title="By age band" data={data.byAgeBand} />
              <GroupChart title="By education level" data={data.byEducation} />
              <GroupChart title="By nationality" data={data.byNationality} />
            </div>

            <GroupChart title="By country of residence" data={data.byCountry} />
          </div>
        )}
      </div>
    </div>
  )
}
