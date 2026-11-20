import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { getProject, projects } from "@/content/profile";
import {
  MAX_HISTORY,
  MAX_INPUT_CHARS,
  MODEL,
  openrouter,
  systemPrompt,
} from "@/lib/agent";
import { checkChatLimit } from "@/lib/ratelimit";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY || !MODEL) {
    return Response.json({ error: "offline" }, { status: 503 });
  }

  const { messages, focus }: { messages: UIMessage[]; focus?: string } =
    await req.json().catch(() => ({ messages: [] }));
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Reject oversized pastes before they cost anything or count against the visitor.
  const latest = messages.at(-1);
  const latestText =
    latest?.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ?? "";
  if (latestText.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: "too_long", max: MAX_INPUT_CHARS },
      { status: 413 },
    );
  }

  // Vercel sets x-real-ip from the connection; it can't be spoofed by the client.
  const visitor =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  const limit = await checkChatLimit(visitor);
  if (!limit.ok) {
    return Response.json(
      {
        error: "rate_limited",
        scope: limit.scope,
        retryAfter: limit.retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // Cap history and per-message size so a long chat can't get expensive.
  const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({
    ...m,
    parts: m.parts.map((p) =>
      p.type === "text" ? { ...p, text: p.text.slice(0, MAX_INPUT_CHARS) } : p,
    ),
  }));

  const result = streamText({
    model: openrouter.chatModel(MODEL),
    instructions: systemPrompt(focus),
    messages: await convertToModelMessages(trimmed),
    maxOutputTokens: 600,
    stopWhen: isStepCount(3),
    tools: {
      open_project: {
        description:
          "Show a project card in the chat so the visitor can open it.",
        inputSchema: z.object({
          slug: z.enum(projects.map((p) => p.slug) as [string, ...string[]]),
        }),
        execute: async ({ slug }: { slug: string }) => {
          const p = getProject(slug)!;
          return {
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            stack: p.stack,
          };
        },
      },
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
