"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "./motion";

// Launch screen, like the Codex app: the mark draws itself over a blurred window, then clears.
// Rendered on the server too, so the app never flashes in before it.
export function Splash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const t = setTimeout(() => setShow(false), reduced ? 150 : 1350);
    return () => clearTimeout(t);
  }, []);

  const draw = (delay: number, duration: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, duration, ease },
        opacity: { delay, duration: 0.01 },
      },
    },
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
          className="fixed inset-0 z-[90] grid place-items-center bg-bg/85 backdrop-blur-2xl"
          aria-hidden
        >
          <motion.svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="#b5b5b5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[60px]"
            exit={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(6px)",
              transition: { duration: 0.35, ease },
            }}
          >
            <motion.rect
              x="6"
              y="10"
              width="52"
              height="44"
              rx="14"
              {...draw(0.05, 0.75)}
            />
            <motion.path d="M21 26l7 6-7 6" {...draw(0.55, 0.3)} />
            <motion.path
              d="M33 39h10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, 1, 1, 0.15, 1],
                transition: {
                  pathLength: { delay: 0.8, duration: 0.2, ease },
                  opacity: {
                    delay: 0.8,
                    duration: 0.5,
                    times: [0, 0.05, 0.5, 0.75, 1],
                  },
                },
              }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
