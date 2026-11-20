import { experience, profile, projects } from "./profile";
import { tools } from "./tools";

// Plain-text views of the profile for AI agents and crawlers (llms.txt convention).

export const siteUrl = `https://${profile.domain}`;

const link = (href: string) =>
  href.startsWith("mailto:") ? href.slice(7) : href;

export function agentMarkdown(full: boolean) {
  const lines: string[] = [];
  lines.push(`# ${profile.name}`, "");
  lines.push(`> ${profile.headline}`, "");
  lines.push(...profile.bio.flatMap((b) => [b, ""]));
  lines.push(
    `- Age: ${profile.age}`,
    `- School: ${profile.school}`,
    `- Location: ${profile.location}`,
    `- Email: ${profile.email}`,
    ...profile.links
      .filter((l) => !l.href.startsWith("mailto:"))
      .map((l) => `- ${l.label}: ${link(l.href)}`),
    "",
  );

  lines.push("## Experience", "");
  for (const e of experience) {
    lines.push(
      `### ${e.org}: ${e.role} (${e.when})`,
      ...e.points.map((p) => `- ${p}`),
      "",
    );
  }

  lines.push("## Projects", "");
  for (const p of projects) {
    lines.push(`### ${p.name}`, "", p.tagline, "");
    if (full) {
      lines.push(...p.summary, "");
      lines.push("Highlights:", ...p.highlights.map((h) => `- ${h}`), "");
      if (p.next?.length)
        lines.push("Still being built:", ...p.next.map((n) => `- ${n}`), "");
    }
    lines.push(
      `- Role: ${p.role}`,
      `- Stack: ${p.stack.join(", ")}`,
      ...p.links.map((l) => `- ${l.label}: ${link(l.href)}`),
    );
    lines.push(`- Details: ${siteUrl}/projects/${p.slug}`);
    lines.push("");
  }

  lines.push("## Stack", "");
  for (const t of tools)
    lines.push(
      `- ${t.name} (${t.category}): used in ${t.projects.map((p) => p.name).join(", ")}`,
    );
  lines.push("");

  lines.push("## For agents", "");
  lines.push(
    `- Short profile: ${siteUrl}/llms.txt`,
    `- Full profile: ${siteUrl}/llms-full.txt`,
    `- JSON: ${siteUrl}/api/profile`,
    `- One project as markdown: ${siteUrl}/projects/<slug> (${projects.map((p) => p.slug).join(", ")})`,
    `- Ask the site agent a question: GET ${siteUrl}/api/ask?q=<question> (plain text; add &format=json for JSON, &project=<slug> to focus on one project). POST {"q": "..."} also works. Rate limited.`,
    `- Requesting ${siteUrl}/ with Accept: text/markdown returns the full profile.`,
    `- To contact Smaran, email ${profile.email}.`,
    "",
  );
  return lines.join("\n");
}

export function projectMarkdown(slug: string) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return undefined;
  return [
    `# ${p.name}`,
    "",
    `> ${p.tagline}`,
    "",
    `A project by ${profile.name} (${siteUrl}). Role: ${p.role}.`,
    "",
    ...p.summary.flatMap((s) => [s, ""]),
    "## Highlights",
    "",
    ...p.highlights.map((h) => `- ${h}`),
    "",
    ...(p.next?.length
      ? ["## Still being built", "", ...p.next.map((n) => `- ${n}`), ""]
      : []),
    "## Stack",
    "",
    p.stack.join(", "),
    "",
    "## Links",
    "",
    ...p.links.map((l) => `- ${l.label}: ${link(l.href)}`),
    `- On the site: ${siteUrl}/#/${p.slug}`,
    `- Ask about it: ${siteUrl}/api/ask?project=${p.slug}&q=<question>`,
    "",
  ].join("\n");
}

export function agentJson() {
  return {
    name: profile.name,
    headline: profile.headline,
    age: profile.age,
    school: profile.school,
    location: profile.location,
    email: profile.email,
    bio: profile.bio,
    links: profile.links,
    experience,
    projects: projects.map((p) => ({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      role: p.role,
      summary: p.summary,
      highlights: p.highlights,
      stillBeingBuilt: p.next ?? [],
      stack: p.stack,
      links: p.links,
      url: `${siteUrl}/#/${p.slug}`,
      markdown: `${siteUrl}/projects/${p.slug}`,
    })),
    agentApi: {
      ask: `${siteUrl}/api/ask?q=<question>`,
      markdown: [`${siteUrl}/llms.txt`, `${siteUrl}/llms-full.txt`],
    },
    stack: tools.map((t) => ({
      name: t.name,
      category: t.category,
      usedIn: t.projects.map((p) => p.name),
    })),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.short,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}/smaran.png`,
    description: profile.headline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cupertino",
      addressRegion: "CA",
      addressCountry: "US",
    },
    affiliation: { "@type": "HighSchool", name: profile.school },
    memberOf: [
      {
        "@type": "Organization",
        name: "CodeStarters",
        url: "https://codestarters.org",
        roleName: "Founder & President",
      },
    ],
    sameAs: profile.links
      .filter((l) => l.href.startsWith("http"))
      .map((l) => l.href),
    knowsAbout: tools.slice(0, 15).map((t) => t.name),
    owns: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      description: p.tagline,
      url: p.links[0]?.href,
      subjectOf: `${siteUrl}/projects/${p.slug}`,
    })),
    subjectOf: [
      { "@type": "WebPage", url: `${siteUrl}/llms-full.txt`, encodingFormat: "text/markdown" },
      { "@type": "WebAPI", url: `${siteUrl}/api/ask`, description: "Ask Smaran's site agent a question: GET /api/ask?q=<question>" },
    ],
  };
}
