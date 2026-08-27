export interface Demographics {
  assessmentType: 'pre' | 'post' | ''
  joinedTraining: 'yes' | 'no' | ''
  email: string
  age: string
  gender: string
  country: string
  nationality: string
  education: string
  professionalAffiliation: string
  languages: string
  countriesVisited: string
  consent: boolean
}

export interface Feedback {
  relevantStatements: string
  unclearWording: string
  interestedEvents: string
  suggestions: string
}

export const EMPTY_DEMOGRAPHICS: Demographics = {
  assessmentType: '',
  joinedTraining: '',
  email: '',
  age: '',
  gender: '',
  country: '',
  nationality: '',
  education: '',
  professionalAffiliation: '',
  languages: '',
  countriesVisited: '',
  consent: false,
}

export const EMPTY_FEEDBACK: Feedback = {
  relevantStatements: '',
  unclearWording: '',
  interestedEvents: '',
  suggestions: '',
}

export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']

export const EDUCATION_OPTIONS = [
  'Primary School',
  'High School',
  'Vocational/Certificate',
  'Associate/Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate/PhD',
]
