import type { Feedback } from '../types'

interface Props {
  data: Feedback
  onChange: (f: Feedback) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  error: string | null
}

const textareaClass =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition min-h-[90px]'

const YES_NO_MAYBE = ['Yes', 'No', 'Maybe']

export default function Step3Feedback({
  data,
  onChange,
  onBack,
  onSubmit,
  submitting,
  error,
}: Props) {
  const set = <K extends keyof Feedback>(key: K, value: Feedback[K]) =>
    onChange({ ...data, [key]: value })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Almost done</h1>
      <p className="text-slate-600 mb-8">
        A few optional questions about your experience with this tool, then submit to see your CQ
        profile.
      </p>

      <div className="space-y-6">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">
            Which statements felt most relevant to your work or life?
          </span>
          <textarea
            className={textareaClass}
            value={data.relevantStatements}
            onChange={(e) => set('relevantStatements', e.target.value)}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">
            Were any statements unclear or confusingly worded?
          </span>
          <textarea
            className={textareaClass}
            value={data.unclearWording}
            onChange={(e) => set('unclearWording', e.target.value)}
          />
        </label>

        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">
            Would you be interested in related training events?
          </span>
          <div className="flex gap-2">
            {YES_NO_MAYBE.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => set('interestedEvents', opt)}
                className={`rounded-lg border px-5 py-2 text-sm transition ${
                  data.interestedEvents === opt
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">
            Any other suggestions for improving this tool?
          </span>
          <textarea
            className={textareaClass}
            value={data.suggestions}
            onChange={(e) => set('suggestions', e.target.value)}
          />
        </label>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mt-10">
        <button
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-8 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit & see my results'}
        </button>
      </div>
    </div>
  )
}
