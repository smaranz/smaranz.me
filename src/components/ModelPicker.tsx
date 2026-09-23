"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AnthropicMark, OpenAIMark } from "./icons";
import { popUp } from "./motion";
import { useStore } from "./store";

export const models = [
  {
    id: "gpt-6-sol",
    name: "GPT-6 Sol",
    effort: "Medium",
    vendor: "OpenAI",
    Mark: OpenAIMark,
  },
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    effort: "High",
    vendor: "OpenAI",
    Mark: OpenAIMark,
  },
  {
    id: "opus-5.5",
    name: "Opus 5.5",
    effort: "High",
    vendor: "Anthropic",
    Mark: AnthropicMark,
  },
  {
    id: "fable-5.1",
    name: "Fable 5.1",
    effort: "Medium",
    vendor: "Anthropic",
    Mark: AnthropicMark,
  },
];

export function ModelPicker({ dimmed = false }: { dimmed?: boolean }) {
  const { model, setModel } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = models.find((m) => m.id === model) ?? models[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={`relative mr-1 transition-opacity ${dimmed ? "pointer-events-none opacity-0" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Model: ${current.name}`}
        className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[15px] text-soft transition hover:bg-[#3a3a3a] hover:text-fg"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="flex items-center gap-1.5"
          >
            <current.Mark className="size-[15px] shrink-0" />
            <span className="max-sm:hidden">
              {current.name}{" "}
              <span className="text-muted">{current.effort}</span>
            </span>
          </motion.span>
        </AnimatePresence>
        <ChevronDown
          className={`size-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            {...popUp}
            role="listbox"
            className="absolute right-0 bottom-11 z-50 w-60 origin-bottom-right rounded-xl border border-line bg-[#2a2a2a] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <p className="px-3 pt-1.5 pb-1 text-[12px] text-faint">Model</p>
            {models.map((m) => (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={m.id === current.id}
                onClick={() => {
                  setModel(m.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-hover"
              >
                <m.Mark className="size-4 shrink-0 text-soft" />
                <span className="min-w-0">
                  <span className="block text-[14px] text-fg">{m.name}</span>
                  <span className="block text-[12px] text-muted">
                    {m.vendor}
                  </span>
                </span>
                {m.id === current.id && (
                  <Check className="ml-auto size-4 text-fg" strokeWidth={2} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
