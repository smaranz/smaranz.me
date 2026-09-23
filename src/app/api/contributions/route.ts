import { getContributions } from "@/lib/github";

export const revalidate = 21600; // six hours

export async function GET() {
  try {
    return Response.json(await getContributions());
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
