# smaranz.me

The personal site of **Smaran Aramballi Sandarsh**, built as a clone of the Codex desktop app. Visitors chat with an agent that knows everything about me, browse my projects as threads, and explore the stack.

**Live:** https://smaranz.me

## What's in it

- **Agent chat:** streams answers grounded only on my profile, with project cards it can open. Rate limited per visitor and site-wide.
- **Codex-style shell:** sidebar with projects as folders, ⌘K search, back/forward history, shareable URLs for every page, a launch animation, and a model picker.
- **Project threads:** every project opens as a conversation with its poster, summary, highlights, and what's still being built.
- **Stack:** derived from the projects themselves, so each tool links to where it's actually used.
- **Agent-readable:** `/llms.txt`, `/llms-full.txt`, `/api/profile`, and schema.org JSON-LD, all generated from the same content file.

All content lives in [`src/content/profile.ts`](src/content/profile.ts). Change it there and the UI, the agent, and the agent-readable endpoints update together.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · AI SDK · OpenRouter · Upstash Redis (rate limits)

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

| Variable | Needed for |
| --- | --- |
| `OPENROUTER_API_KEY` | The chat agent |
| `OPENROUTER_MODEL` | Which OpenRouter model the agent uses |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Durable rate limits (Vercel's Upstash integration sets `KV_REST_API_*`, which also works) |
| `CHAT_DAILY_LIMIT` | Optional site-wide daily message cap (default 400) |

Without an OpenRouter key the site still works; the chat shows an offline notice.

## License

The code is MIT licensed; see [LICENSE](LICENSE). My photo, project logos, posters, and written content are not covered by that license. Please don't reuse them as your own.

Tool icons come from [Simple Icons](https://simpleicons.org) (CC0).
