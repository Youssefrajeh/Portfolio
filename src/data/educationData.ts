import type { Education } from './types';

// Source: "Youssef Rajeh.pdf" (CV). Keep the two in sync.
export const educationData: Education[] = [
  {
    id: 1,
    credential: 'Computer Programming and Analysis - Advanced Diploma',
    institution: 'Fanshawe College',
    location: 'London, Ontario',
    period: '2023 – 2026',
    highlights: ['Co-op', 'GPA 3.9'],
    details: [
      'Object-Oriented Programming with C# and .NET',
      'Full Stack Web Development (React, SQL)',
      'DevOps and Agile Practices',
      'Data Structures and Algorithms',
      'Systems Analysis & Design',
    ],
  },
  {
    id: 2,
    credential: 'Applied Chemistry',
    institution: 'Damascus University',
    location: 'Damascus, Syria',
    period: '2001 – 2006',
    highlights: [],
    details: [
      'Precision in experiments, measurement and documentation',
      'Technical writing: reports, detailed records and sharing findings with teams',
      'Lab safety and regulatory compliance',
    ],
  },
];
