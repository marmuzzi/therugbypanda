import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/rugby-panda-logo.png?v=7", "https://therugbypanda.ie"), 308);
}
