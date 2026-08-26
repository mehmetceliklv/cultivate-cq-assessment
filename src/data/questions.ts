export interface Question {
  id: number
  text: string
}

export interface Part {
  key: 'part1' | 'part2' | 'part3' | 'part4' | 'part5'
  title: string
  subtitle: string
  questions: Question[]
}

export const PARTS: Part[] = [
  {
    key: 'part1',
    title: 'Part 1',
    subtitle: 'CQ awareness, planning, reflection',
    questions: [
      { id: 1, text: 'When I interact with someone from another culture, I am conscious of the cultural knowledge I have.' },
      { id: 2, text: "When I meet someone from a culture I don't know well, I can adjust my thinking during the conversation." },
      { id: 3, text: "In multicultural environments, I'm aware of the cultural knowledge of mine and others." },
      { id: 4, text: "I check whether my understanding of the other person's culture is accurate." },
      { id: 5, text: "I stay mindful of whether my perceptions of someone's culture match with what is actually happening in real life." },
    ],
  },
  {
    key: 'part2',
    title: 'Part 2',
    subtitle: 'Knowledge about culture',
    questions: [
      { id: 6, text: 'I know basic ways that systems (laws, services, economy) can differ across cultures.' },
      { id: 7, text: 'I know simple language rules or conventions used in other languages.' },
      { id: 8, text: "I'm familiar with common values and religious beliefs in other cultures." },
      { id: 9, text: 'I understand everyday life patterns and routines in other cultures.' },
      { id: 10, text: 'I know the arts, crafts and literature in different cultures.' },
    ],
  },
  {
    key: 'part3',
    title: 'Part 3',
    subtitle: 'Interest and Confidence on CQ',
    questions: [
      { id: 11, text: 'I enjoy starting and taking part in intercultural interactions.' },
      { id: 12, text: 'I feel comfortable socialising with people from a culture that is new to me.' },
      { id: 13, text: "Although adapting different cultures is stressful, I'm willing to handle that stress." },
      { id: 14, text: 'I could get used to the daily routines of another culture.' },
      { id: 15, text: 'I like being with people from other cultures and getting to know them.' },
    ],
  },
  {
    key: 'part4',
    title: 'Part 4',
    subtitle: 'Action and Adaptation',
    questions: [
      { id: 16, text: 'I know how to adjust my spoken communication with people from different cultures.' },
      { id: 17, text: 'I know how to adjust my nonverbal communication with people from different cultures.' },
      { id: 18, text: 'I can change how fast I speak when an intercultural communication requires it.' },
      { id: 19, text: 'I can change my behaviour to fit according to a intercultural situation needs.' },
      { id: 20, text: 'I can adjust my facial expressions according to intercultural situation requires it.' },
    ],
  },
  {
    key: 'part5',
    title: 'Part 5',
    subtitle: 'Youth Work Practice CQ (planning & delivery)',
    questions: [
      { id: 21, text: 'I consider participants’ cultural backgrounds when designing educational activities and programmes.' },
      { id: 22, text: 'I adapt session goals, content and materials so they are culturally relevant and accessible.' },
      { id: 23, text: 'I review learning resources to avoid cultural bias or stereotypes before using them.' },
      { id: 24, text: 'I design participation methods that respect different communication styles and preferences.' },
      { id: 25, text: 'I involve youth or community representatives in planning or validating the programme content.' },
    ],
  },
]

export const ALL_QUESTIONS: Question[] = PARTS.flatMap((p) => p.questions)

export const LIKERT_OPTIONS = [
  { value: 0, label: 'Strongly disagree' },
  { value: 1, label: 'Disagree' },
  { value: 2, label: 'Not sure/neutral' },
  { value: 3, label: 'Agree' },
  { value: 4, label: 'Strongly agree' },
]

export interface BandInfo {
  min: number
  max: number
  label: string
}

export const OVERALL_BANDS: BandInfo[] = [
  { min: 0, max: 24, label: 'Needs focus' },
  { min: 25, max: 43, label: 'Emerging' },
  { min: 44, max: 62, label: 'Developing' },
  { min: 63, max: 80, label: 'Strong' },
  { min: 81, max: 100, label: 'Very strong' },
]

export const PART_LABELS: Record<Part['key'], string> = {
  part1: 'Metacognitive CQ',
  part2: 'Cognitive CQ',
  part3: 'Motivational CQ',
  part4: 'Behavioural CQ',
  part5: 'Youth Work Practice CQ',
}

export const PART_INTERPRETATION: Record<Part['key'], string> = {
  part1:
    'A higher score here means you consciously notice and manage your own assumptions in cross-cultural work. You tend to plan before key interactions, check your understanding during conversations, and reflect after. If your score is mid-range, you do some of this but not consistently—building simple routines (brief plan → quick check-in → short debrief) will help. If your score is lower, you may rely on habits that don’t always fit; start by adding one small step (for example, a 30-second \u201cWhat do I need to check?\u201d pause) to improve accuracy and reduce misunderstandings.',
  part2:
    'A higher score means you carry useful working knowledge about how values, norms, language conventions, institutions and everyday practices vary. You’re more likely to interpret behaviour correctly and signpost services effectively. Mid-range suggests partial knowledge that works in familiar cases but can miss nuance; focus on quick \u201cculture briefs\u201d for the groups you support and refresh them over time. Lower scores indicate a bigger risk of misreading situations; start with basics—key values, common nonverbal norms, essential phrases—and consult trusted community sources.',
  part3:
    'A higher score shows you’re energised and confident engaging across differences; you initiate contact, stay curious, and cope with the normal stress of adapting. Mid-range means motivation is present but can dip under pressure; small, regular exposure and clear personal goals keep it steady. Lower scores suggest the effort feels draining; build confidence gradually with low-stakes interactions, peer support, and short wins that prove to you that progress is possible.',
  part4:
    'A higher score means you adapt how you communicate and behave—tone, pace, formality, turn-taking, nonverbal cues—so others feel respected and included. You notice when a message isn’t landing and you adjust quickly. Mid-range indicates you adapt in some settings but may freeze when things change fast; practising one behaviour at a time (e.g., pace or eye contact) strengthens flexibility. Lower scores point to a more fixed style; start with one deliberate adaptation in routine interactions and invite feedback to build range.',
  part5:
    'This score shows how consistently you embed cultural intelligence into programme design and delivery—from needs assessment and materials to participation methods and co-creation with youth. Higher scores indicate you routinely build cultural context into your planning, check materials for bias, design inclusive participation, and involve youth/community voices in decisions. Mid-range scores suggest good intentions with uneven follow-through; choose one routine to standardise (e.g., a brief cultural check before publishing materials). Lower scores mean cultural relevance may rely on ad-hoc adjustments; start with a simple checklist you use every time you plan an activity.',
}

export function partScore(answers: Record<number, number>, part: Part): number {
  return part.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
}

export function totalScore(answers: Record<number, number>): number {
  return ALL_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
}

export function bandFor(score: number): BandInfo {
  return OVERALL_BANDS.find((b) => score >= b.min && score <= b.max) ?? OVERALL_BANDS[0]
}
