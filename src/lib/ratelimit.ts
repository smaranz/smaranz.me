import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Three layers, checked in order. The per-visitor limits stop one person spamming;
// the site-wide daily cap stops many people (or one person on many IPs) draining the key.
const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT) || 400;

const rules: {
  name: string;
  scope: "visitor" | "site";
  limit: number;
  window: Duration;
  ms: number;
}[] = [
  {
    name: "burst",
    scope: "visitor",
    limit: 8,
    window: "10 m",
    ms: 10 * 60_000,
  },
  { name: "daily", scope: "visitor", limit: 30, window: "1 d", ms: 86_400_000 },
  {
    name: "site",
    scope: "site",
    limit: DAILY_LIMIT,
    window: "1 d",
    ms: 86_400_000,
  },
];

export type LimitResult =
  { ok: true } | { ok: false; scope: "visitor" | "site"; retryAfter: number };

// Durable counts when Upstash is configured (Vercel Marketplace sets KV_REST_API_*).
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const limiters = redis
  ? rules.map((r) => ({
      ...r,
      rl: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(r.limit, r.window),
        prefix: `chat:${r.name}`,
      }),
    }))
  : null;

// Fallback for local dev: per-process memory. Resets on restart and isn't shared across
// server instances, so production should run with Upstash configured.
const memory = new Map<string, number[]>();

function memoryHit(key: string, limit: number, ms: number) {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < ms);
  if (recent.length >= limit) return { success: false, reset: recent[0] + ms };
  recent.push(now);
  memory.set(key, recent);
  return { success: true, reset: now + ms };
}

export const durableLimits = Boolean(limiters);

export async function checkChatLimit(visitor: string): Promise<LimitResult> {
  for (const [i, r] of rules.entries()) {
    const key = r.scope === "site" ? "all" : visitor;
    const { success, reset } = limiters
      ? await limiters[i].rl.limit(key)
      : memoryHit(`${r.name}:${key}`, r.limit, r.ms);
    if (!success) {
      return {
        ok: false,
        scope: r.scope,
        retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
      };
    }
  }
  return { ok: true };
}
