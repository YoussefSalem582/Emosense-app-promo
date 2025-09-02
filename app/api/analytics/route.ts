import { NextResponse } from "next/server"

const VERCEL_PROJECT_ID = "v0-emo-sense-app-promo"
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID
const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN

export async function GET() {
  try {
    if (!VERCEL_ACCESS_TOKEN) {
      console.log("Vercel access token not available")
      return NextResponse.json({ views: 0, source: "no-token" })
    }

    // Calculate date range (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const params = new URLSearchParams({
      projectId: VERCEL_PROJECT_ID,
      since: startDate.toISOString(),
      until: endDate.toISOString(),
      ...(VERCEL_TEAM_ID && { teamId: VERCEL_TEAM_ID }),
    })

    const response = await fetch(`https://api.vercel.com/v1/analytics/page-views?${params}`, {
      headers: {
        Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Vercel Analytics API error:", response.status, response.statusText)
      return NextResponse.json({ views: 0, source: "api-error" })
    }

    const data = await response.json()

    // Sum up all page views
    const totalViews =
      data.pageViews?.reduce((total: number, item: any) => {
        return total + (item.views || 0)
      }, 0) || 0

    return NextResponse.json({
      views: Math.max(0, totalViews), // Ensure non-negative number
      source: "vercel-analytics",
      period: "30-days",
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ views: 0, source: "error" })
  }
}
