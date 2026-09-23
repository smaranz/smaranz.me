"use client";

import { motion, type Transition, type Variants } from "motion/react";

// One easing curve for the whole site: quick start, long soft landing.
export const ease = [0.22, 1, 0.36, 1] as const;
export const spring: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.9,
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Item({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

// Menus and popovers: a small scale-and-fade from the edge they are anchored to.
export const pop = {
  initial: { opacity: 0, scale: 0.97, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease } },
  exit: { opacity: 0, scale: 0.98, y: -2, transition: { duration: 0.1 } },
};

export const popUp = {
  initial: { opacity: 0, scale: 0.97, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease } },
  exit: { opacity: 0, scale: 0.98, y: 2, transition: { duration: 0.1 } },
};
