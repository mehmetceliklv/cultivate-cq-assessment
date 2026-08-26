import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_QUESTIONS } from '../data/questions'

interface SubmissionRow {
  id: string
  email: string
  submitted_at: string | null
  age: number | null
  gender: string | null
  country: string | null
  nationality: string | null
  education: string | null
  professional_affiliation: string | null
  languages: string | null
  countries_visited: number | null
  part1_score: number
  part2_score: number
  part3_score: number
  part4_score: number
  part5_score: number
  total_score: number
  tool_duration: string | null
  relevant_statements: string | null
  unclear_wording: string | null
  interested_events: string | null
  suggestions: string | null
  [key: `q${number}`]: unknown
}

const TOKEN_KEY = 'cq_admin_token'

function LoginForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Incorrect password.')
        return
      }
      const data = await res.json()
      localStorage.setItem(TOKEN_KEY, data.token)
      onSuccess(data.token)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Login</h1>
      <label className="block mb-4">
        <span className="block text-sm font-medium text-slate-700 mb-1.5">Password</span>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Signing in\u2026' : 'Sign in'}
      </button>
      <p className="text-center mt-6">
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          \u2190 Back to assessment
        </Link>
      </p>
    </form>
  )
}

function ExpandedAnswers({ row }: { row: SubmissionRow }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
      {ALL_QUESTIONS.map((q) => (
        <div key={q.id} className="flex justify-between border-b border-slate-100 py-1">
          <span className="text-slate-500 pr-2 truncate" title={q.text}>
            Q{q.id}
          </span>
          <span className="font-medium text-slate-800">{String(row[`q${q.id}`] ?? '\u2013')}</span>
        </div>
      ))}
    </div>
  )
}

function Dashboard({ token }: { token: string }) {
  const [rows, setRows] = useState<SubmissionRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin-data', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error('Session expired. Please sign in again.')
        return res.json()
      })
      .then((data) => setRows(data.rows))
      .catch((e) => setError(e.message))
  }, [token])

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    window.location.reload()
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-rose-600 mb-4">{error}</p>
        <button onClick={logout} className="text-blue-600 hover:underline">
          Back to login
        </button>
      </div>
    )
  }

  if (!rows) return <p className="text-center text-slate-500">Loading entries\u2026</p>

  const filtered = rows.filter((r) =>
    search.trim() === ''
      ? true
      : [r.email, r.country, r.nationality].some((v) =>
          (v || '').toLowerCase().includes(search.toLowerCase())
        )
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Submissions <span className="text-slate-400 font-normal">({rows.length})</span>
        </h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Filter by email / country / nationality"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
          />
          <Link to="/insights" className="text-sm text-blue-600 hover:underline">
            Insights
          </Link>
          <button onClick={logout} className="text-sm text-slate-500 hover:underline">
            Log out
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Submitted</th>
              <th className="px-3 py-2 font-medium">Age</th>
              <th className="px-3 py-2 font-medium">Gender</th>
              <th className="px-3 py-2 font-medium">Country</th>
              <th className="px-3 py-2 font-medium">Nationality</th>
              <th className="px-3 py-2 font-medium">Education</th>
              <th className="px-3 py-2 font-medium text-right">Total</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <Fragment key={r.id}>
                <tr className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '\u2013'}
                  </td>
                  <td className="px-3 py-2">{r.age ?? '\u2013'}</td>
                  <td className="px-3 py-2">{r.gender ?? '\u2013'}</td>
                  <td className="px-3 py-2">{r.country ?? '\u2013'}</td>
                  <td className="px-3 py-2">{r.nationality ?? '\u2013'}</td>
                  <td className="px-3 py-2">{r.education ?? '\u2013'}</td>
                  <td className="px-3 py-2 text-right font-semibold">{r.total_score}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {expanded === r.id ? 'Hide' : 'Answers'}
                    </button>
                  </td>
                </tr>
                {expanded === r.id && (
                  <tr className="border-t border-slate-100 bg-slate-50/60">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4 text-sm">
                        <div>
                          <span className="text-slate-500 block">Part 1</span>
                          <span className="font-semibold">{r.part1_score}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Part 2</span>
                          <span className="font-semibold">{r.part2_score}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Part 3</span>
                          <span className="font-semibold">{r.part3_score}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Part 4</span>
                          <span className="font-semibold">{r.part4_score}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Part 5</span>
                          <span className="font-semibold">{r.part5_score}</span>
                        </div>
                      </div>
                      <ExpandedAnswers row={r} />
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        {r.professional_affiliation && (
                          <p>
                            <span className="text-slate-400">Affiliation:</span>{' '}
                            {r.professional_affiliation}
                          </p>
                        )}
                        {r.languages && (
                          <p>
                            <span className="text-slate-400">Languages:</span> {r.languages}
                          </p>
                        )}
                        {r.tool_duration && (
                          <p>
                            <span className="text-slate-400">Duration:</span> {r.tool_duration}
                          </p>
                        )}
                        {r.relevant_statements && (
                          <p>
                            <span className="text-slate-400">Relevant statements:</span>{' '}
                            {r.relevant_statements}
                          </p>
                        )}
                        {r.unclear_wording && (
                          <p>
                            <span className="text-slate-400">Unclear wording:</span>{' '}
                            {r.unclear_wording}
                          </p>
                        )}
                        {r.interested_events && (
                          <p>
                            <span className="text-slate-400">Interested in events:</span>{' '}
                            {r.interested_events}
                          </p>
                        )}
                        {r.suggestions && (
                          <p>
                            <span className="text-slate-400">Suggestions:</span> {r.suggestions}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50/40 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        {token ? <Dashboard token={token} /> : <LoginForm onSuccess={setToken} />}
      </div>
    </div>
  )
}
