import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "frontend-bff",
    status: "ok",
  });
}
