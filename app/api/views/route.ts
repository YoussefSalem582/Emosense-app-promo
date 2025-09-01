import { NextResponse } from "next/server"

// Simple in-memory counter that persists during the session
// This will reset when the server restarts, but works immediately without setup
let viewCount = 1 // Start with 1 to show activity

export async function GET() {
  return NextResponse.json({ views: viewCount })
}

export async function POST() {
  viewCount += 1
  return NextResponse.json({ views: viewCount })
}
