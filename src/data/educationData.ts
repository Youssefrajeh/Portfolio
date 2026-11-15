import { TRANSCRIPT_PATH } from '@/lib/site';
import type { Education } from './types';

// Source: "Youssef Rajeh.pdf" (CV) and "Youssef Rajeh - Transcript.pdf" (printed 2026-11-13).
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
      'Enterprise Programming with Java, Spring Boot & Angular',
      'C# Advanced Topics & Component-Based Programming with .NET, gRPC & LINQ Expression Trees',
      'Full-Stack Web Development and Client/Server Applications (ASP.NET Core, React, Vue.js, Node.js, JavaScript & TypeScript)',
      'Native Android Mobile Development (Basic, Intermediate & Advanced) with Kotlin, MVVM & Google ML Kit',
      'Object-Oriented Programming with Java & C++, Data Structures & Algorithms, and Software Design Patterns 1 & 2',
      'Database Fundamentals, Relational Databases & SQL, Advanced Databases (SQL Server), and Declarative Languages (XML, XSD, XSLT, JSON)',
      'Network Fundamentals for Programmers, Operating Systems Fundamentals, and Secure Computing (PHP & Web Security)',
      'Emerging Technologies (Python & AI), System Z COBOL Programming, and Object-Oriented Analysis & Modeling (UML)',
      'Managing Software Projects – Applied 1 & 2 (Agile/Scrum Team Capstone) & Communications for IT',
    ],
  },
  {
    id: 2,
    credential: 'General Arts and Science – English Language Studies (Ontario College Certificate)',
    institution: 'Fanshawe College',
    location: 'London, Ontario',
    period: 'Jan 2023 – Aug 2023',
    highlights: ['GPA 4.00', "President's Honour Roll", "Dean's Honour Roll"],
    details: [
      'English for Academic Purposes Levels 6, 7, 8 & 9 (all completed with an A grade)',
      'Academic & technical writing, research communication, and presentation skills',
    ],
  },
  {
    id: 3,
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
