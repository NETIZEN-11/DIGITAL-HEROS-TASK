/**
 * Resume builder — state shape, validation, sample data.
 */

export const EMPTY_RESUME = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    links: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
}

export const SAMPLE_RESUME = {
  personal: {
    name: 'Nitesh Kumar',
    title: 'Full-Stack Developer',
    email: 'kumarnitesh979875@gmail.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    links: 'github.com/niteshkumar • linkedin.com/in/niteshkumar',
  },
  summary:
    'Full-stack developer with 2+ years building production web apps in React, Node.js and TypeScript. Passionate about clean UI, performance, and shipping useful products.',
  experience: [
    {
      id: 'exp-1',
      company: 'Acme Corp',
      role: 'Software Engineer',
      from: '2023',
      to: 'Present',
      bullets:
        'Built and shipped 4 customer-facing React apps used by 50k+ users.\nReduced p95 API latency by 35% via Redis caching and query optimization.\nMentored 2 junior developers through code reviews and pair programming.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'IIT Delhi',
      degree: 'B.Tech in Computer Science',
      from: '2019',
      to: '2023',
      details: 'CGPA: 8.4 / 10',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
}

const STORAGE_KEY = 'smart-tools:resume:v1'

export function loadResume() {
  if (typeof window === 'undefined') return EMPTY_RESUME
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_RESUME
    return { ...EMPTY_RESUME, ...JSON.parse(raw) }
  } catch {
    return EMPTY_RESUME
  }
}

export function saveResume(resume) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
  } catch {
    // ignore quota / private mode
  }
}

export function clearStoredResume() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}