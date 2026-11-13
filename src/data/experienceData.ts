import type { Experience } from './types';

// Wording follows the CVs in /public. Paid roles run newest first; the
// volunteer role sits last so the section opens on professional experience.
export const experienceData: Experience[] = [
  {
    id: 2,
    title: 'Plastic Blowing Section Supervisor',
    company: 'Hoka Industrie | Douala, Cameroon',
    duration: 'May 2020 – Sep 2022',
    responsibilities: [
      'Acted as first responder to equipment and process breakdowns on the line, finding the fault and restoring production quickly to minimize downtime',
      'Diagnosed root causes of operational and quality defects, implemented corrective actions, and updated quality control documentation to prevent repeat issues',
      'Monitored production output against quality specifications, inspecting product and documenting nonconformances',
      'Supervised daily production operations and coordinated workflow in a fast-paced manufacturing environment'
    ],
    technologies: ['Root Cause Analysis', 'Quality Control', 'Documentation', 'Team Leadership']
  },
  {
    id: 3,
    title: 'Quality Control Inspector / Production Manager',
    company: 'Atlas Negoce | Douala, Cameroon',
    duration: 'Jun 2015 – May 2020',
    responsibilities: [
      'Applied QA/QC standards in a regulated manufacturing environment, identifying defects and communicating technical findings clearly to non-technical stakeholders',
      'Conducted inspections and validation processes to ensure product quality and accuracy',
      'Maintained detailed reports, documentation, and compliance records',
      'Collaborated with teams to improve operational workflows and production efficiency'
    ],
    technologies: ['Quality Assurance', 'Data Validation', 'Compliance', 'Process Improvement']
  },
  {
    id: 4,
    title: 'Laboratory Technician',
    company: 'Madar Group & SICCO | Damascus, Syria',
    duration: 'Nov 2006 – Sep 2014',
    responsibilities: [
      'Performed structured testing protocols and quality control analysis on production samples',
      'Documented results to support internal audits and regulatory compliance reporting',
      'Followed strict quality assurance and safety procedures while working with cross-functional teams'
    ],
    technologies: ['Lab Testing', 'Data Analysis', 'Technical Documentation', 'SOP Development']
  },
  {
    id: 5,
    title: 'Computer Technician – Sales & Service',
    company: 'Computer Service Shop | Syria',
    duration: '2001 – 2006',
    responsibilities: [
      'Served as the first point of contact for walk-in customers, diagnosing and resolving hardware, software and operating system problems',
      'Installed and configured Windows, applications and device drivers, and upgraded RAM and hard drives',
      'Advised customers on parts and compatibility, explaining problems and fixes in plain language'
    ],
    technologies: ['Hardware Troubleshooting', 'Windows', 'Customer Support']
  },
  {
    id: 1,
    title: 'Volunteer – Marketing Team',
    company: 'MWN Marketing',
    duration: 'Sep 2025 – Present',
    responsibilities: [
      'Contribute to digital content creation and support marketing team coordination'
    ],
    technologies: ['Digital Content', 'Communication', 'Team Collaboration']
  }
];
