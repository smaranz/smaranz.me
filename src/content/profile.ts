// Single source of truth. The UI renders from this and the agent is grounded on it,
// so anything not written here is something the agent will say it doesn't know.

export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  repo: string; // owner/name on GitHub
  tagline: string;
  role: string;
  summary: string[];
  highlights: string[];
  stack: string[];
  links: Link[];
  images?: { src: string; alt: string }[];
  cover: string; // logo poster
  logo?: string; // real project logo, shown on its link card
  video?: string; // YouTube id of a launch video
  next?: string[]; // still being built
};

export const profile = {
  name: "Smaran Aramballi Sandarsh",
  short: "Smaran",
  handle: "smaranz",
  age: 15,
  school: "Cupertino High School",
  location: "Cupertino, CA",
  email: "emailsmaran@gmail.com",
  domain: "smaranz.me",
  headline: "15-year-old builder shipping AI agents, apps, and hackathons.",
  bio: [
    "I'm Smaran, a 15-year-old student at Cupertino High School in Cupertino, California.",
    "I started building apps about two years ago and haven't stopped. I love vibe coding: moving fast with AI agents, shipping something real, then polishing it until it feels native.",
    "I've won two hackathons, I run CodeStarters, a student-led nonprofit that teaches CS and AI to younger students, and I qualified for FBLA Nationals as a freshman.",
  ],
  facts: [
    "Got banned from LinkedIn for being too young, so GitHub is the resume.",
    "One of only two freshmen in the last three years to qualify for FBLA Nationals.",
    "This site is itself an agent: you're talking to it.",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/smaranz" },
    { label: "Instagram", href: "https://www.instagram.com/smarxnn/" },
    { label: "CodeStarters", href: "https://codestarters.org" },
    { label: "Email", href: "mailto:emailsmaran@gmail.com" },
  ] satisfies Link[],
  stats: [
    { label: "Hackathon wins", value: "2" },
    { label: "FBLA States", value: "2nd" },
    { label: "Years building", value: "~2" },
  ],
};

export const experience = [
  {
    org: "CodeStarters",
    role: "Founder & President",
    when: "Present",
    href: "https://codestarters.org",
    status: "active" as const,
    points: [
      "Leads a student-led nonprofit that teaches CS and AI to younger students and builds free websites, tools, and agents for small businesses.",
      "Internationally recognized for hosting multiple large student hackathons.",
      "Programs span robotics education, free web and agent work for small businesses, and AI/agent engineering.",
    ],
  },
  {
    org: "FBLA",
    role: "AI Development Co-Lead · Chapter officer",
    when: "2026–27",
    status: "active" as const,
    points: [
      "Co-leads AI development for Cupertino High's FBLA chapter as an officer.",
      "Built Dragon Slayer, the chapter's members-only competition-prep platform: learning paths, practice tests, flashcards, games, check-ins, and analytics, with an admin workspace for officers.",
      "It ships through its own self-hosted pipeline with separate testing, beta, and production environments.",
    ],
  },
  {
    org: "FBLA",
    role: "2nd place at States · National qualifier",
    when: "Freshman year",
    status: "merged" as const,
    points: [
      "Placed 2nd at the FBLA State Leadership Conference and qualified for Nationals as a freshman.",
      "One of only two freshmen in the last three years to qualify for Nationals.",
      "Built a native SwiftUI + Supabase iOS app for Mobile Application Development, and was the only competitor to build it in Swift.",
    ],
  },
  {
    org: "Hackathons",
    role: "2× winner",
    when: "Past 2 years",
    status: "merged" as const,
    points: [
      "Won two hackathons so far.",
      "Built ClipPilot in 24 hours at Fire Hacks with a four-person team.",
      "Collaborated on Wingman, an agent-to-agent negotiation protocol, on TrueForge.",
    ],
  },
  {
    org: "Cupertino High School",
    role: "Student",
    when: "Present",
    status: "active" as const,
    points: ["Cupertino, California."],
  },
];

export const projects: Project[] = [
  {
    slug: "slates",
    cover: "/posters/slates-v2.png",
    logo: "/icons/slates.png",
    video: "Uy-wxAlgRG0",
    name: "Slates",
    repo: "smaranz/slates",
    tagline: "A personal operating system for school.",
    role: "Creator",
    summary: [
      "Slates isn't Schoology with a new coat of paint. It's a personal operating system for being a student: one app that pulls in your real assignments, grades, messages, materials, and due dates, then plans, tutors, tracks, and counsels on top of them.",
      "School runs your week. A board plans your night, a gradebook does live category math with what-if scores, a timer tracks where your hours actually go, and a tutor builds study guides, live Desmos graphs, graded practice tests, and narrated lesson videos, and can move things on the board when you ask in plain English.",
      "Counselor runs the rest of the year: an agentic college counselor that answers from a real counseling library, researches deadlines and admit rates with sources, remembers your goals, takes live voice calls, and gives you a verdict instead of a list of options. It ships as a desktop app for macOS and Windows, with a phone app for iPhone and Android.",
    ],
    highlights: [
      "Board that plans your night: tonight, tomorrow, this week, turned in",
      "Gradebook with live category math and what-if scores",
      "Messages, materials, classes, and assessment review in one place",
      "Tutor that builds study guides, live Desmos graphs, practice tests, and narrated lesson videos",
      "Agentic college counselor with memory, a cited library, live voice calls, and honest odds",
      "Desktop app for macOS and Windows, plus a phone app for iPhone and Android",
      "Private by design: keys and records stay on your own machine",
    ],
    next: [
      "Slates Agent and ADE: an agentic development environment built into Slates",
      "Slates MCP server: gives coding agents Slates' UI components, the Media Gen Studio, and every skill in the MCP hub",
      "Hackathon Planner: finds winning ideas, researches similar projects, plans how to win, writes a prompt ready for Slates Code, and drafts the tagline and demo hook",
      "Notification Hub: one inbox that cycles through work, personal, and school email",
      "Vercel-style hosting and a Supabase-style backend, run from Slates",
      "Slates Code CLI",
      "Study Studio and an AP study schedule",
      "Health: gym-day tracking, a calorie tracker, and a workout creator",
      "Media Gen Studio with ElevenLabs, also reachable through the MCP server",
      "A dashboard for agent metrics, costs, and the skills you've built up",
      "UI Library",
      "General calendar",
      "Full mobile app",
      "Keeps your laptop awake while agents are running, and lets it sleep when they stop",
      "Continued work on School and Counselor",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "Electron",
      "Capacitor",
      "Schoology API",
      "Playwright",
      "OpenAI Realtime",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/smaranz/slates" },
      { label: "Launch video", href: "https://youtu.be/Uy-wxAlgRG0" },
      {
        label: "Download",
        href: "https://github.com/smaranz/slates/releases/latest",
      },
    ],
    images: [
      { src: "/slates/assignments.png", alt: "Slates board: Today, Tomorrow, Later and Turned in, with impact and time estimates on every card" },
      { src: "/slates/grades.png", alt: "Slates grades: live category math for each class, with the change in points" },
      { src: "/slates/tutor.png", alt: "Slates tutor with starter prompts built from your real assignments" },
      { src: "/slates/calendar.png", alt: "Slates calendar with assignments on their real due dates" },
      { src: "/slates/messages.png", alt: "Slates messages: the Schoology inbox, tagged by class" },
      { src: "/slates/home.png", alt: "Slates home: choose School, Counselor, UI, or AI Usage" },
    ],
  },
  {
    slug: "probe",
    cover: "/posters/probe-v3.png",
    logo: "/icons/probe.png",
    name: "Probe",
    repo: "smaranz/trueforgehackathon",
    tagline: "Your first team of users, before your real users.",
    role: "Creator · Built on TrueForge",
    summary: [
      "Probe sends a bounded team of 30 AI specialists at your product before real users ever see it. Each one signs up for a real account with a synthetic identity, explores its assigned workflows in its own browser, and records functional, accessibility, usability, and restricted security evidence.",
      "Findings start as Suspected and only become Confirmed after an independent reproduction in a fresh browser session. A local dashboard scans pages, investigates anything you point at, and can propose a source fix, build it in a disposable Git worktree, run your tests, and apply it only if they pass.",
    ],
    highlights: [
      "30 specialists with separate accounts, browsers, and scoped tools",
      "Evidence first: findings stay Suspected until independently reproduced",
      "Propose, then build the fix: patches are verified in a disposable worktree before they touch your code",
      "Bounded stress testing with p50 and p95 latency and rate-limit detection",
      "Local-only by design, with feedback that persists as agent memory",
    ],
    stack: ["TypeScript", "Vite", "Playwright", "SQLite", "TrueForge", "MCP"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/smaranz/trueforgehackathon",
      },
    ],
  },
  {
    slug: "publick",
    cover: "/posters/publick-v3.png",
    logo: "/icons/publick.png",
    name: "Publick",
    repo: "publick.app",
    tagline:
      "Honest answers, campus intel, and the people who already figured it out.",
    role: "Creator · Early access",
    summary: [
      "Publick is an AI college counselor that pulls college planning into one place: a personalized plan built from your academics, activities, essays, and testing, a balanced list of likely, target, and reach schools, and a 90-day roadmap of what to do next.",
      "Its counselor answers questions with your profile as context, and an SAT simulator shows how a score change moves your options. It's in early access with a waitlist.",
    ],
    highlights: [
      "Personalized college plan built from your full profile",
      "Balanced school list with likely, target, and reach ranges",
      "90-day roadmap with prioritized next actions",
      "Profile-aware AI counselor",
      "SAT prep simulator that shows how a score moves your options",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Claude API",
      "GSAP",
      "Framer Motion",
    ],
    links: [{ label: "Website", href: "https://www.publick.app/" }],
  },
  {
    slug: "essaylens",
    cover: "/posters/essaylens.png",
    logo: "/icons/essaylens.png",
    name: "EssayLens",
    repo: "essaylens.app",
    tagline:
      "The essay feedback studio: graded the way professors actually grade.",
    role: "Creator",
    summary: [
      "EssayLens scans an essay the way an instructor would and returns an EssayLens Score from 0 to 100, broken down across thesis and argument, evidence, structure and flow, style and clarity, and readability.",
      "Feedback goes down to the sentence: it checks the thesis, verifies evidence and citations, scores against a rubric, and exports a PDF report with specific next steps. Paid plans add AI-detection scoring.",
    ],
    highlights: [
      "EssayLens Score (0–100) with a rubric breakdown by category",
      "Sentence-level suggestions, thesis scan, and evidence and citation checks",
      "Exportable PDF reports with personalized recommendations",
      "Free, Pro, and Scholar plans, with AI-detection scoring on paid tiers",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "OpenAI"],
    links: [{ label: "Website", href: "https://www.essaylens.app/" }],
  },
  {
    slug: "trendpilot",
    cover: "/posters/trendpilot.png",
    name: "TrendPilot",
    repo: "smaranz/trendpilot",
    tagline: "An AI trend radar that turns rising signals into Shorts.",
    role: "Creator",
    summary: [
      "TrendPilot is an autonomous team of agents for content creators. Scouts pull rising posts from Reddit, an analyst scores each signal, a strategist decides what's worth making, and a learner rewrites the team's context after every cycle so the next scan is sharper.",
      "Every agent gets its own isolated OpenClaw browser session and terminal, and they coordinate only through a shared group chat. The best signals go to a video swarm that writes, narrates with ElevenLabs, and renders YouTube Shorts with Remotion.",
    ],
    highlights: [
      "Scout, analyst, strategist, and learner agents that run in cycles",
      "Each agent has its own OpenClaw browser session and terminal",
      "A context log that evolves after every cycle",
      "Automatic YouTube Shorts: script, ElevenLabs narration, Remotion render",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "AI SDK",
      "Claude API",
      "OpenAI",
      "ElevenLabs",
      "Remotion",
      "SQLite",
      "OpenClaw",
    ],
    links: [{ label: "GitHub", href: "https://github.com/smaranz/trendpilot" }],
  },
  {
    slug: "clippilot",
    cover: "/posters/clippilot-v2.png",
    logo: "/icons/clippilot.png",
    name: "ClipPilot",
    repo: "smaranz/clippilot",
    tagline: "An autonomous shorts factory with no human in the loop.",
    role: "Team of 4 · Fire Hacks (24h)",
    summary: [
      "ClipPilot finds trending podcasts, clips the most viral moments into 9:16 shorts, posts them, measures performance, learns what wins, and repeats.",
      "It was built in 24 hours at Fire Hacks by a four-person team, sponsored by OpenAI, Redis, CopilotKit, Upload-Post and OpenShorts. ClipPilot is the autonomy layer on top of OpenShorts: four independent lanes that talk only through a Redis contract.",
    ],
    highlights: [
      "Four lanes: discovery, performance learning, render engine, mission-control dashboard",
      "Real data only: yt-dlp discovery with real view counts, real transcripts, GPT-picked moments",
      "An agent 'Slack' where the lanes (Scout, Cutter, Coach, Pilot) chat as peers",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "FastAPI",
      "Redis",
      "CopilotKit",
      "OpenAI",
      "yt-dlp",
    ],
    links: [{ label: "GitHub", href: "https://github.com/smaranz/clippilot" }],
  },
  {
    slug: "classflow",
    cover: "/posters/classflow.png",
    logo: "/icons/classflow.png",
    name: "ClassFlow",
    repo: "smaranz/classflow",
    tagline: "An AI student copilot built on top of Google Classroom.",
    role: "Creator · Hackathon build",
    summary: [
      "ClassFlow signs in with Google and syncs your Classroom courses, assignments, and grades, plus Gmail, Drive, and your calendar, into one dashboard with a daily briefing of what actually matters today.",
      "On top of that it adds an AI tutor, practice sets generated from your real coursework (it reads PDFs and Word docs), and automatic grade sync on every refresh.",
    ],
    highlights: [
      "One-click Google sync: courses, assignments, grades, mail, Drive, calendar",
      "Daily briefing with urgency computed from real due dates",
      "Practice sets and an AI tutor built from your own course files",
      "Grades auto-sync from Classroom scores",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "Framer Motion",
      "Google APIs",
      "n8n",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/smaranz/classflow" },
      { label: "Live app", href: "https://classflow-ashen.vercel.app" },
    ],
  },
  {
    slug: "wingman",
    cover: "/posters/wingman-v2.png",
    logo: "/icons/wingman.png",
    name: "Wingman",
    repo: "rnankani/Wingman",
    tagline:
      "Your agent talks to their agent, and never says more than you allowed.",
    role: "Collaborator",
    summary: [
      "You talk to your wingman for a few minutes and it learns your texture. Then it opens a channel to someone else's wingman, and the two agents feel each other out, disclosing a little more at each step and stopping to ask before crossing the line you drew.",
      "Dating is the demo; the contribution is the protocol: agent-to-agent negotiation with progressive disclosure under a human consent budget. The two wingmen run in separate TrueForge instances on separate machines, so neither can read the other's profile. There's no API for it to try.",
    ],
    highlights: [
      "14 MCP tools scoped to the caller's identity",
      "Consent budget editor and live negotiation channels in the dashboard",
      "Remote MCP connector wired into TrueForge agents",
    ],
    stack: ["TypeScript", "Express", "MCP", "TrueForge"],
    links: [{ label: "GitHub", href: "https://github.com/rnankani/Wingman" }],
  },
  {
    slug: "omiclaw",
    cover: "/posters/omiclaw-v2.png",
    name: "OmiClaw",
    repo: "smaranz/OmiClaw",
    tagline: "Driving Omi smart glasses from a Mac: say 'hey claw'.",
    role: "Creator",
    summary: [
      "Local tooling for driving Omi/OmiClaw glasses from a Mac over Bluetooth LE and USB serial: discovery, photo capture, audio capture, and messaging through an OpenClaw gateway.",
      "It includes an always-listening 'hey claw' voice loop with a local browser UI, and Swift helpers for one-shot and live Apple Speech transcription.",
    ],
    highlights: [
      "Terminal client for BLE discovery plus USB photo and audio capture",
      "Always-listening voice loop with a browser UI",
      "Apple Speech transcription helpers, with local Whisper models as an option",
    ],
    stack: ["Python", "Swift", "BLE", "Apple Speech", "Whisper"],
    links: [{ label: "GitHub", href: "https://github.com/smaranz/OmiClaw" }],
  },
  {
    slug: "testimer",
    cover: "/posters/testimer.png",
    logo: "/icons/testimer.png",
    name: "Testimer",
    repo: "smaranz/testimer",
    tagline: "A study planner with a single-focus timer.",
    role: "Creator",
    summary: [
      "Testimer breaks a study session into tasks, each with a module, a difficulty, a planned order, and a time estimate, then runs one focus timer at a time so you always know what you should be doing right now.",
      "Timers survive reloads and background tabs, the total time left updates live, and finished tasks move into a completed list. Everything stays in your browser.",
    ],
    highlights: [
      "Tasks with module, difficulty, order, and a time estimate",
      "One focus timer at a time, with pause, resume, and reset",
      "Timers keep counting across reloads and background tabs",
      "Live total time left, sorting, and a completed list",
    ],
    stack: ["React", "Vite", "Framer Motion"],
    links: [
      { label: "GitHub", href: "https://github.com/smaranz/testimer" },
      { label: "Live app", href: "https://testimer.vercel.app" },
    ],
  },
  {
    slug: "notchy",
    cover: "/posters/notchy.png",
    logo: "/icons/notchy.png",
    name: "Notchy",
    repo: "smaranz/notchy",
    tagline: "A free, open-source utility hub for the MacBook notch.",
    role: "Creator",
    summary: [
      "Notchy turns the MacBook notch into a utility hub: widgets for the clock, calendar, system info, and media, a file shelf you can drag things into, and quick actions and app launching.",
      "Swipe to scroll through widgets and tap to interact. It works across multiple displays, and on screens without a notch it becomes a small handle bar instead.",
    ],
    highlights: [
      "Clock, calendar, system info, and media widgets",
      "File shelf with drag and drop",
      "Live actions and a quick app launcher",
      "Gestures, multi-monitor support, and a notchless-screen mode",
    ],
    stack: ["Swift", "SwiftUI", "macOS"],
    links: [{ label: "GitHub", href: "https://github.com/smaranz/notchy" }],
  },
  {
    slug: "fbla-app",
    cover: "/posters/fbla-app-v2.png",
    name: "FBLA Mobile App",
    repo: "smaranz/FBLA-Mobile-Application-Development-2026",
    tagline: "A native iOS app for FBLA member engagement.",
    role: "FBLA Mobile Application Development 2026",
    summary: [
      "A complete iOS app built with SwiftUI and Supabase for FBLA members: events, news, resources, profiles, and study-session check-ins.",
      "Smaran was the only competitor to build a native Swift app. Students check in to study sessions by scanning a QR code; admins create sessions and see attendees. Built with MVVM, Combine, and Supabase for auth, Postgres, and realtime.",
    ],
    highlights: [
      "The only competitor to build a native Swift app",
      "Email/password auth plus guest mode",
      "Event calendar with reminders, filtered news feed, resource library",
      "QR study-session check-in, profile badges, admin tools",
    ],
    stack: ["Swift", "SwiftUI", "Supabase", "MVVM", "Combine"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/smaranz/FBLA-Mobile-Application-Development-2026",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
