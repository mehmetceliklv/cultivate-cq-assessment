import { COUNTRIES } from '../data/countries'
import { GENDER_OPTIONS, EDUCATION_OPTIONS } from '../types'
import type { Demographics } from '../types'

interface Props {
  data: Demographics
  onChange: (d: Demographics) => void
  onNext: () => void
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition'

export default function Step1Demographics({ data, onChange, onNext }: Props) {
  const set = <K extends keyof Demographics>(key: K, value: Demographics[K]) =>
    onChange({ ...data, [key]: value })

  const isValid =
    data.consent &&
    data.email.trim() !== '' &&
    data.age.trim() !== '' &&
    data.gender !== '' &&
    data.country !== '' &&
    data.nationality !== '' &&
    data.education !== '' &&
    data.languages.trim() !== '' &&
    data.countriesVisited.trim() !== ''

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Cultural Intelligence (CQ) Self-Assessment Tool
      </h1>

      <div className="space-y-4 text-slate-700 leading-relaxed mb-6">
        <p>Hello!</p>
        <p>
          This tool was developed to test your cultural intelligence under the Cultivate CQ \u2013
          Building Cultural Intelligence for Youth Workers within Diverse Communities project. The
          Cultivate CQ project is co-funded by the European Union under the Erasmus+ Programme.
        </p>
        <div>
          <h2 className="font-semibold text-slate-900 mb-1">How it works:</h2>
          <p>
            Filling this form will take about 10 minutes. The form has three main parts, which are
            demographics, statements about CQ and self-assessment parts.
          </p>
          <p className="mt-2">For each statement, choose one option:</p>
          <ul className="list-disc pl-6 mt-1 space-y-0.5">
            <li>Strongly disagree (0)</li>
            <li>Disagree (1)</li>
            <li>Not sure/neutral (2)</li>
            <li>Agree (3)</li>
            <li>Strongly agree (4)</li>
          </ul>
        </div>
        <p>
          After you complete the statements, your CQ profile will be automatically calculated in
          four areas: metacognitive, cognitive, motivational, and behavioural.
        </p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => set('consent', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">
            I hereby consent to the processing of my personal data for the selected purposes and
            agree that the Cultivate CQ project may collect, store, process, and use my personal
            data I have provided. My data will only be processed for the purpose of the project. I
            can withdraw my consent to the processing of my data at any time.
          </span>
        </label>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-5">Demographics</h2>

      <div className="space-y-5">
        <Field label="Email" required>
          <input
            type="email"
            className={inputClass}
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Age" required>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={data.age}
              onChange={(e) => set('age', e.target.value)}
            />
          </Field>
          <Field label="Gender" required>
            <select
              className={inputClass}
              value={data.gender}
              onChange={(e) => set('gender', e.target.value)}
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Country you live in" required>
          <select
            className={inputClass}
            value={data.country}
            onChange={(e) => set('country', e.target.value)}
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nationality" required>
          <select
            className={inputClass}
            value={data.nationality}
            onChange={(e) => set('nationality', e.target.value)}
          >
            <option value="">Select nationality</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Level of Education" required>
          <select
            className={inputClass}
            value={data.education}
            onChange={(e) => set('education', e.target.value)}
          >
            <option value="">Select education level</option>
            {EDUCATION_OPTIONS.map((ed) => (
              <option key={ed} value={ed}>
                {ed}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Professional Affiliation">
          <input
            type="text"
            className={inputClass}
            value={data.professionalAffiliation}
            onChange={(e) => set('professionalAffiliation', e.target.value)}
          />
        </Field>

        <Field label="Languages you speak" required>
          <input
            type="text"
            placeholder="e.g., English, Spanish, Turkish"
            className={inputClass}
            value={data.languages}
            onChange={(e) => set('languages', e.target.value)}
          />
        </Field>

        <Field label="How many countries did you visit?" required>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={data.countriesVisited}
            onChange={(e) => set('countriesVisited', e.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end mt-10">
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
