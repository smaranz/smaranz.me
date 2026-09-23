import { projects } from "./profile";

// The stack is derived from what the projects actually list, so it can't drift from them.

export type ToolCategory =
  "Languages" | "Frameworks" | "AI & agents" | "Data & platforms";

type ToolInfo = { category: ToolCategory; icon?: string };

const aliases: Record<string, string | null> = {
  "Next.js 16": "Next.js",
  "OpenAI Realtime": "OpenAI",
  MVVM: null,
  BLE: "Bluetooth LE",
};

const info: Record<string, ToolInfo> = {
  TypeScript: { category: "Languages", icon: "typescript" },
  JavaScript: { category: "Languages", icon: "javascript" },
  Python: { category: "Languages", icon: "python" },
  Swift: { category: "Languages", icon: "swift" },
  "Next.js": { category: "Frameworks", icon: "nextdotjs" },
  React: { category: "Frameworks", icon: "react" },
  SwiftUI: { category: "Frameworks", icon: "swift" },
  Combine: { category: "Frameworks", icon: "apple" },
  Electron: { category: "Frameworks", icon: "electron" },
  Capacitor: { category: "Frameworks", icon: "capacitor" },
  Express: { category: "Frameworks", icon: "express" },
  FastAPI: { category: "Frameworks", icon: "fastapi" },
  Vite: { category: "Frameworks", icon: "vite" },
  "Tailwind CSS": { category: "Frameworks", icon: "tailwindcss" },
  "Framer Motion": { category: "Frameworks", icon: "framer" },
  GSAP: { category: "Frameworks", icon: "greensock" },
  Remotion: { category: "Frameworks" },
  OpenAI: { category: "AI & agents", icon: "openai" },
  "Claude API": { category: "AI & agents", icon: "claude" },
  "AI SDK": { category: "AI & agents", icon: "vercel" },
  ElevenLabs: { category: "AI & agents", icon: "elevenlabs" },
  MCP: { category: "AI & agents", icon: "modelcontextprotocol" },
  CopilotKit: { category: "AI & agents" },
  TrueForge: { category: "AI & agents" },
  OpenClaw: { category: "AI & agents" },
  Whisper: { category: "AI & agents", icon: "openai" },
  "Apple Speech": { category: "AI & agents", icon: "apple" },
  n8n: { category: "AI & agents", icon: "n8n" },
  Supabase: { category: "Data & platforms", icon: "supabase" },
  Redis: { category: "Data & platforms", icon: "redis" },
  SQLite: { category: "Data & platforms", icon: "sqlite" },
  Playwright: { category: "Data & platforms", icon: "playwright" },
  "Google APIs": { category: "Data & platforms", icon: "google" },
  "Schoology API": { category: "Data & platforms" },
  "yt-dlp": { category: "Data & platforms", icon: "youtube" },
  "Bluetooth LE": { category: "Data & platforms", icon: "bluetooth" },
  macOS: { category: "Data & platforms", icon: "apple" },
};

export type Tool = {
  name: string;
  category: ToolCategory;
  icon?: string;
  projects: { slug: string; name: string; logo?: string }[];
};

export const tools: Tool[] = (() => {
  const byName = new Map<string, Tool>();
  for (const p of projects) {
    for (const raw of p.stack) {
      const name = raw in aliases ? aliases[raw] : raw;
      if (!name) continue;
      const meta = info[name] ?? { category: "Frameworks" as const };
      const tool = byName.get(name) ?? {
        name,
        category: meta.category,
        icon: meta.icon,
        projects: [],
      };
      if (!tool.projects.some((x) => x.slug === p.slug))
        tool.projects.push({ slug: p.slug, name: p.name, logo: p.logo });
      byName.set(name, tool);
    }
  }
  return [...byName.values()].sort(
    (a, b) =>
      b.projects.length - a.projects.length || a.name.localeCompare(b.name),
  );
})();

export const toolCategories: ToolCategory[] = [
  "Languages",
  "Frameworks",
  "AI & agents",
  "Data & platforms",
];
