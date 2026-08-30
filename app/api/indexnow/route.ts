import { NextResponse } from "next/server";

const INDEXNOW_KEY = "80dc8ebd32db4635b47853a1775f9b3e";
const HOST = "www.toolvoraa.com";
const KEY_LOCATION =
  "https://www.toolvoraa.com/80dc8ebd32db4635b47853a1775f9b3e.txt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const urls: string[] = Array.isArray(body.urls)
      ? body.urls
      : body.url
        ? [body.url]
        : [];

    if (urls.length === 0) {
      return NextResponse.json(
        { error: "No URLs provided" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    return NextResponse.json({
      success: response.ok,
      indexNowStatus: response.status,
      submittedUrls: urls,
    });
  } catch {
    return NextResponse.json(
      { error: "IndexNow submission failed" },
      { status: 500 }
    );
  }
}