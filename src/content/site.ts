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
    /** Whether the bar steams a pitcher of milk for this one */
    steamMilk?: boolean;
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
    build: { vessel: 'demitasse', fill: 0.78, liquid: '#33180A', cap: '#7C4417', hot: true },
  },
  {
    id: 'work',
    name: 'Cortado',
    note: 'Where I have worked and what I shipped there.',
    leadsTo: 'Work experience',
    brewTime: 2.8,
    build: { vessel: 'demitasse', fill: 0.92, liquid: '#B98D62', cap: '#D9BE94', hot: true, steamMilk: true },
  },
  {
    id: 'projects',
    name: 'Cold Brew',
    note: 'Things I built on my own time, start to finish.',
    leadsTo: 'Projects',
    brewTime: 3.2,
    build: { vessel: 'glass', fill: 0.86, liquid: '#3A1C0B', ice: true },
  },
  {
    id: 'popup',
    name: 'Mango Sticky Rice',
    note: 'To Be Continued — the coffee pop-up I co-founded.',
    leadsTo: 'The pop-up',
    brewTime: 3.0,
    build: { vessel: 'glass', fill: 0.8, liquid: '#E3CFA8', base: '#E0952C', cap: '#FBF5E9', ice: true },
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
  photo: '/images/manan-quebec.webp',
  photoCaption: 'At a microroasterie in Quebec.',
  tagline: 'I build software during the day and pull espresso shots on the weekend.',
  bio: [
    `I'm a software engineer at Deloitte, working on AI systems for the Veterans Health
     Administration. Most of my time goes into a multi-agent LLM assistant that reads
     per-case medical evidence and drafts standardized disability evaluation
     questionnaires — work that used to be manual clinician review, on a queue measured
     in hundreds of thousands of claims a quarter.`,
    `The interesting part isn't the model, it's everything around it: guardrails that
     refuse malformed output before a clinician ever sees it, an offline eval harness
     that catches regressions before release, and reactive Java services underneath that
     have to stay up. Large, old, load-bearing systems that people actually depend on.`,
    `Outside of work I co-founded To Be Continued, an Asian American coffee pop-up. The menu
     starts from flavors we grew up with rather than from a syrup bottle, which turns out to
     be a lot of sourcing, a lot of testing, and a folding table at six in the morning.`,
  ],
  education: {
    school: 'Rutgers University',
    where: 'New Brunswick, NJ',
    degrees: 'B.S. Computer Science · B.A. Cognitive Science',
    years: '2020 — May 2024',
    gpa: '4.0 / 4.0',
    honors: ["Dean's List", 'Scarlet Scholarship', 'Class of 1938 Scholarship', 'SAS Excellence Award'],
  },
};

/** Grouped so the "grinder settings" panel reads like a real dial, not a word cloud. */
export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'AI & LLM', items: ['Multi-agent systems', 'RAG & retrieval', 'OCR pipelines', 'Guardrails', 'Offline evals', 'Tool calling'] },
  { group: 'Languages', items: ['Java', 'TypeScript', 'Python', 'SQL', 'JavaScript'] },
  { group: 'Backend', items: ['Spring Boot', 'Project Reactor', 'Redis', 'ZooKeeper', 'Node.js', 'REST'] },
  { group: 'Frontend', items: ['React', 'MobX', 'Tailwind', 'Three.js'] },
  { group: 'Cloud', items: ['AWS', 'GCP', 'Kubernetes', 'GKE', 'Docker', 'Git'] },
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
    period: 'Jul 2024 — present · New York, NY',
    summary: 'AI systems for the Veterans Health Administration.',
    lines: [
      'Designed a multi-agent LLM assistant that reasons over per-case indexed PDF evidence to draft and approve standardized disability evaluation questionnaires, replacing manual clinician review on a queue of hundreds of thousands of claims a quarter',
      'Built 7 LLM guardrails now running across 17+ projects, validating output against clinical form schemas and blocking malformed responses before a reviewer sees them',
      'Built an offline evaluation harness for production agent workflows that catches accuracy and behavior regressions before release',
      'Architected reactive Java services on Spring Boot and Project Reactor with Redis caching and ZooKeeper coordination',
      'Implemented OCR-driven document indexing and tuned the surrounding SQL, scaling throughput 6x — roughly 1,000 to over 6,000 cases a day',
      'Shipped TypeScript and React front ends with MobX, used by hundreds of thousands of clinicians and patients under federal privacy, security and Section 508 requirements',
    ],
    active: true,
  },
  {
    ticket: '#0033',
    title: 'Software Engineering Intern',
    company: 'Deloitte',
    period: 'Jun 2023 — Aug 2023 · Rosslyn, VA',
    summary: 'Backend and reporting on a federal engagement.',
    lines: [
      'Built a Java and Spring Boot REST API that processed JSON chart data to power dynamic visualizations',
      'Automated an email reporting system with templated HTML, live database content and PDF export, removing a recurring manual task',
      'Containerized and deployed services with Docker and Kubernetes on Google Kubernetes Engine',
    ],
  },
  {
    ticket: '#0022',
    title: 'Software Engineering Intern',
    company: 'Mphasis',
    period: 'Jul 2022 — Sep 2022 · New York, NY',
    summary: 'Turning federal regulation into structured, queryable data.',
    lines: [
      'Built semantic content-extraction algorithms converting 4,000+ Federal Register documents into standardized USLM XML, producing a library of 5,000+ structured documents',
      'Implemented formal logic-based analysis over the corpus to evaluate regulatory norms and resolve normative queries automatically',
    ],
  },
  {
    ticket: '#0001',
    title: 'Co-Founder',
    company: 'To Be Continued',
    period: 'Ongoing · Jersey City, NJ',
    summary: 'An Asian American coffee pop-up: drinks, community, and a lot of logistics.',
    lines: [
      'Built a specialty menu on Asian American flavors: mango sticky rice, kulfi, ube kopi, miso caramel',
      'Ran operations, sourcing and service for pop-up events',
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
      'An Asian American coffee pop-up I co-founded: a menu built on flavors we grew up with, and a table for the community around them.',
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
      'A tracker for credit card benefits and recurring perks that quietly answers the question "what am I leaving on the table this month?", then pushes the answer to a display.',
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
     drink. Mango sticky rice as horchata. Kulfi as an espresso base. Kopi with ube at the
     bottom of the glass. Coffee as the medium, not the point.`,
    `The name is the promise. Every pop-up is an episode, not a finale.`,
  ],
  /** The real specialty list, in menu order. */
  menu: [
    {
      name: 'Mango Sticky Rice Drink',
      note: 'Horchata with mango syrup and coconut foam. Iced only.',
      price: '6.5',
      flag: 'House favorite',
    },
    {
      name: 'Kulfi Coffee',
      note: 'Nutty kulfi base with espresso and milk, pistachio crumble on top.',
      price: '7.5 / 8',
    },
    {
      name: 'Ube Kopi',
      note: 'Malaysian kopi with condensed milk and ube at the bottom. Iced only.',
      price: '6.5',
    },
    {
      name: 'Miso Caramel Latte',
      note: 'Miso caramel syrup with espresso and milk. Hot only.',
      price: '6.5',
    },
    {
      name: 'Moonlight Lavender Latte',
      note: 'Citrusy, creamy earl grey with milk and lavender simple syrup.',
      price: '6 / 6.5',
    },
  ],
  also: [
    { name: 'Coffees', note: 'Espresso, macchiato, cortado, latte, americano, cappuccino', price: '5' },
    { name: 'Teas', note: 'April in Paris · Sun Showers', price: '5' },
    { name: 'Dessert', note: 'Coffee jelly, espresso based, with sweet cream', price: '4' },
  ],
};

export type { ReactNode };
