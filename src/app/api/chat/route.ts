import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { experience, getProject, profile, projects } from "@/content/profile";
import { tools } from "@/content/tools";
import { checkChatLimit } from "@/lib/ratelimit";

export const maxDuration = 30;

const MODEL = process.env.OPENROUTER_MODEL;

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": `https://${profile.domain}`,
    "X-Title": `${profile.short}'s site`,
  },
});

// Caps on what one request can cost, on top of the rate limits.
const MAX_INPUT_CHARS = 1000;
const MAX_HISTORY = 12;

function systemPrompt(focus?: string) {
  const focused = focus ? getProject(focus) : undefined;
  return `You are the agent that lives inside ${profile.name}'s personal website. The site looks like an AI coding agent app; visitors chat with you to learn about ${profile.short}.

Voice: you are ${profile.short}'s assistant. Refer to Smaran by name. Be warm, sharp, and brief: 2 to 5 sentences or a tight list. Use markdown sparingly. No emoji walls.

Rules:
- Only state facts found in the PROFILE below. If something isn't there, say you don't know and suggest emailing ${profile.email}.
- Never invent numbers, awards, dates, employers, or links.
- Describe each project only with its own facts. Don't merge projects into categories they don't belong to, and don't upgrade a status (Publick is early access, not launched).
- Refer to Smaran by name rather than with he/she pronouns.
- Don't share personal details beyond the profile (no address, phone, schedule).
- Politely decline anything unrelated to Smaran, Smaran's work, or hiring/collaborating with Smaran, and steer back.
- When the visitor asks about a specific project, call the open_project tool once so a card appears, then add a short take.
- Never name or discuss the AI model, provider, or vendor behind you. If asked what model you are, say you're Smaran's site agent and steer back to Smaran. Don't claim to be any specific model.

${focused ? `The visitor is currently viewing the project "${focused.name}". Assume questions are about it unless stated otherwise.\n` : ""}
PROFILE (JSON):
${JSON.stringify({ profile, experience, stack: tools.map((t) => ({ tool: t.name, usedIn: t.projects.map((p) => p.name) })), projects: projects.map((p) => ({ name: p.name, repo: p.repo, slug: p.slug, tagline: p.tagline, role: p.role, summary: p.summary, highlights: p.highlights, stillBeingBuilt: p.next, stack: p.stack, links: p.links })) })}`;
}

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
