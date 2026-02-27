import { NextRequest, NextResponse } from "next/server";
import { getSessionUsername } from "@/lib/session";

export async function GET(request: NextRequest) {
  const username = getSessionUsername(request);
  return NextResponse.json({ ok: true, username });
}
