"use client";

import type { UIMessage } from "ai";
import { Check, ChevronRight, Copy, FolderOpen, Gauge } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getProject, profile } from "@/content/profile";
import { ease } from "./motion";
import { useStore } from "./store";

type Status = "submitted" | "streaming" | "ready" | "error";

export function Messages({
  messages,
  status,
  error,
}: {
  messages: UIMessage[];
  status: Status;
  error?: Error;
}) {
  const { timings } = useStore();
  const startedAt = useRef<number | null>(null);
  const last = messages.at(-1);

  // Record how long each answer took, for the "Worked for Ns" line.
  useEffect(() => {
    if (status === "submitted") startedAt.current = Date.now();
    if (status === "ready" && startedAt.current && last?.role === "assistant") {
      timings.set(last.id, (Date.now() - startedAt.current) / 1000);
      startedAt.current = null;
    }
  }, [status, last, timings]);

  const waiting =
    status === "submitted" ||
    (status === "streaming" && last?.role !== "assistant");

  return (
    <div className="space-y-9">
      {messages.map((m) =>
        m.role === "user" ? (
          <UserBubble key={m.id} text={textOf(m)} />
        ) : (
          <AssistantMessage
            key={m.id}
            message={m}
            streaming={status === "streaming" && m.id === last?.id}
          />
        ),
      )}
      {waiting && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="shimmer-text text-[16px]"
        >
          Thinking
        </motion.p>
      )}
      {status === "error" && <ErrorCard error={error} />}
    </div>
  );
}

export function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease }}
      className="flex origin-bottom-right justify-end"
    >
      <p className="max-w-[75%] rounded-[20px] bg-bubble px-5 py-3 text-[16px] leading-7 whitespace-pre-wrap text-bubble-fg">
        {text}
      </p>
    </motion.div>
  );
}

export function WorkedFor({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1 border-b border-line pb-3 text-[16px] text-muted"
    >
      {label}
      <ChevronRight className="size-4" aria-hidden />
    </motion.div>
  );
}

// Codex-style card: icon tile, title and subtitle, one action on the right, optional rows below.
export function Card({
  icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
      className="overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <div className="flex items-center gap-4 px-4 py-3.5">
        <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-bg text-soft">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[16px] text-fg">{title}</p>
          {subtitle && (
            <p className="truncate text-[15px] text-muted">{subtitle}</p>
          )}
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </div>
      {children && <div className="border-t border-line">{children}</div>}
    </motion.div>
  );
}

export const pill =
  "inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-panel px-3 py-1.5 text-[15px] text-fg transition hover:bg-hover";

function AssistantMessage({
  message,
  streaming,
}: {
  message: UIMessage;
  streaming: boolean;
}) {
  const { timings } = useStore();
  const seconds = timings.get(message.id);
  const text = textOf(message);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {seconds !== undefined && (
        <WorkedFor label={`Worked for ${seconds.toFixed(1)}s`} />
      )}
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <div key={i} className="prose-chat text-[16px] text-fg">
              <ReactMarkdown
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noreferrer" />
                  ),
                }}
              >
                {part.text}
              </ReactMarkdown>
            </div>
          );
        }
        if (part.type === "tool-open_project") {
          const slug = (part as { input?: { slug?: string } }).input?.slug;
          const done = (part as { state: string }).state === "output-available";
          return slug && done ? (
            <ProjectToolCard key={i} slug={slug} />
          ) : (
            <p key={i} className="shimmer-text text-[16px]">
              Opening project
            </p>
          );
        }
        return null;
      })}
      {!streaming && text && <MessageActions text={text} />}
    </motion.div>
  );
}

function ProjectToolCard({ slug }: { slug: string }) {
  const { go } = useStore();
  const p = getProject(slug);
  if (!p) return null;
  return (
    <Card
      icon={<FolderOpen className="size-5" strokeWidth={1.75} />}
      title={`${p.name} — ${p.repo}`}
      subtitle={p.tagline}
      action={
        <button onClick={() => go({ kind: "project", slug })} className={pill}>
          Open
        </button>
      }
    />
  );
}

function MessageActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 text-muted">
      <button
        aria-label="Copy message"
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded-md p-1 transition hover:bg-hover hover:text-fg"
      >
        {copied ? (
          <Check className="size-[17px]" strokeWidth={1.75} />
        ) : (
          <Copy className="size-[17px]" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}

type ApiError = {
  error?: string;
  scope?: "visitor" | "site";
  retryAfter?: number;
  max?: number;
};

function waitText(seconds = 60) {
  if (seconds < 90) return "about a minute";
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  const hours = Math.round(seconds / 3600);
  return hours <= 1 ? "about an hour" : `${hours} hours`;
}

// The API returns a small JSON body on refusals; turn it into plain words.
function errorCopy(message: string): [string, string] {
  let data: ApiError = {};
  try {
    data = JSON.parse(message);
  } catch {
    /* not JSON: a network or model error */
  }
  if (data.error === "rate_limited" && data.scope === "site")
    return [
      "The agent is resting for today",
      "It's answered a lot of questions today. Everything else on the site still works, or email Smaran directly.",
    ];
  if (data.error === "rate_limited")
    return [
      "That's a lot of questions",
      `Try again in ${waitText(data.retryAfter)}. In the meantime, the projects and about page have most answers.`,
    ];
  if (data.error === "too_long")
    return [
      "That message is too long",
      `Keep it under ${data.max ?? 1000} characters and try again.`,
    ];
  if (data.error === "offline" || message.includes("offline"))
    return [
      "The agent is offline right now",
      "Projects, experience, and the about page all still work. You can also email Smaran directly.",
    ];
  return [
    "Something went wrong",
    "The model didn't answer this time. Try again, or browse the projects in the sidebar.",
  ];
}

function ErrorCard({ error }: { error?: Error }) {
  const { go } = useStore();
  const [title, body] = errorCopy(error?.message ?? "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-panel px-5 py-4 sm:flex-row sm:items-center"
    >
      <Gauge
        className="size-5 shrink-0 text-soft"
        strokeWidth={1.75}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[16px] font-semibold text-fg">{title}</p>
        <p className="text-[15px] leading-6 text-muted">{body}</p>
      </div>
      <div className="flex shrink-0 gap-2 sm:ml-auto">
        <button
          onClick={() => go({ kind: "explore" })}
          className="rounded-full bg-fg px-4 py-1.5 text-[15px] font-medium text-bg transition hover:bg-white"
        >
          Browse projects
        </button>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full bg-raised px-4 py-1.5 text-[15px] text-fg transition hover:bg-[#3a3a3a]"
        >
          Email
        </a>
      </div>
    </motion.div>
  );
}

export function textOf(m: UIMessage) {
  return m.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");
}
