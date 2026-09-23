"use client";

import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Bell,
  ChevronDown,
  CircleHelp,
  CirclePlus,
  Folder,
  FolderOpen,
  GitPullRequest,
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  Search,
  SquarePen,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile, projects } from "@/content/profile";
import { pop, spring } from "./motion";
import { LinkIcon } from "./LinkIcon";
import { useStore, type View } from "./store";

const nav: { label: string; icon: typeof SquarePen; view: View }[] = [
  { label: "New chat", icon: SquarePen, view: { kind: "home" } },
  { label: "Experience", icon: GitPullRequest, view: { kind: "experience" } },
  { label: "About", icon: UserRound, view: { kind: "about" } },
  { label: "Stack", icon: AtSign, view: { kind: "stack" } },
  { label: "Explore", icon: MoreHorizontal, view: { kind: "explore" } },
];

const row =
  "relative isolate flex w-full items-center gap-3 rounded-[10px] px-3 py-[7px] text-left text-[15px] transition-colors hover:bg-hover";

export function WindowControls({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const { back, forward, canBack, canForward } = useStore();
  const btn =
    "grid size-7 place-items-center rounded-md text-muted transition hover:bg-hover hover:text-fg disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div className="flex h-12 items-center gap-1.5 px-4">
      <div className="mr-3 flex gap-2" aria-hidden>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span
            key={c}
            className="size-3 rounded-full"
            style={{ background: c }}
          />
        ))}
      </div>
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className={btn}
        >
          <PanelLeft className="size-[17px]" />
        </button>
      )}
      <button
        onClick={back}
        disabled={!canBack}
        aria-label="Back"
        className={btn}
      >
        <ArrowLeft className="size-[17px]" />
      </button>
      <button
        onClick={forward}
        disabled={!canForward}
        aria-label="Forward"
        className={btn}
      >
        <ArrowRight className="size-[17px]" />
      </button>
    </div>
  );
}

function Popover({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          {...pop}
          className={`absolute z-50 origin-top rounded-xl border border-line bg-[#2a2a2a] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)] ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Sidebar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { view, go, threads, setPaletteOpen } = useStore();
  const [menu, setMenu] = useState<"name" | "bell" | null>(null);

  return (
    <nav aria-label="Main" className="flex h-full flex-col">
      <WindowControls onToggleSidebar={onToggleSidebar} />

      <div className="relative flex items-center gap-1 px-5 pt-3 pb-3">
        <button
          onClick={() => setMenu(menu === "name" ? null : "name")}
          className="flex items-center gap-1 rounded-md text-[21px] font-semibold tracking-[-0.01em]"
          aria-haspopup="menu"
        >
          {profile.short}
          <ChevronDown className="mt-0.5 size-4 text-muted" />
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setPaletteOpen(true)}
            aria-label="Search (⌘K)"
            className="grid size-8 place-items-center rounded-md text-muted transition hover:bg-hover hover:text-fg"
          >
            <Search className="size-[18px]" />
          </button>
          <button
            onClick={() => setMenu(menu === "bell" ? null : "bell")}
            aria-label="Notifications"
            className="grid size-8 place-items-center rounded-md text-muted transition hover:bg-hover hover:text-fg"
          >
            <Bell className="size-[18px]" />
          </button>
        </div>

        <Popover
          open={menu === "name"}
          onClose={() => setMenu(null)}
          className="top-12 left-3 w-60"
        >
          {profile.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-soft hover:bg-hover hover:text-fg"
            >
              <span className="text-muted group-hover:text-fg">
                <LinkIcon label={l.label} />
              </span>
              {l.label}
            </a>
          ))}
        </Popover>
        <Popover
          open={menu === "bell"}
          onClose={() => setMenu(null)}
          className="top-12 right-3 w-72 p-4"
        >
          <p className="text-[14px] font-medium">Open to collaborations</p>
          <p className="mt-1 text-[13px] leading-5 text-muted">
            Internships, hackathon teams, and anything worth building. The
            fastest way to reach Smaran is email.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-3 inline-block rounded-lg bg-fg px-3 py-1.5 text-[13px] font-medium text-bg"
          >
            {profile.email}
          </a>
        </Popover>
      </div>

      <div className="space-y-px px-2.5">
        {nav.map(({ label, icon: Icon, view: v }) => {
          const active = view.kind === v.kind;
          return (
            <button
              key={label}
              onClick={() => go(v)}
              className={`${row} ${active ? "text-fg" : "text-soft"}`}
            >
              {active && <ActivePill />}
              <Icon
                className="size-[18px] text-muted"
                strokeWidth={1.75}
                aria-hidden
              />
              {label}
              {label === "New chat" && (
                <CirclePlus
                  className="ml-auto size-[17px] text-muted"
                  strokeWidth={1.75}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-7 min-h-0 flex-1 overflow-y-auto px-2.5 pb-4">
        <p className="px-3 pb-2 text-[15px] text-faint">Projects</p>
        {projects.map((p) => {
          const active = view.kind === "project" && view.slug === p.slug;
          const Icon = active ? FolderOpen : Folder;
          return (
            <div key={p.slug} className="mb-2.5">
              <button
                onClick={() => go({ kind: "project", slug: p.slug })}
                className={`${row} text-soft`}
              >
                <Icon
                  className="size-[18px] text-muted"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {p.slug}
              </button>
              <button
                onClick={() => go({ kind: "project", slug: p.slug })}
                className={`${row} pl-[42px] ${active ? "text-fg" : "text-soft"}`}
              >
                {active && <ActivePill />}
                <span className="truncate">{p.tagline}</span>
              </button>
            </div>
          );
        })}

        {threads.length > 0 && (
          <>
            <p className="mt-5 px-3 pb-2 text-[15px] text-faint">Chats</p>
            {threads.map((t) => {
              const active = view.kind === "chat" && view.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => go({ kind: "chat", id: t.id })}
                  className={`${row} ${active ? "text-fg" : "text-soft"}`}
                >
                  {active && <ActivePill />}
                  <MessageSquare
                    className="size-[17px] shrink-0 text-muted"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="truncate">{t.title}</span>
                </button>
              );
            })}
          </>
        )}
      </div>

      <div className="flex items-center gap-2.5 px-5 py-3.5">
        <Avatar size={24} />
        <span className="truncate text-[15px] text-soft">{profile.handle}</span>
        <button
          onClick={() => go({ kind: "about" })}
          aria-label="About Smaran"
          className="ml-auto grid size-8 place-items-center rounded-md text-muted transition hover:bg-hover hover:text-fg"
        >
          <CircleHelp className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>
    </nav>
  );
}

// One shared highlight that glides between whichever row is active.
function ActivePill() {
  return (
    <motion.span
      layoutId="sidebar-active"
      transition={spring}
      className="absolute inset-0 -z-10 rounded-[10px] bg-selected"
    />
  );
}

export function Avatar({ size = 32 }: { size?: number }) {
  // Codex-style initials badge; the photo lives on the About page.
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="grid shrink-0 place-items-center rounded-full bg-[#1f8a4c] font-semibold text-white"
    >
      SA
    </span>
  );
}
