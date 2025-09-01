import { NextResponse } from "next/server"

// In a real app, you'd use a database. For demo purposes, we'll use a simple in-memory counter
// that resets when the server restarts. For production, use a database like Supabase, MongoDB, etc.
let viewCount = 0 // Starting fresh

export async function GET() {
  return NextResponse.json({ views: viewCount })
}

export async function POST() {
  viewCount += 1
  return NextResponse.json({ views: viewCount })
}
