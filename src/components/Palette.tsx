"use client";

import {
  CornerDownLeft,
  Folder,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { ease, spring } from "./motion";
import { projects } from "@/content/profile";
import { useStore, type View } from "./store";

type Item = {
  label: string;
  hint: string;
  icon: typeof Folder;
  run: () => void;
};

export function Palette() {
  const { paletteOpen, setPaletteOpen } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  // Mounted only while open, so every open starts with a fresh query.
  return (
    <AnimatePresence>{paletteOpen && <Dialog key="palette" />}</AnimatePresence>
  );
}

function Dialog() {
  const { setPaletteOpen, go, threads, startChat } = useStore();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const items = useMemo(() => {
    const pages: [string, View][] = [
      ["New chat", { kind: "home" }],
      ["Experience", { kind: "experience" }],
      ["About", { kind: "about" }],
      ["Stack", { kind: "stack" }],
      ["Explore", { kind: "explore" }],
    ];
    const all: Item[] = [
      ...projects.map((p) => ({
        label: p.name,
        hint: p.tagline,
        icon: Folder,
        run: () => go({ kind: "project", slug: p.slug }),
      })),
      ...pages.map(([label, v]) => ({
        label,
        hint: "Page",
        icon: CornerDownLeft,
        run: () => go(v),
      })),
      ...threads.map((t) => ({
        label: t.title,
        hint: "Chat",
        icon: MessageSquare,
        run: () => go({ kind: "chat", id: t.id }),
      })),
    ];
    const q = query.trim().toLowerCase();
    const matches = q
      ? all.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q))
      : all;
    if (q)
      matches.push({
        label: `Ask the agent: “${query.trim()}”`,
        hint: "Chat",
        icon: Sparkles,
        run: () => startChat(query.trim()),
      });
    return matches;
  }, [query, threads, go, startChat]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.15 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-[14vh]"
      onMouseDown={() => setPaletteOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.22, ease },
        }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
        role="dialog"
        aria-label="Search"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-[#262626] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search
            className="size-[18px] text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setPaletteOpen(false);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, items.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter") items[index]?.run();
            }}
            placeholder="Search projects, pages, and chats"
            aria-label="Search"
            className="h-13 flex-1 bg-transparent text-[16px] text-fg placeholder:text-faint focus:outline-none"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[12px] text-faint">
            esc
          </kbd>
        </div>
        <ul className="max-h-[360px] overflow-y-auto p-1.5">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`}>
              <button
                onMouseEnter={() => setIndex(i)}
                onClick={item.run}
                className="relative isolate flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
              >
                {i === index && (
                  <motion.span
                    layoutId="palette-active"
                    transition={spring}
                    className="absolute inset-0 -z-10 rounded-lg bg-selected"
                  />
                )}
                <item.icon
                  className="size-[17px] shrink-0 text-muted"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="max-w-[70%] shrink-0 truncate text-[15px] text-fg">
                  {item.label}
                </span>
                <span className="min-w-0 flex-1 truncate pl-4 text-right text-[13px] text-faint max-sm:hidden">
                  {item.hint}
                </span>
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-[14px] text-faint">
              No matches
            </li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
