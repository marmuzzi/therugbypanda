import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/favicon.svg?v=8", "https://therugbypanda.ie"), 308);
}
