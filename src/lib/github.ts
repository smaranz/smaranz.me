// Reads the public GitHub contribution calendar (the same fragment github.com renders),
// so no token is needed. Private contributions appear only if enabled on the profile.

export type Day = { date: string; level: number; count: number };
export type Contributions = { total: number; weeks: (Day | null)[][] };

const USER = "smaranz";

export async function getContributions(): Promise<Contributions> {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": "smaranz.me" },
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const html = await res.text();

  // Exact counts live in the tooltips, keyed by the cell id they describe.
  const counts = new Map<string, number>();
  for (const m of html.matchAll(
    /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
  )) {
    const n = m[2].match(/^([\d,]+) contribution/);
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  // Cell ids are contribution-day-component-{weekday}-{week}.
  const grid = new Map<number, (Day | null)[]>();
  for (const m of html.matchAll(
    /<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g,
  )) {
    const tag = m[0];
    const id = tag.match(/id="(contribution-day-component-(\d+)-(\d+))"/);
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    if (!id || !date) continue;
    const [, cellId, weekday, week] = id;
    const col = grid.get(Number(week)) ?? Array<Day | null>(7).fill(null);
    col[Number(weekday)] = { date, level, count: counts.get(cellId) ?? 0 };
    grid.set(Number(week), col);
  }

  const weeks = [...grid.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, col]) => col);
  const total = weeks.flat().reduce((sum, d) => sum + (d?.count ?? 0), 0);
  if (!weeks.length)
    throw new Error("Could not read the contribution calendar");
  return { total, weeks };
}
