interface Props {
  step: number
  total: number
  label: string
}

export default function ProgressBar({ step, total, label }: Props) {
  const pct = (step / total) * 100
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
        <span>
          Step {step} of {total}
        </span>
        <span>{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
