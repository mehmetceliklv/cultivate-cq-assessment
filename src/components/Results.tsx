import { PARTS, PART_LABELS, PART_INTERPRETATION, partScore, totalScore, bandFor } from '../data/questions'

interface Props {
  answers: Record<number, number>
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100
  return (
    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Results({ answers }: Props) {
  const total = totalScore(answers)
  const band = bandFor(total)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Your CQ Profile</h1>
      <p className="text-slate-600 mb-8">
        Thanks for completing the assessment. Here is how your responses break down.
      </p>

      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-6 mb-8 text-center">
        <div className="text-sm font-medium text-blue-700 mb-1">Overall CQ (20–100)</div>
        <div className="text-5xl font-bold text-slate-900">{total}</div>
        <div className="mt-2 inline-block rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
          {band.label}
        </div>
      </div>

      <div className="space-y-6">
        {PARTS.map((part) => {
          const score = partScore(answers, part)
          return (
            <div key={part.key} className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-slate-900">
                  {part.title}: {PART_LABELS[part.key]} (0–20)
                </h2>
                <span className="font-bold text-slate-900">{score}</span>
              </div>
              <ScoreBar score={score} max={20} />
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {PART_INTERPRETATION[part.key]}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-5 gap-1 text-center text-xs text-slate-500">
        <div>0–24<br />Needs focus</div>
        <div>25–43<br />Emerging</div>
        <div>44–62<br />Developing</div>
        <div>63–80<br />Strong</div>
        <div>81–100<br />Very strong</div>
      </div>
    </div>
  )
}
