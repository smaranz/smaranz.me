"use client";

import { ArrowUp, CircleAlert, Mic, Plus, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ModelPicker } from "./ModelPicker";
import { popUp } from "./motion";
import { Waveform } from "./Waveform";

const suggestions = [
  "What has Smaran built?",
  "Tell me about Slates",
  "What is CodeStarters?",
  "What happened at FBLA?",
  "Why work with a 15-year-old?",
];

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const noop = () => () => {};

function recognitionCtor() {
  const w = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const hasRecognition = () => recognitionCtor() !== undefined;

function getRecognition(): Recognition | null {
  const Ctor = recognitionCtor();
  return Ctor ? new Ctor() : null;
}

export function Composer({
  onSubmit,
  onStop,
  busy = false,
  placeholder = "Ask anything about Smaran",
  autoFocus = false,
}: {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  busy?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const canDictate = useSyncExternalStore(noop, hasRecognition, () => false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const recognition = useRef<Recognition | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [text]);

  useEffect(() => {
    if (autoFocus && window.matchMedia("(pointer: fine)").matches)
      ref.current?.focus();
  }, [autoFocus]);

  function submit(value = text) {
    const v = value.trim();
    if (!v || busy) return;
    onSubmit(v);
    setText("");
  }

  function toggleDictation() {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const r = getRecognition();
    if (!r) return;
    const base = text ? `${text} ` : "";
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      const spoken = Array.from(e.results)
        .map((res) => res[0].transcript)
        .join("");
      setText(base + spoken);
    };
    r.onend = () => setListening(false);
    recognition.current = r;
    setListening(true);
    r.start();
  }

  const iconBtn =
    "grid size-9 place-items-center rounded-full text-soft transition hover:bg-[#3a3a3a]";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-[26px] bg-raised shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)]"
    >
      <label htmlFor="composer" className="sr-only">
        Message
      </label>
      <textarea
        id="composer"
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        maxLength={1000}
        placeholder={listening ? "Listening…" : placeholder}
        className="block w-full resize-none bg-transparent px-5 pt-4 pb-3 text-[16px] leading-6 text-fg placeholder:text-faint focus:outline-none"
      />
      <div className="flex items-center gap-1 px-2.5 pb-2.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Suggested questions"
            aria-expanded={menuOpen}
            className={iconBtn}
          >
            <Plus className="size-5" strokeWidth={1.75} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                {...popUp}
                className="absolute bottom-11 left-0 z-50 w-64 origin-bottom-left rounded-xl border border-line bg-[#2a2a2a] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              >
                <p className="px-3 pt-1.5 pb-1 text-[12px] text-faint">
                  Suggested
                </p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      submit(s);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-[14px] text-soft hover:bg-hover hover:text-fg"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {listening ? (
            <Waveform key="wave" />
          ) : (
            <motion.span
              key="access"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              title="This agent can only read Smaran's public profile."
              className="ml-1 inline-flex items-center gap-1.5 text-[15px] whitespace-nowrap text-orange"
            >
              <CircleAlert
                className="size-[15px]"
                strokeWidth={1.75}
                aria-hidden
              />
              Read-only access
            </motion.span>
          )}
        </AnimatePresence>
        <div className="ml-auto flex items-center gap-1">
          <ModelPicker dimmed={listening} />
          {canDictate && (
            <button
              type="button"
              onClick={toggleDictation}
              aria-label={listening ? "Stop dictation" : "Dictate"}
              aria-pressed={listening}
              className={`relative ${iconBtn} ${listening ? "bg-red/15 text-red hover:bg-red/25" : ""}`}
            >
              {listening && (
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-red/20 [animation-duration:1.6s]"
                  aria-hidden
                />
              )}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={listening ? "stop" : "mic"}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  {listening ? (
                    <Square className="size-3.5 fill-current" />
                  ) : (
                    <Mic className="size-[18px]" strokeWidth={1.75} />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          )}
          {busy ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              className="grid size-9 place-items-center rounded-full bg-blue text-white transition hover:brightness-110 active:scale-95"
            >
              <Square className="size-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Send"
              disabled={!text.trim()}
              className="grid size-9 place-items-center rounded-full bg-blue text-white transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:hover:brightness-100"
            >
              <ArrowUp className="size-[18px]" strokeWidth={2.25} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
