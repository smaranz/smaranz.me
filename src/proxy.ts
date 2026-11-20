import { type NextRequest, NextResponse } from "next/server";

// The home page is an app that renders in the browser. Agents that ask for markdown
// or plain text (Accept: text/markdown or text/plain, without text/html) get the
// full profile instead of an empty app shell.
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  const wantsText =
    /text\/(markdown|plain)/.test(accept) && !accept.includes("text/html");
  if (wantsText) {
    return NextResponse.rewrite(new URL("/llms-full.txt", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
