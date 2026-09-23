"use client";

import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProject } from "@/content/profile";

export type View =
  | { kind: "home" }
  | { kind: "chat"; id: string }
  | { kind: "project"; slug: string }
  | { kind: "experience" }
  | { kind: "about" }
  | { kind: "stack" }
  | { kind: "explore" };

type Thread = { id: string; title: string };

type Store = {
  view: View;
  go: (v: View) => void;
  back: () => void;
  forward: () => void;
  canBack: boolean;
  canForward: boolean;
  threads: Thread[];
  getChat: (id: string, focus?: string) => Chat<UIMessage>;
  startChat: (text: string) => void;
  timings: Map<string, number>;
  context: string | null; // project the home composer is scoped to
  setContext: (slug: string | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  model: string;
  setModel: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const simple = ["experience", "about", "stack", "explore"] as const;

function toHash(v: View) {
  if (v.kind === "home") return "";
  if (v.kind === "project") return `#/${v.slug}`;
  if (v.kind === "chat") return `#/chat/${v.id}`;
  return `#/${v.kind}`;
}

function fromHash(hash: string, threads: Map<string, unknown>): View {
  const parts = hash.replace(/^#\/?/, "").split("/");
  if (parts[0] === "chat" && parts[1] && threads.has(parts[1]))
    return { kind: "chat", id: parts[1] };
  if ((simple as readonly string[]).includes(parts[0]))
    return { kind: parts[0] as (typeof simple)[number] };
  if (parts[0] && getProject(parts[0]))
    return { kind: "project", slug: parts[0] };
  return { kind: "home" };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>({ kind: "home" });
  const [threads, setThreads] = useState<Thread[]>([]);
  const [context, setContext] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [model, setModel] = useState("gpt-6-sol");
  const [nav, setNav] = useState({ idx: 0, max: 0 });
  // Chats live outside React state so switching threads keeps streams and history intact.
  const [chats] = useState(() => new Map<string, Chat<UIMessage>>());
  const [timings] = useState(() => new Map<string, number>());

  useEffect(() => {
    history.replaceState({ idx: 0 }, "", location.pathname + location.hash);
    // The URL is external state; read it once after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(fromHash(location.hash, chats));
    const onPop = (e: PopStateEvent) => {
      const idx = (e.state as { idx?: number } | null)?.idx ?? 0;
      setNav((n) => ({ idx, max: Math.max(n.max, idx) }));
      setView(fromHash(location.hash, chats));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [chats]);

  const getChat = useCallback(
    (id: string, focus?: string) => {
      let chat = chats.get(id);
      if (!chat) {
        chat = new Chat<UIMessage>({
          id,
          transport: new DefaultChatTransport({
            api: "/api/chat",
            body: focus ? { focus } : undefined,
          }),
        });
        chats.set(id, chat);
      }
      return chat;
    },
    [chats],
  );

  const go = useCallback((v: View) => {
    const idx = ((history.state as { idx?: number } | null)?.idx ?? 0) + 1;
    history.pushState({ idx }, "", toHash(v) || location.pathname);
    setNav({ idx, max: idx });
    setView(v);
    setDrawerOpen(false);
    setPaletteOpen(false);
  }, []);

  const startChat = useCallback(
    (text: string) => {
      const id = crypto.randomUUID().slice(0, 8);
      setThreads((t) => [{ id, title: text.slice(0, 60) }, ...t]);
      getChat(id, context ?? undefined).sendMessage({ text });
      go({ kind: "chat", id });
    },
    [getChat, go, context],
  );

  const value = useMemo(
    () => ({
      view,
      go,
      back: () => history.back(),
      forward: () => history.forward(),
      canBack: nav.idx > 0,
      canForward: nav.idx < nav.max,
      threads,
      getChat,
      startChat,
      timings,
      context,
      setContext,
      drawerOpen,
      setDrawerOpen,
      paletteOpen,
      setPaletteOpen,
      model,
      setModel,
    }),
    [
      view,
      go,
      nav,
      threads,
      getChat,
      startChat,
      timings,
      context,
      drawerOpen,
      paletteOpen,
      model,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
