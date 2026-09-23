"use client";

import { ArrowUpRight, Check, Copy, FileCode2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { profile, projects } from "@/content/profile";
import { Contributions } from "./Contributions";
import { LinkIcon } from "./LinkIcon";
import { WorkedFor } from "./Messages";
import { Item, Stagger } from "./motion";

const names = projects.map((p) => `"${p.name}"`);
const shippingLines = Array.from(
  { length: Math.ceil(names.length / 3) },
  (_, i) => `    ${names.slice(i * 3, i * 3 + 3).join(", ")},`,
).join("\n");

// The facts, written the way they'd live in a repo.
const source = `export const smaran = {
  name: "${profile.name}",
  age: ${profile.age},
  school: "${profile.school}",
  based: "${profile.location}",
  building: "~2 years", // mostly by talking to coding agents
  hackathons: { won: 2 },
  fbla: { states: "2nd", nationals: true }, // one of two freshmen in 3 years
  runs: "CodeStarters", // student nonprofit, CS + AI for younger kids
  shipping: [
${shippingLines}
  ],
  linkedin: null, // banned for being too young
} as const;`;

type Token = { t: string; c: string };

const colors = {
  keyword: "#ff7b72",
  string: "#a5d6ff",
  number: "#79c0ff",
  prop: "#e6e6e6",
  comment: "#6e6e6e",
  plain: "#9b9b9b",
};

function tokenize(line: string): Token[] {
  const out: Token[] = [];
  const re =
    /(\/\/.*$)|("[^"]*")|\b(export|const|as|null|true|false)\b|\b(\d+)\b|^(\s*)(\w+)(?=:)/g;
  let last = 0;
  for (const m of line.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: line.slice(last, i), c: colors.plain });
    if (m[1]) out.push({ t: m[1], c: colors.comment });
    else if (m[2]) out.push({ t: m[2], c: colors.string });
    else if (m[3])
      out.push({
        t: m[3],
        c:
          m[3] === "null" || m[3] === "true" || m[3] === "false"
            ? colors.number
            : colors.keyword,
      });
    else if (m[4]) out.push({ t: m[4], c: colors.number });
    else if (m[6]) {
      out.push({ t: m[5] ?? "", c: colors.plain });
      out.push({ t: m[6], c: colors.prop });
    }
    last = i + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last), c: colors.plain });
  return out;
}

function SourceFile() {
  const [copied, setCopied] = useState(false);
  const lines = source.split("\n");
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-2.5">
        <FileCode2
          className="size-4 text-muted"
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="font-mono text-[13px] text-fg">smaran.ts</span>
        <span className="text-[13px] text-faint">TypeScript</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(source);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          aria-label="Copy file"
          className="ml-auto rounded-md p-1 text-muted transition hover:bg-hover hover:text-fg"
        >
          {copied ? (
            <Check className="size-4" strokeWidth={1.75} />
          ) : (
            <Copy className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-[1.7]">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex pr-4 hover:bg-white/[0.02]">
              <span className="w-10 shrink-0 pr-4 text-right text-[#555] select-none">
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {tokenize(line).map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function PhotoAttachment() {
  return (
    <figure className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-line bg-panel sm:w-[270px]">
      <div className="relative aspect-[4/5]">
        <Image
          src="/smaran.png"
          alt={profile.name}
          fill
          sizes="(max-width: 640px) 320px, 270px"
          className="object-cover object-top"
          priority
        />
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
        <span className="font-mono text-[12px] text-soft">smaran.png</span>
        <span className="text-[12px] text-faint">640 × 867</span>
      </figcaption>
    </figure>
  );
}

const links = [
  {
    key: "GitHub",
    label: "github.com/smaranz",
    href: "https://github.com/smaranz",
  },
  {
    key: "Instagram",
    label: "@smarxnn",
    href: "https://www.instagram.com/smarxnn/",
  },
  {
    key: "CodeStarters",
    label: "codestarters.org",
    href: "https://codestarters.org",
  },
  { key: "Email", label: profile.email, href: `mailto:${profile.email}` },
];

export function AboutView() {
  return (
    <div className="h-full overflow-y-auto">
      <Stagger className="mx-auto w-full max-w-[780px] space-y-7 px-4 py-10 sm:px-6">
        <Item>
          <WorkedFor label="Read smaran.ts" />
        </Item>

        <Item>
          <div className="min-w-0">
            <h1 className="text-[26px] leading-tight font-normal tracking-[-0.01em]">
              {profile.name}
            </h1>
            <p className="mt-0.5 font-mono text-[13px] text-muted">
              @{profile.handle} · {profile.location} · {profile.age}
            </p>
          </div>
        </Item>

        <Item className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="prose-chat text-[16px] text-fg">
            <p>
              I&apos;m 15, I go to Cupertino High, and I&apos;ve been building
              software for about two years, mostly by talking to coding agents
              until something real comes out the other end.
            </p>
            <p>
              Slates started because Schoology&apos;s homepage kept lying about
              what was due tonight, and grew into a personal operating system
              for school. Probe sends thirty agents through a product so real
              users don&apos;t have to find the bugs.
            </p>
            <p>
              Outside of shipping, I run{" "}
              <a href="https://codestarters.org">CodeStarters</a>, a student
              nonprofit that teaches younger kids CS and AI and builds free
              sites for small businesses. I&apos;ve won two hackathons, placed
              2nd at FBLA States as a freshman, qualified for Nationals, and was
              the only competitor to build a native Swift app.
            </p>
          </div>
          <PhotoAttachment />
        </Item>

        <Item>
          <Contributions />
        </Item>

        <Item>
          <SourceFile />
        </Item>

        <Item>
          <p className="mb-2 text-[15px] text-muted">Sources</p>
          <div className="grid gap-x-4 sm:grid-cols-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-[15px] text-soft transition hover:bg-hover hover:text-fg"
              >
                <span className="text-muted group-hover:text-fg">
                  <LinkIcon label={l.key} />
                </span>
                <span className="truncate">{l.label}</span>
                <ArrowUpRight className="ml-auto size-4 text-faint" />
              </a>
            ))}
          </div>
        </Item>
      </Stagger>
    </div>
  );
}
