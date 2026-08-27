import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import ProgressBar from '../components/ProgressBar'
import Step1Demographics from '../components/Step1Demographics'
import Step2Statements from '../components/Step2Statements'
import Step3Feedback from '../components/Step3Feedback'
import Results from '../components/Results'
import { EMPTY_DEMOGRAPHICS, EMPTY_FEEDBACK } from '../types'
import type { Demographics, Feedback } from '../types'
import { submitAssessment } from '../api'

type Step = 1 | 2 | 3 | 4

const STEP_LABELS: Record<Step, string> = {
  1: 'Introduction & Demographics',
  2: 'CQ Statements',
  3: 'Feedback & Submit',
  4: 'Your Results',
}

export default function AssessmentPage() {
  const [step, setStep] = useState<Step>(1)
  const [demographics, setDemographics] = useState<Demographics>(EMPTY_DEMOGRAPHICS)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [feedback, setFeedback] = useState<Feedback>(EMPTY_FEEDBACK)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const startedAt = useRef<number>(Date.now())

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const toolDurationSeconds = Math.round((Date.now() - startedAt.current) / 1000)
      await submitAssessment({ demographics, answers, feedback, toolDurationSeconds })
      setStep(4)
      scrollTop()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50/60">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        {step <= 3 && <ProgressBar step={step} total={3} label={STEP_LABELS[step]} />}

        {step === 1 && (
          <Step1Demographics
            data={demographics}
            onChange={setDemographics}
            onNext={() => {
              setStep(2)
              scrollTop()
            }}
          />
        )}

        {step === 2 && (
          <Step2Statements
            answers={answers}
            onChange={setAnswers}
            onNext={() => {
              setStep(3)
              scrollTop()
            }}
            onBack={() => {
              setStep(1)
              scrollTop()
            }}
          />
        )}

        {step === 3 && (
          <Step3Feedback
            data={feedback}
            onChange={setFeedback}
            onBack={() => {
              setStep(2)
              scrollTop()
            }}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        )}

        {step === 4 && <Results answers={answers} assessmentType={demographics.assessmentType} />}

        <footer className="text-center text-sm text-slate-500 mt-10 pb-10 space-y-2">
          <p className="font-medium text-slate-600">Cultivate CQ Team</p>
          <p>Co-funded by the European Union under the Erasmus+ Programme</p>
          <p className="flex justify-center gap-4 pt-1">
            <Link to="/insights" className="text-blue-600 hover:underline">
              View Public Insights
            </Link>
            <Link to="/admin" className="text-blue-600 hover:underline">
              Admin Login
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
