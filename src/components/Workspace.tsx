"use client";

import { Check, Folder, Menu, Share } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { getProject } from "@/content/profile";
import { ease } from "./motion";
import { Palette } from "./Palette";
import { Splash } from "./Splash";
import { Sidebar, WindowControls } from "./Sidebar";
import { StoreProvider, useStore, type View } from "./store";
import {
  AboutView,
  ChatView,
  ExperienceView,
  ExploreView,
  HomeView,
  ProjectView,
  StackView,
} from "./views";

export function Workspace() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <Shell />
        <Palette />
        <Splash />
      </StoreProvider>
    </MotionConfig>
  );
}

function titleFor(view: View, threads: { id: string; title: string }[]) {
  switch (view.kind) {
    case "home":
      return "";
    case "chat":
      return threads.find((t) => t.id === view.id)?.title ?? "Chat";
    case "project":
      return getProject(view.slug)?.name ?? "Project";
    default:
      return view.kind[0].toUpperCase() + view.kind.slice(1);
  }
}

function Shell() {
  const { view, threads, drawerOpen, setDrawerOpen } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [shared, setShared] = useState(false);
  const viewKey =
    view.kind === "chat"
      ? view.id
      : view.kind === "project"
        ? view.slug
        : view.kind;
  const title = titleFor(view, threads);

  return (
    <div className="flex h-dvh w-full">
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{ width: 300, transition: { duration: 0.32, ease } }}
            exit={{ width: 0, transition: { duration: 0.26, ease } }}
            className="hidden shrink-0 overflow-hidden border-r border-black/40 bg-sidebar md:block"
          >
            <div className="h-full w-[300px]">
              <Sidebar onToggleSidebar={() => setCollapsed(true)} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] bg-sidebar md:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`flex h-12 shrink-0 items-center gap-3 pr-3 ${title ? "border-b border-line-soft" : ""} ${collapsed ? "pl-4 md:pl-0" : "pl-4"}`}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="-ml-1 grid size-8 place-items-center rounded-md text-muted hover:bg-hover md:hidden"
          >
            <Menu className="size-5" strokeWidth={1.75} />
          </button>
          {collapsed && (
            <div className="hidden md:block">
              <WindowControls onToggleSidebar={() => setCollapsed(false)} />
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {title && (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -4 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.22, ease },
                }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
                className="flex min-w-0 items-center gap-3"
              >
                <Folder
                  className="hidden size-[18px] shrink-0 text-muted sm:block"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h2 className="truncate text-[16px]">{title}</h2>
              </motion.div>
            )}
          </AnimatePresence>
          {view.kind !== "home" && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShared(true);
                setTimeout(() => setShared(false), 1500);
              }}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[15px] text-muted transition hover:bg-hover hover:text-fg"
            >
              {shared ? (
                <Check className="size-4" strokeWidth={1.75} />
              ) : (
                <Share className="size-4" strokeWidth={1.75} />
              )}
              {shared ? "Copied" : "Share"}
            </button>
          )}
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease },
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="h-full"
            >
              <CurrentView view={view} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function CurrentView({ view }: { view: View }) {
  switch (view.kind) {
    case "home":
      return <HomeView />;
    case "chat":
      return <ChatView id={view.id} />;
    case "project":
      return <ProjectView slug={view.slug} />;
    case "experience":
      return <ExperienceView />;
    case "about":
      return <AboutView />;
    case "stack":
      return <StackView />;
    case "explore":
      return <ExploreView />;
  }
}
