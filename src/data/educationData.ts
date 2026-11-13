import { TRANSCRIPT_PATH } from '@/lib/site';
import type { Education } from './types';

// Source: "Youssef Rajeh.pdf" (CV). Keep the two in sync.
// GPA, honours and coursework come from the transcript (printed 2026-11-13).
export const educationData: Education[] = [
  {
    id: 1,
    credential: 'Computer Programming and Analysis – Advanced Diploma (Co-op)',
    institution: 'Fanshawe College',
    location: 'London, Ontario',
    period: 'Sep 2023 – Dec 2026 (expected)',
    highlights: ['GPA 3.97', "Dean's Honour Roll"],
    transcript: TRANSCRIPT_PATH,
    details: [
      'Object-Oriented Programming with C#, .NET and Java',
      'Full-Stack Web Development and Client/Server Applications',
      'Relational and Advanced Databases (SQL)',
      'Data Structures & Algorithms and Software Design Patterns',
      'Mobile Development (Android)',
      'Systems Analysis, OO Modeling and Managing Software Projects',
      'Network Fundamentals and Secure Computing',
    ],
  },
  {
    id: 2,
    credential: "Applied Chemistry – Bachelor's Degree",
    institution: 'Damascus University',
    location: 'Damascus, Syria',
    period: '2001 – 2006',
    highlights: [],
    details: [
      'Analytical problem-solving and statistical data analysis',
      'Experimental design and method validation',
      'Laboratory documentation and technical reporting',
    ],
  },
];
