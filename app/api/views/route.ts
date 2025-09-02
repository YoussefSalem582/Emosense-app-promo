import { NextResponse } from "next/server"

// Fallback counter for when Vercel Analytics is not available
let fallbackViewCount = Number.parseInt(process.env.INITIAL_VIEW_COUNT || "1")

// Try to get Vercel Analytics data directly
async function getVercelAnalytics() {
  try {
    const VERCEL_PROJECT_ID = "v0-emo-sense-app-promo"
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID
    const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN

    if (!VERCEL_ACCESS_TOKEN) {
      console.log("Vercel access token not available")
      return null
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
      return null
    }

    const data = await response.json()

    // Sum up all page views
    const totalViews =
      data.pageViews?.reduce((total: number, item: any) => {
        return total + (item.views || 0)
      }, 0) || 0

    return Math.max(0, totalViews)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return null
  }
}

export async function GET() {
  try {
    // Try to get Vercel Analytics data
    const analyticsViews = await getVercelAnalytics()

    if (analyticsViews !== null && analyticsViews > 0) {
      return NextResponse.json({
        views: analyticsViews,
        source: "vercel-analytics",
        period: "30-days",
      })
    }

    // Fallback to local counter
    return NextResponse.json({
      views: Math.max(1, fallbackViewCount),
      source: "fallback",
    })
  } catch (error) {
    console.error("Views API error:", error)
    return NextResponse.json({
      views: 1,
      source: "error",
    })
  }
}

export async function POST() {
  try {
    // For POST requests, we'll increment the fallback counter
    // The real analytics will be tracked by Vercel automatically
    fallbackViewCount += 1

    return NextResponse.json({
      views: Math.max(1, fallbackViewCount),
      source: "fallback-incremented",
    })
  } catch (error) {
    console.error("Views POST error:", error)
    return NextResponse.json({
      views: 1,
      source: "error",
    })
  }
}
