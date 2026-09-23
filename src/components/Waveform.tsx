"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ease } from "./motion";

const BARS = 36;

// Live mic level while dictating. Bars are driven straight from an AnalyserNode in a rAF loop
// (no React renders per frame). If mic access fails, the bars fall back to a gentle idle wave.
export function Waveform() {
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let raf = 0;
    let stream: MediaStream | null = null;
    let audio: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let data: Uint8Array<ArrayBuffer> | null = null;
    let cancelled = false;
    const levels = new Array(BARS).fill(0.08);
    const start = performance.now();

    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        audio = new AudioContext();
        analyser = audio.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        audio.createMediaStreamSource(s).connect(analyser);
        data = new Uint8Array(analyser.frequencyBinCount);
      })
      .catch(() => {});

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      let level = 0;
      if (analyser && data) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        level = Math.min(1, Math.sqrt(sum / data.length) * 4.5);
      }
      // Newest level enters on the right and scrolls left, like a recording meter.
      levels.shift();
      levels.push(
        analyser
          ? Math.max(0.08, level)
          : 0.3 + 0.22 * Math.sin(t * 6) * Math.sin(t * 1.7),
      );
      bars.current.forEach((el, i) => {
        if (!el) return;
        const edge = Math.min(1, (i + 1) / 6, (BARS - i) / 6); // taper both ends
        el.style.transform = `scaleY(${Math.max(0.08, levels[i] * edge)})`;
        el.style.opacity = String(0.35 + levels[i] * 0.65);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = setInterval(
      () => setSeconds(Math.floor((performance.now() - start) / 1000)),
      250,
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
      audio?.close();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="ml-1 flex min-w-0 items-center gap-3"
      aria-live="polite"
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-fg/60" />
        <span className="relative size-2 rounded-full bg-fg" />
      </span>
      <div className="flex h-6 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              bars.current[i] = el;
            }}
            className="h-6 w-[2px] origin-center rounded-full bg-fg will-change-transform"
            style={{ transform: "scaleY(0.08)" }}
          />
        ))}
      </div>
      <span className="font-mono text-[13px] text-muted tabular-nums">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </span>
      <span className="sr-only">Listening</span>
    </motion.div>
  );
}
