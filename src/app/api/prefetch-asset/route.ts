import { NextResponse } from "next/server";

/** Server-side GET to warm an asset URL — avoids browser CORS on cross-origin fetch. */
export async function POST(req: Request) {
  let url: string | undefined;
  try {
    const body = (await req.json()) as { url?: string };
    url = typeof body.url === "string" ? body.url : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!url?.startsWith("http://") && !url?.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid url." }, { status: 400 });
  }

  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Asset responded with ${res.status}.` },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to fetch asset." }, { status: 502 });
  }
}
