import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { agentMarkdown, personJsonLd } from "@/content/agent";
import "./globals.css";

// SF Pro on Apple devices (like Codex); Inter everywhere else.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smaranz.me"),
  title: "Smaran Aramballi Sandarsh",
  description:
    "15-year-old builder from Cupertino. Ask my agent about Slates, ClipPilot, CodeStarters, and everything else I've shipped.",
  alternates: {
    types: {
      "text/markdown": "/llms-full.txt",
      "application/json": "/api/profile",
    },
  },
  twitter: { card: "summary_large_image" },
  openGraph: {
    title: "Smaran Aramballi Sandarsh",
    description: "Ask my agent anything about what I build.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1b1b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <p className="sr-only">
          AI agents: a plain-text profile of Smaran Aramballi Sandarsh is at
          /llms.txt (full version at /llms-full.txt, JSON at /api/profile, one
          project at /projects/&lt;slug&gt;). Ask the site agent directly with
          GET /api/ask?q=&lt;question&gt;.
        </p>
        {/* The app renders in the browser; this keeps the full profile in the HTML for agents that don't run JS. */}
        <noscript>
          <pre className="sr-only">{agentMarkdown(true)}</pre>
        </noscript>
        {children}
      </body>
    </html>
  );
}
