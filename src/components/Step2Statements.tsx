import { PARTS, LIKERT_OPTIONS } from '../data/questions'

interface Props {
  answers: Record<number, number>
  onChange: (answers: Record<number, number>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2Statements({ answers, onChange, onNext, onBack }: Props) {
  const setAnswer = (id: number, value: number) => onChange({ ...answers, [id]: value })

  const totalQuestions = PARTS.reduce((n, p) => n + p.questions.length, 0)
  const answeredCount = Object.keys(answers).length
  const isValid = answeredCount === totalQuestions

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Cultural Intelligence Statements</h1>
      <p className="text-slate-600 mb-8">
        For each statement, choose the option that best matches you.
      </p>

      <div className="space-y-10">
        {PARTS.map((part) => (
          <section key={part.key}>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {part.title}: {part.subtitle}
              </h2>
            </div>

            <div className="space-y-5">
              {part.questions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 p-4 sm:p-5 bg-white"
                >
                  <p className="text-slate-800 font-medium mb-3">
                    {q.id}. {q.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {LIKERT_OPTIONS.map((opt) => {
                      const selected = answers[q.id] === opt.value
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setAnswer(q.id, opt.value)}
                          className={`rounded-lg border px-2 py-2 text-xs sm:text-sm text-center transition ${
                            selected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'
                          }`}
                        >
                          {opt.label}
                          <span className="block text-[10px] opacity-70">({opt.value})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between mt-10">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <div className="text-sm text-slate-500">
          {answeredCount} / {totalQuestions} answered
        </div>
        <button
          disabled={!isValid}
          onClick={onNext}
          className="rounded-lg bg-blue-600 px-8 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
