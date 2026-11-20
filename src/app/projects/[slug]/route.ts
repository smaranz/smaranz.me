import { projectMarkdown } from "@/content/agent";
import { projects } from "@/content/profile";

// One markdown page per project, for agents: /projects/slates (or /projects/slates.md).

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.flatMap((p) => [{ slug: p.slug }, { slug: `${p.slug}.md` }]);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const md = projectMarkdown(slug.replace(/\.md$/, ""));
  if (!md) return new Response("Not found\n", { status: 404 });
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
