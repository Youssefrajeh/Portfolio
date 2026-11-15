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
      'Acted as first responder to equipment and process breakdowns on the line, staying calm under pressure, finding the fault and restoring production quickly to minimize downtime',
      'Diagnosed root causes of operational and quality defects, implemented corrective actions, and updated quality control documentation to prevent repeat issues',
      'Monitored production output against quality specifications, inspecting product and documenting nonconformances',
      'Supervised daily production operations and coordinated workflow in a fast-paced manufacturing environment'
    ],
    technologies: ['Root Cause Analysis', 'Quality Control', 'Technical Documentation', 'Team Leadership']
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
      'Served as the first point of contact for walk-in customers, diagnosing hardware, software and operating system problems and resolving them',
      'Installed and configured Windows, applications and device drivers, and updated drivers and software to fix compatibility and performance issues',
      'Upgraded customer computers by installing and replacing RAM and hard drives to expand memory and storage capacity',
      'Advised customers on computer parts, checked component compatibility and sold parts to fit each customer’s needs and budget',
      'Explained problems and fixes in plain language so non-technical customers understood what was done and why'
    ],
    technologies: [
      'Windows 10/11 & OS Setup',
      'Hardware Troubleshooting & Repair',
      'RAM & Hard Drive Upgrades',
      'Driver & Software Installation',
      'PC Parts & Compatibility',
      'Customer Support'
    ]
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
