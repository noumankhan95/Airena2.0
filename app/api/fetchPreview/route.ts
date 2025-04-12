import { NextRequest, NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const previewData = await getLinkPreview(targetUrl);

    return NextResponse.json(previewData, { status: 200 });
  } catch (error) {
    //@ts-ignore
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
