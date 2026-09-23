import { agentMarkdown } from "@/content/agent";

export const dynamic = "force-static";

export function GET() {
  return new Response(agentMarkdown(true), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
