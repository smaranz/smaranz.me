"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Contributions as Data, Day } from "@/lib/github";
import { Github } from "./icons";
import { ease } from "./motion";

const LEVELS = ["#2a2a2a", "#0e4429", "#006d32", "#26a641", "#39d353"];
const CELL = 11;
const GAP = 3;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function formatDay(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function monthLabels(weeks: (Day | null)[][]) {
  const labels: { col: number; text: string }[] = [];
  let last = -1;
  weeks.forEach((week, col) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = new Date(`${first.date}T12:00:00`).getMonth();
    if (month !== last) {
      if (col < weeks.length - 2)
        labels.push({
          col,
          text: new Date(`${first.date}T12:00:00`).toLocaleDateString("en-US", {
            month: "short",
          }),
        });
      last = month;
    }
  });
  return labels;
}

export function Contributions() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/contributions")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Data) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  // Start scrolled to the most recent weeks on narrow screens.
  useEffect(() => {
    if (data && scroller.current)
      scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [data]);

  if (failed) return null;

  const weeks =
    data?.weeks ??
    Array.from({ length: 53 }, () => Array<Day | null>(7).fill(null));
  const width = weeks.length * (CELL + GAP) - GAP;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Github className="size-4 text-muted" />
        <p className="text-[15px] text-fg">
          {data ? (
            <>
              <span className="tabular-nums">
                {data.total.toLocaleString()}
              </span>{" "}
              contributions in the last year
            </>
          ) : (
            <span className="text-muted">Loading contributions…</span>
          )}
        </p>
        <a
          href="https://github.com/smaranz"
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex items-center gap-1 text-[13px] text-muted transition hover:text-fg"
        >
          smaranz
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <div
        ref={scroller}
        className="relative overflow-x-auto px-4 pt-3 pb-3"
        onMouseLeave={() => setTip(null)}
      >
        <div className="flex gap-2" style={{ width: width + 32 }}>
          <div
            className="flex shrink-0 flex-col pt-[18px] text-[10px] text-faint"
            style={{ gap: GAP }}
          >
            {DAY_LABELS.map((d, i) => (
              <span key={i} style={{ height: CELL, lineHeight: `${CELL}px` }}>
                {d}
              </span>
            ))}
          </div>
          <div>
            <div
              className="relative mb-1 h-[14px] text-[10px] text-faint"
              style={{ width }}
            >
              {data &&
                monthLabels(weeks).map((m) => (
                  <span
                    key={m.col}
                    className="absolute"
                    style={{ left: m.col * (CELL + GAP) }}
                  >
                    {m.text}
                  </span>
                ))}
            </div>
            <motion.div
              className="flex"
              style={{ gap: GAP }}
              initial={{ opacity: 0 }}
              animate={{ opacity: data ? 1 : 0.4 }}
              transition={{ duration: 0.5, ease }}
            >
              {weeks.map((week, col) => (
                <div key={col} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((day, row) => (
                    <span
                      key={row}
                      className="rounded-[3px] transition-transform hover:scale-125"
                      style={{
                        width: CELL,
                        height: CELL,
                        background: day ? LEVELS[day.level] : "transparent",
                        outline: day
                          ? "1px solid rgba(255,255,255,0.03)"
                          : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!day) return;
                        const box = e.currentTarget.getBoundingClientRect();
                        const host = scroller.current!.getBoundingClientRect();
                        setTip({
                          x:
                            box.left -
                            host.left +
                            scroller.current!.scrollLeft +
                            CELL / 2,
                          y: box.top - host.top,
                          text: `${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`,
                        });
                      }}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        {tip && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-[#3a3a3a] px-2 py-1 text-[12px] whitespace-nowrap text-fg shadow-lg"
            style={{ left: tip.x, top: tip.y - 6 }}
          >
            {tip.text}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-1.5 px-4 pb-3 text-[11px] text-faint">
        Less
        {LEVELS.map((c) => (
          <span
            key={c}
            className="rounded-[3px]"
            style={{ width: CELL, height: CELL, background: c }}
          />
        ))}
        More
      </div>
    </div>
  );
}
