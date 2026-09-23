"use client";

import { useChat } from "@ai-sdk/react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Folder,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Hammer,
  Laptop,
  ListChecks,
  Play,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  experience,
  getProject,
  profile,
  projects,
  type Project,
} from "@/content/profile";
import { Composer } from "./Composer";
import { Github, Mark } from "./icons";
import { Card, Messages, UserBubble, WorkedFor, pill } from "./Messages";
import { Item, Stagger, ease, pop } from "./motion";
import { useStore } from "./store";

function ContextPicker() {
  const { context, setContext } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const current = context ? getProject(context)?.name : profile.short;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const options = [
    { slug: null, name: profile.short },
    ...projects.map((p) => ({ slug: p.slug, name: p.name })),
  ];

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="underline decoration-[#7a7a7a] decoration-dotted decoration-2 underline-offset-[7px] transition hover:decoration-fg"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current}
            className="inline-block"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.28, ease },
            }}
            exit={{
              opacity: 0,
              y: -8,
              filter: "blur(4px)",
              transition: { duration: 0.14 },
            }}
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            {...pop}
            role="listbox"
            className="absolute top-full left-1/2 z-50 mt-3 w-56 -translate-x-1/2 origin-top rounded-xl border border-line bg-[#2a2a2a] p-1.5 text-left shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            {options.map((o) => (
              <button
                key={o.name}
                role="option"
                aria-selected={o.slug === context}
                onClick={() => {
                  setContext(o.slug);
                  setOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-[15px] tracking-normal hover:bg-hover ${o.slug === context ? "text-fg" : "text-soft"}`}
              >
                {o.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export function HomeView() {
  const { startChat, context } = useStore();
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            <Mark className="size-[60px] text-muted" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="mt-7 text-center text-[27px] leading-snug font-normal tracking-[-0.01em] text-balance sm:text-[32px]"
          >
            What do you want to know about <ContextPicker />?
          </motion.h1>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.16 }}
        className="mx-auto w-full max-w-[780px] px-4 pb-4"
      >
        <div className="mx-4 -mb-5 flex gap-6 overflow-x-auto rounded-t-[18px] bg-[#262626] px-4 pt-2.5 pb-7 text-[15px] whitespace-nowrap text-soft">
          <span className="flex items-center gap-2">
            <Folder
              className="size-[17px] text-muted"
              strokeWidth={1.75}
              aria-hidden
            />
            {context ?? profile.handle}
          </span>
          <span className="flex items-center gap-2 max-sm:hidden">
            <Laptop
              className="size-[17px] text-muted"
              strokeWidth={1.75}
              aria-hidden
            />
            {profile.location}
          </span>
          <span className="flex items-center gap-2">
            <GitBranch
              className="size-[17px] text-muted"
              strokeWidth={1.75}
              aria-hidden
            />
            main
          </span>
        </div>
        <div className="relative">
          <Composer
            onSubmit={startChat}
            autoFocus
            placeholder={
              context
                ? `Ask about ${getProject(context)?.name}`
                : "Ask anything about Smaran"
            }
          />
        </div>
      </motion.div>
    </div>
  );
}

function useAutoScroll(messages: unknown[]) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length)
      end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);
  return end;
}

function ThreadShell({
  children,
  composer,
}: {
  children: React.ReactNode;
  composer: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[780px] px-4 pt-8 pb-12 sm:px-6">
          {children}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[780px] px-4 pb-4 sm:px-6">
        {composer}
      </div>
    </div>
  );
}

export function ChatView({ id }: { id: string }) {
  const { getChat } = useStore();
  const { messages, status, error, sendMessage, stop } = useChat({
    chat: getChat(id),
  });
  const end = useAutoScroll(messages);
  const busy = status === "submitted" || status === "streaming";

  return (
    <ThreadShell
      composer={
        <Composer
          onSubmit={(text) => sendMessage({ text })}
          onStop={stop}
          busy={busy}
          placeholder="Ask a follow-up"
        />
      }
    >
      <Messages messages={messages} status={status} error={error} />
      <div ref={end} />
    </ThreadShell>
  );
}

export function ProjectView({ slug }: { slug: string }) {
  const project = getProject(slug)!;
  const { getChat } = useStore();
  const { messages, status, error, sendMessage, stop } = useChat({
    chat: getChat(`project:${slug}`, slug),
  });
  const end = useAutoScroll(messages);
  const busy = status === "submitted" || status === "streaming";
  const [repo, ...otherLinks] = project.links;

  return (
    <ThreadShell
      composer={
        <Composer
          onSubmit={(text) => sendMessage({ text })}
          onStop={stop}
          busy={busy}
          placeholder={`Ask about ${project.name}`}
        />
      }
    >
      <div className="space-y-9">
        <UserBubble text={`Walk me through ${project.name}`} />
        <Stagger className="space-y-5">
          <Item>
            <WorkedFor label={`Explored ${project.repo}`} />
          </Item>
          {project.video ? (
            <Item>
              <VideoEmbed
                id={project.video}
                title={`${project.name} launch video`}
              />
            </Item>
          ) : (
            <Item className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-panel">
              <Image
                src={project.cover}
                alt={`${project.name} logo`}
                fill
                sizes="(max-width: 800px) 100vw, 780px"
                className="object-cover"
                priority
              />
            </Item>
          )}
          <Item className="prose-chat text-[16px] text-fg">
            {project.summary.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </Item>
          <Item>
            <Card
              icon={
                project.logo ? (
                  <Image
                    src={project.logo}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 object-cover"
                  />
                ) : (
                  <Github className="size-5" />
                )
              }
              title={`${project.name} — ${project.repo}`}
              subtitle={repo.label === "Website" ? "Website" : "Repository"}
              action={
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer"
                  className={pill}
                >
                  Open
                  <ArrowUpRight className="size-4 text-muted" />
                </a>
              }
            />
          </Item>
          <Item>
            <Highlights project={project} />
          </Item>
          {project.next && (
            <Item>
              <Roadmap items={project.next} />
            </Item>
          )}
          {project.images && (
            <Item>
              <Screenshots images={project.images} />
            </Item>
          )}
          {otherLinks.length > 0 && (
            <Item className="flex flex-wrap gap-2">
              {otherLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={pill}
                >
                  {l.label}
                  <ArrowUpRight className="size-4 text-muted" />
                </a>
              ))}
            </Item>
          )}
        </Stagger>
        <Messages messages={messages} status={status} error={error} />
        <div ref={end} />
      </div>
    </ThreadShell>
  );
}

function Highlights({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = project.highlights.length - 3;
  return (
    <Card
      icon={<ListChecks className="size-5" strokeWidth={1.75} />}
      title={`${project.highlights.length} highlights`}
      subtitle={project.role}
    >
      <ul>
        {project.highlights.slice(0, 3).map((h) => (
          <li key={h} className="px-4 py-3 text-[16px] leading-6 text-soft">
            {h}
          </li>
        ))}
        <AnimatePresence initial={false}>
          {expanded &&
            project.highlights.slice(3).map((h, i) => (
              <motion.li
                key={h}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: { duration: 0.3, ease, delay: i * 0.03 },
                }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                className="overflow-hidden text-[16px] leading-6 text-soft"
              >
                <span className="block px-4 py-3">{h}</span>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>
      {hidden > 0 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1.5 px-4 pt-1 pb-3.5 text-[16px] text-fg"
        >
          {expanded ? "Show less" : `Show ${hidden} more`}
          <ChevronDown
            className={`size-4 transition ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
      <p className="border-t border-line bg-[#1f1f1f] px-4 py-3 font-mono text-[13px] text-muted">
        {project.stack.join("  ·  ")}
      </p>
    </Card>
  );
}

function Screenshots({ images }: { images: NonNullable<Project["images"]> }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-2">
      <div className="relative aspect-[5/3] overflow-hidden rounded-2xl border border-line bg-panel">
        <AnimatePresence initial={false}>
          <motion.div
            key={images[active].src}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="absolute inset-0"
          >
            <Image
              src={images[active].src}
              alt={images[active].alt}
              fill
              sizes="(max-width: 800px) 100vw, 780px"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        {images.map((im, i) => (
          <button
            key={im.src}
            onClick={() => setActive(i)}
            aria-label={`Show screenshot ${i + 1}`}
            className={`relative aspect-[5/3] w-24 overflow-hidden rounded-lg border transition ${i === active ? "border-[#8a8a8a]" : "border-line opacity-50 hover:opacity-100"}`}
          >
            <Image
              src={im.src}
              alt=""
              fill
              sizes="96px"
              className="object-cover object-top"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6"
      >
        <h1 className="text-[30px] font-normal tracking-[-0.01em]">{title}</h1>
        <p className="mt-1.5 text-[16px] text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
}

export function ExperienceView() {
  const open = experience.filter((e) => e.status === "active").length;
  return (
    <PageShell
      title="Experience"
      subtitle="Roles, results, and what's still in progress."
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="flex gap-6 border-b border-line px-5 py-3 text-[15px]">
          <span className="flex items-center gap-2 text-fg">
            <GitPullRequest
              className="size-4 text-green"
              strokeWidth={1.75}
              aria-hidden
            />{" "}
            {open} Open
          </span>
          <span className="flex items-center gap-2 text-muted">
            <GitMerge className="size-4" strokeWidth={1.75} aria-hidden />{" "}
            {experience.length - open} Merged
          </span>
        </div>
        {experience.map((e, i) => {
          const Icon = e.status === "active" ? GitPullRequest : GitMerge;
          return (
            <div
              key={`${e.org}-${e.role}`}
              className="flex gap-4 border-b border-line px-5 py-5 last:border-0"
            >
              <Icon
                className={`mt-1 size-[18px] shrink-0 ${e.status === "active" ? "text-green" : "text-muted"}`}
                strokeWidth={1.75}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-[16px]">
                  {e.href ? (
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {e.org}
                    </a>
                  ) : (
                    e.org
                  )}
                  <span className="text-muted"> · {e.role}</span>
                </p>
                <p className="mt-0.5 text-[14px] text-faint">
                  #{experience.length - i}{" "}
                  {e.status === "active" ? "open" : "merged"} · {e.when}
                </p>
                <ul className="mt-3 space-y-1.5 text-[15px] leading-6 text-soft">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

export function ExploreView() {
  const { go } = useStore();
  return (
    <PageShell
      title="Explore"
      subtitle="Everything Smaran has shipped. Open one to start a thread about it."
    >
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Item key={p.slug}>
            <button
              onClick={() => go({ kind: "project", slug: p.slug })}
              className="group w-full overflow-hidden rounded-2xl border border-line bg-panel text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#3d3d3d] active:translate-y-0"
            >
              <div className="relative aspect-video overflow-hidden border-b border-line">
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="px-4 py-3.5">
                <p className="text-[16px]">{p.name}</p>
                <p className="mt-0.5 text-[14px] leading-5 text-muted">
                  {p.tagline}
                </p>
              </div>
            </button>
          </Item>
        ))}
      </Stagger>
    </PageShell>
  );
}

// Click-to-play: show the YouTube thumbnail, load the player only when asked.
function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
      <AnimatePresence initial={false}>
        {playing ? (
          <motion.iframe
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            className="absolute inset-0 size-full"
          />
        ) : (
          <motion.button
            key="poster"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group absolute inset-0"
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 800px) 100vw, 780px"
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
              priority
            />
            <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
            <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition duration-300 group-hover:scale-105">
              <Play className="ml-1 size-6 fill-current" />
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[13px] text-white backdrop-blur">
              Watch the launch video
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export { AboutView } from "./About";
export { StackView } from "./Stack";

function RoadmapItem({ text }: { text: string }) {
  const i = text.indexOf(": ");
  return (
    <li className="flex gap-3 px-4 py-3 text-[16px] leading-6 text-soft">
      <CircleDashed
        className="mt-1 size-4 shrink-0 text-orange"
        strokeWidth={1.75}
        aria-hidden
      />
      <span>
        {i > 0 ? (
          <>
            <span className="text-fg">{text.slice(0, i)}</span>
            <span className="text-muted"> — {text.slice(i + 2)}</span>
          </>
        ) : (
          <span className="text-fg">{text}</span>
        )}
      </span>
    </li>
  );
}

// The biggest pieces up front; the full list opens in a dialog.
function Roadmap({ items, top = 5 }: { items: string[]; top?: number }) {
  const [open, setOpen] = useState(false);
  const rest = items.slice(top);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Card
        icon={<Hammer className="size-5" strokeWidth={1.75} />}
        title="Still being built"
        subtitle={`${items.length} in progress`}
        action={
          rest.length > 0 ? (
            <button onClick={() => setOpen(true)} className={pill}>
              See all
            </button>
          ) : undefined
        }
      >
        <ul>
          {items.slice(0, top).map((n) => (
            <RoadmapItem key={n} text={n} />
          ))}
        </ul>
        {rest.length > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-4 pt-1 pb-3.5 text-[16px] text-fg"
          >
            {rest.length} more on the list
            <ChevronRight className="size-4" />
          </button>
        )}
      </Card>

      <AnimatePresence>
        {open && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            onMouseDown={() => setOpen(false)}
            className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Everything still being built"
              onMouseDown={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.24, ease },
              }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
              className="flex max-h-[85vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-line bg-[#262626] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <Hammer
                  className="size-5 text-soft"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div>
                  <p className="text-[16px] text-fg">Still being built</p>
                  <p className="text-[14px] text-muted">
                    {items.length} things on the Slates roadmap
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="ml-auto grid size-8 place-items-center rounded-md text-muted hover:bg-hover hover:text-fg"
                >
                  <X className="size-[18px]" strokeWidth={1.75} />
                </button>
              </div>
              <div className="overflow-y-auto py-2">
                <p className="px-5 pt-2 pb-1 text-[12px] tracking-[0.06em] text-faint uppercase">
                  Biggest pieces
                </p>
                <ul>
                  {items.slice(0, top).map((n) => (
                    <RoadmapItem key={n} text={n} />
                  ))}
                </ul>
                <p className="mt-2 border-t border-line px-5 pt-4 pb-1 text-[12px] tracking-[0.06em] text-faint uppercase">
                  Also on the list
                </p>
                <ul>
                  {rest.map((n) => (
                    <RoadmapItem key={n} text={n} />
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
