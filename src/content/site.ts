import type { ReactNode } from 'react';

/**
 * Every word on the site lives here. The 3D bar and the DOM read from the same
 * source, so a drink on the menu board and the camera move it triggers can
 * never drift apart.
 */

export type SectionId = 'about' | 'work' | 'projects' | 'popup' | 'contact';

export interface Drink {
  id: SectionId;
  /** Menu-board name */
  name: string;
  /** The one-line menu description — says plainly what the section contains */
  note: string;
  /** The section title. This is the headline on the menu row, not the drink. */
  leadsTo: string;
  /** Seconds of "extraction" before the section opens */
  brewTime: number;
  /** How the 3D bar actually builds this drink */
  build: {
    vessel: 'demitasse' | 'glass' | 'none';
    /** 0–1 of the vessel's usable height */
    fill: number;
    liquid: string;
    /** Crema or foam cap; omit for drinks that don't have one */
    cap?: string;
    /** A second, denser layer that settles at the bottom */
    base?: string;
    ice?: boolean;
    hot?: boolean;
  };
}

export const DRINKS: Drink[] = [
  {
    id: 'about',
    name: 'Espresso',
    note: 'Who I am and the kind of systems I work on.',
    leadsTo: 'About me',
    brewTime: 2.2,
    build: { vessel: 'demitasse', fill: 0.52, liquid: '#33180A', cap: '#C98B3F', hot: true },
  },
  {
    id: 'work',
    name: 'Cortado',
    note: 'Where I have worked and what I shipped there.',
    leadsTo: 'Work experience',
    brewTime: 2.8,
    build: { vessel: 'demitasse', fill: 0.86, liquid: '#B98D62', cap: '#EEDFC6', hot: true },
  },
  {
    id: 'projects',
    name: 'Cold Brew',
    note: 'Things I built on my own time, start to finish.',
    leadsTo: 'Projects',
    brewTime: 3.2,
    build: { vessel: 'glass', fill: 0.82, liquid: '#3A1C0B', ice: true },
  },
  {
    id: 'popup',
    name: 'House Special',
    note: 'To Be Continued — the coffee pop-up I co-founded.',
    leadsTo: 'The pop-up',
    brewTime: 3.0,
    build: { vessel: 'glass', fill: 0.78, liquid: '#8A5E2E', base: '#7BA05B', cap: '#F1E4CB', ice: true },
  },
  {
    id: 'contact',
    name: 'The Check',
    note: 'Email, phone, and the fastest way to reach me.',
    leadsTo: 'Contact',
    brewTime: 1.6,
    build: { vessel: 'none', fill: 0, liquid: '#F4E7D6' },
  },
];

export const PROFILE = {
  name: 'Manan Mittal',
  role: 'Software Engineer II',
  company: 'Deloitte',
  sideProject: 'To Be Continued',
  location: 'Jersey City, NJ',
  email: 'manan.mittal2020@gmail.com',
  phone: '732-697-8114',
  phoneHref: 'tel:+17326978114',
  github: 'https://github.com/Manan-Mittal',
  linkedin: 'https://linkedin.com/in/manan-mittal7',
  photo: '/images/IMG_9778.jpeg',
  photoCaption: 'At a microroasterie in Quebec.',
  tagline: 'I build software during the day and pull espresso shots on the weekend.',
  bio: [
    `I'm a software engineer at Deloitte, where I work on supply chain systems for the
     VHA. Before that I was on projects for the FDA and FinCEN — the through-line is
     large, old, load-bearing systems that people actually depend on.`,
    `Outside of work I co-founded To Be Continued, an Asian American coffee pop-up.
     Same instinct as the code, honestly: take something familiar, take it apart,
     and put it back together so it means something to the people in front of you.`,
  ],
  education: {
    school: 'Rutgers University',
    where: 'New Brunswick, NJ',
    degrees: 'B.S. Computer Science · B.A. Cognitive Science',
    years: 'Sep 2020 — May 2024',
    honors: ["Dean's List", 'Scarlet Scholarship', 'Rutgers College Scholarship', 'SAS Excellence Award'],
  },
};

/** Grouped so the "grinder settings" panel reads like a real dial, not a word cloud. */
export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Core', items: ['TypeScript', 'Python', 'Java', 'SQL'] },
  { group: 'Front of house', items: ['React', 'Next.js', 'Tailwind', 'Three.js'] },
  { group: 'Back of house', items: ['Node', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL'] },
  { group: 'Machinery', items: ['Docker', 'AWS', 'GCP', 'CI/CD'] },
  { group: 'Roasting', items: ['ML / Data Science', 'Data pipelines'] },
];

export interface Job {
  ticket: string;
  title: string;
  company: string;
  period: string;
  summary: string;
  lines: string[];
  active?: boolean;
}

export const JOBS: Job[] = [
  {
    ticket: '#0041',
    title: 'Software Engineer II',
    company: 'Deloitte',
    period: 'Jul 2024 — present',
    summary: 'Supply chain modernization for the Veterans Health Administration.',
    lines: [
      'Build and ship features on a supply chain platform used across VHA facilities',
      'Work across the stack with a cross-functional delivery team',
      'Translate client requirements into systems that survive contact with real operations',
    ],
    active: true,
  },
  {
    ticket: '#0033',
    title: 'Software Engineering Intern',
    company: 'Deloitte',
    period: 'Jun 2023 — Aug 2023',
    summary: 'Full-stack development and data analysis on an FDA engagement.',
    lines: [
      'Built features for an enterprise web application end to end',
      'Ran analysis on program data to support client decisions',
      'Worked inside an agile delivery cadence with client-facing reviews',
    ],
  },
  {
    ticket: '#0022',
    title: 'Software Engineering Intern',
    company: 'Mphasis',
    period: 'Jul 2022 — Sep 2022',
    summary: 'Cognitive data engine work on a FinCEN project.',
    lines: [
      'Developed web application features in JavaScript and supporting frameworks',
      'Contributed backend endpoints and API integrations',
      'Participated in code review and test coverage for the team',
    ],
  },
  {
    ticket: '#0001',
    title: 'Co-Founder',
    company: 'To Be Continued',
    period: 'Ongoing',
    summary: 'An Asian American coffee pop-up — drinks, community, and a lot of logistics.',
    lines: [
      'Developed a drink menu built on Asian American flavors and memory',
      'Ran operations, sourcing, and service for pop-up events',
      'Built the brand and the community around it from nothing',
    ],
  },
];

export interface Project {
  title: string;
  blurb: string;
  /** Roast-level metaphor doubles as a difficulty/scale tell */
  roast: 'Light' | 'Medium' | 'Dark';
  tags: string[];
  repo?: string;
  demo?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'To Be Continued',
    blurb:
      'An Asian American coffee pop-up I co-founded — a menu of drinks built on flavors we grew up with, and a table for the community around them.',
    roast: 'Dark',
    tags: ['Hospitality', 'Brand', 'Community'],
  },
  {
    title: 'Split-flap board controller',
    blurb:
      'A self-hosted service that drives a physical split-flap display at home. Plugin system, page scheduler, and a template language so any app on the network can put something on the wall.',
    roast: 'Dark',
    tags: ['Python', 'Docker', 'Hardware', 'Plugins'],
  },
  {
    title: 'Perks tracker',
    blurb:
      'A tracker for credit card benefits and recurring perks — quietly answers the question "what am I leaving on the table this month?" and pushes the answer to a display.',
    roast: 'Medium',
    tags: ['TypeScript', 'Docker', 'Self-hosted'],
  },
  {
    title: 'This bar',
    blurb:
      'The site you are standing in. A procedurally modeled espresso machine in Three.js, lit like a product shot, wired up so ordering a drink navigates the page.',
    roast: 'Light',
    tags: ['React', 'Three.js', 'R3F', 'TypeScript', 'Vite'],
    repo: 'https://github.com/Manan-Mittal/Manan-Mittal.github.io',
  },
];

export const POPUP = {
  name: 'To Be Continued',
  standfirst: 'An Asian American coffee pop-up, co-founded and still going.',
  body: [
    `To Be Continued started from a simple frustration: the flavors we grew up with almost
     never make it onto a café menu, and when they do they arrive flattened into a syrup.`,
    `So we built the menu the other way around — start from the flavor, then figure out the
     drink. Pandan, black sesame, ube, salted plum. Coffee as the medium, not the point.`,
    `The name is the promise. Every pop-up is an episode, not a finale.`,
  ],
  menu: [
    { name: 'Pandan Latte', note: 'Coconut milk, pandan, single origin' },
    { name: 'Black Sesame Cortado', note: 'Toasted sesame, two ounces, no sugar' },
    { name: 'Salted Plum Espresso Tonic', note: 'Sour, saline, extremely awake' },
  ],
};

export type { ReactNode };
