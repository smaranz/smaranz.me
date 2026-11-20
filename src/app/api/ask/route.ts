import { generateText } from "ai";
import { getProject } from "@/content/profile";
import { MAX_INPUT_CHARS, MODEL, openrouter, systemPrompt } from "@/lib/agent";
import { checkChatLimit } from "@/lib/ratelimit";

// A plain, non-streaming door to the site agent for other AI agents and scripts:
//   GET  /api/ask?q=What+is+Slates%3F[&project=slates][&format=json]
//   POST /api/ask  {"q": "...", "project": "slates"}
// Answers come back as text/plain (or JSON with format=json / Accept: application/json).
// Same rate limits as the chat UI.

export const maxDuration = 30;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const USAGE = `Ask Smaran's site agent a question.

GET  /api/ask?q=<question>[&project=<slug>][&format=json]
POST /api/ask  {"q": "<question>", "project": "<slug>"}

Questions up to ${MAX_INPUT_CHARS} characters. The answer is plain text by default.
Static profile (no rate limit): /llms.txt, /llms-full.txt, /api/profile
`;

function reply(
  body: Record<string, unknown>,
  status: number,
  json: boolean,
  extra: Record<string, string> = {},
) {
  const headers = { ...cors, ...extra };
  if (json) return Response.json(body, { status, headers });
  const text =
    typeof body.answer === "string"
      ? body.answer
      : `${body.error}${body.message ? `: ${body.message}` : ""}`;
  return new Response(`${text}\n`, {
    status,
    headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function answer(
  req: Request,
  q: string | undefined,
  project: string | undefined,
  json: boolean,
) {
  if (!q?.trim()) {
    return new Response(USAGE, {
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  if (q.length > MAX_INPUT_CHARS) {
    return reply(
      { error: "too_long", message: `max ${MAX_INPUT_CHARS} characters` },
      413,
      json,
    );
  }
  if (!process.env.OPENROUTER_API_KEY || !MODEL) {
    return reply(
      { error: "offline", message: "the static profile is at /llms-full.txt" },
      503,
      json,
    );
  }

  const visitor =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  const limit = await checkChatLimit(visitor);
  if (!limit.ok) {
    return reply(
      { error: "rate_limited", retryAfter: limit.retryAfter },
      429,
      json,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const focus = project && getProject(project) ? project : undefined;
  const { text } = await generateText({
    model: openrouter.chatModel(MODEL),
    instructions: `${systemPrompt(focus)}

You are answering another program or AI agent through a plain API, not the chat UI. There are no project cards: when you mention a project, include its link.`,
    prompt: q,
    maxOutputTokens: 600,
  });
  return reply({ question: q, answer: text.trim() }, 200, json);
}

const wantsJson = (req: Request, format: string | null) =>
  format === "json" ||
  (req.headers.get("accept") ?? "").includes("application/json");

export async function GET(req: Request) {
  const url = new URL(req.url);
  return answer(
    req,
    url.searchParams.get("q") ?? undefined,
    url.searchParams.get("project") ?? undefined,
    wantsJson(req, url.searchParams.get("format")),
  );
}

export async function POST(req: Request) {
  const body: { q?: unknown; question?: unknown; project?: unknown } = await req
    .json()
    .catch(() => ({}));
  const q = typeof body.q === "string" ? body.q : body.question;
  return answer(
    req,
    typeof q === "string" ? q : undefined,
    typeof body.project === "string" ? body.project : undefined,
    wantsJson(req, new URL(req.url).searchParams.get("format")),
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}
