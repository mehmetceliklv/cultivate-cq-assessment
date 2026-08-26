import type { Demographics, Feedback } from './types'

export interface SubmissionPayload {
  demographics: Demographics
  answers: Record<number, number>
  feedback: Feedback
  toolDurationSeconds: number
}

export async function submitAssessment(payload: SubmissionPayload): Promise<void> {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Something went wrong while submitting. Please try again.')
  }
}
