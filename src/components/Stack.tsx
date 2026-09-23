"use client";

import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { projects } from "@/content/profile";
import { iconPaths } from "@/content/tool-icons";
import {
  toolCategories,
  tools,
  type Tool,
  type ToolCategory,
} from "@/content/tools";
import { ease, spring } from "./motion";
import { useStore } from "./store";

const maxUses = Math.max(...tools.map((t) => t.projects.length));

function ToolIcon({ tool }: { tool: Tool }) {
  const d = tool.icon ? iconPaths[tool.icon] : undefined;
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-line bg-bg text-soft">
      {d ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-[18px]"
          aria-hidden
        >
          <path d={d} />
        </svg>
      ) : (
        <span className="font-mono text-[12px] text-muted">
          {tool.name.slice(0, 2)}
        </span>
      )}
    </span>
  );
}

function ProjectDot({
  slug,
  name,
  logo,
}: {
  slug: string;
  name: string;
  logo?: string;
}) {
  const { go } = useStore();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        go({ kind: "project", slug });
      }}
      title={name}
      aria-label={`Open ${name}`}
      className="-ml-1.5 grid size-7 place-items-center overflow-hidden rounded-full border-2 border-panel bg-raised text-[10px] font-medium text-soft transition first:ml-0 hover:z-10 hover:-translate-y-0.5"
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={28}
          height={28}
          className="size-full object-cover"
        />
      ) : (
        name.slice(0, 1)
      )}
    </button>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);
  const { go } = useStore();
  const uses = tool.projects.length;
  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-3 transition hover:bg-hover">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-4 text-left"
        >
          <ToolIcon tool={tool} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[16px] text-fg">
              {tool.name}
            </span>
            <span className="block text-[13px] text-muted">
              {tool.category}
            </span>
          </span>
          <span className="hidden w-52 items-center gap-3 sm:flex">
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#2c2c2c]">
              <motion.span
                className="block h-full rounded-full bg-[#8a8a8a]"
                initial={{ width: 0 }}
                animate={{ width: `${(uses / maxUses) * 100}%` }}
                transition={{ duration: 0.6, ease }}
              />
            </span>
            <span className="w-24 text-right font-mono text-[13px] whitespace-nowrap text-muted tabular-nums">
              {uses} {uses === 1 ? "project" : "projects"}
            </span>
          </span>
        </button>
        <span className="flex items-center">
          {tool.projects.slice(0, 5).map((p) => (
            <ProjectDot key={p.slug} {...p} />
          ))}
          {uses > 5 && (
            <span className="ml-1.5 font-mono text-[12px] text-faint">
              +{uses - 5}
            </span>
          )}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Hide projects" : "Show projects"}
          className="grid size-7 shrink-0 place-items-center rounded-md text-faint hover:text-fg"
        >
          <ChevronRight
            className={`size-4 transition-transform ${open ? "rotate-90" : ""}`}
          />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.28, ease },
            }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.18 } }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 px-4 pb-4 pl-[68px]">
              {tool.projects.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => go({ kind: "project", slug: p.slug })}
                  className="flex items-center gap-2 rounded-[10px] border border-line bg-bg px-2.5 py-1.5 text-[14px] text-soft transition hover:bg-hover hover:text-fg"
                >
                  {p.logo && (
                    <Image
                      src={p.logo}
                      alt=""
                      width={16}
                      height={16}
                      className="size-4 rounded object-cover"
                    />
                  )}
                  {p.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StackView() {
  const [filter, setFilter] = useState<ToolCategory | "All">("All");
  const shown = useMemo(
    () =>
      filter === "All" ? tools : tools.filter((t) => t.category === filter),
    [filter],
  );
  const top = tools[0];

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6"
      >
        <h1 className="text-[30px] font-normal tracking-[-0.01em]">Stack</h1>
        <p className="mt-1.5 text-[16px] text-muted">
          {tools.length} tools across {projects.length} projects, counted from
          what each project actually ships with. {top.name} shows up most, in{" "}
          {top.projects.length}.
        </p>

        <div
          className="mt-7 flex gap-1 overflow-x-auto rounded-xl border border-line bg-panel p-1"
          role="tablist"
        >
          {(["All", ...toolCategories] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`relative isolate shrink-0 rounded-lg px-3 py-1.5 text-[14px] transition-colors ${filter === c ? "text-fg" : "text-muted hover:text-soft"}`}
            >
              {filter === c && (
                <motion.span
                  layoutId="stack-filter"
                  transition={spring}
                  className="absolute inset-0 -z-10 rounded-lg bg-selected"
                />
              )}
              {c}
              <span className="ml-1.5 font-mono text-[12px] text-faint">
                {c === "All"
                  ? tools.length
                  : tools.filter((t) => t.category === c).length}
              </span>
            </button>
          ))}
        </div>

        <motion.ul
          layout
          className="mt-4 overflow-hidden rounded-2xl border border-line bg-panel"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((t) => (
              <motion.li
                key={t.name}
                layout
                className="border-b border-line last:border-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2 }}
              >
                <ToolRow tool={t} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </motion.div>
    </div>
  );
}
