import { agentJson } from "@/content/agent";

export const dynamic = "force-static";

export function GET() {
  return Response.json(agentJson(), {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
