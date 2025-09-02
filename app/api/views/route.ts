import { NextResponse } from "next/server"

// Persistent counter that starts from current analytics count
let persistentViewCount = 17

// Get Vercel Web Analytics data using the correct API
async function getVercelWebAnalytics() {
  try {
    const VERCEL_ACCESS_TOKEN = process.env.VERCEL_ACCESS_TOKEN
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

    if (!VERCEL_ACCESS_TOKEN) {
      console.log("Vercel access token not available")
      return null
    }

    console.log("Using Vercel Web Analytics API...")

    // Calculate date range (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    // Vercel Web Analytics API endpoints to try
    const webAnalyticsAttempts = [
      // Web Analytics Stats API
      {
        url: "https://api.vercel.com/v1/web-analytics/stats",
        params: {
          projectId: "v0-emo-sense-app-promo",
          since: Math.floor(startDate.getTime() / 1000).toString(),
          until: Math.floor(endDate.getTime() / 1000).toString(),
          ...(VERCEL_TEAM_ID && { teamId: VERCEL_TEAM_ID }),
        },
      },
      // Web Analytics Events API
      {
        url: "https://api.vercel.com/v1/web-analytics/events",
        params: {
          projectId: "v0-emo-sense-app-promo",
          since: Math.floor(startDate.getTime() / 1000).toString(),
          until: Math.floor(endDate.getTime() / 1000).toString(),
          event: "pageview",
          ...(VERCEL_TEAM_ID && { teamId: VERCEL_TEAM_ID }),
        },
      },
      // Alternative with domain
      {
        url: "https://api.vercel.com/v1/web-analytics/stats",
        params: {
          domain: "emosense-app-links.vercel.app",
          since: Math.floor(startDate.getTime() / 1000).toString(),
          until: Math.floor(endDate.getTime() / 1000).toString(),
          ...(VERCEL_TEAM_ID && { teamId: VERCEL_TEAM_ID }),
        },
      },
    ]

    for (const attempt of webAnalyticsAttempts) {
      try {
        const params = new URLSearchParams(attempt.params)
        const fullUrl = `${attempt.url}?${params}`

        console.log("Trying Vercel Web Analytics endpoint:", fullUrl)

        const response = await fetch(fullUrl, {
          headers: {
            Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        })

        console.log("Web Analytics API Response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("Web Analytics Response:", JSON.stringify(data, null, 2))

          let totalViews = 0

          // Parse Vercel Web Analytics response formats
          if (data.stats && data.stats.pageviews) {
            totalViews = data.stats.pageviews
          } else if (data.pageviews) {
            totalViews = data.pageviews
          } else if (data.events && Array.isArray(data.events)) {
            totalViews = data.events.length
          } else if (data.total) {
            totalViews = data.total
          } else if (data.views) {
            totalViews = data.views
          } else if (data.data && data.data.pageviews) {
            totalViews = data.data.pageviews
          }

          console.log("Extracted Web Analytics views:", totalViews)

          if (totalViews > 0) {
            // Update persistent counter to match analytics if higher
            if (totalViews > persistentViewCount) {
              persistentViewCount = totalViews
            }
            return totalViews
          }
        } else {
          const errorText = await response.text()
          console.log(`Web Analytics API ${response.status} Error:`, errorText)
        }
      } catch (attemptError) {
        console.error("Web Analytics attempt failed:", attemptError)
        continue
      }
    }

    console.log("All Vercel Web Analytics attempts failed")
    return null
  } catch (error) {
    console.error("Vercel Web Analytics fetch error:", error)
    return null
  }
}

export async function GET() {
  try {
    // Try to get Vercel Web Analytics data first
    const webAnalyticsViews = await getVercelWebAnalytics()

    if (webAnalyticsViews !== null && webAnalyticsViews > 0) {
      console.log("Using Vercel Web Analytics data:", webAnalyticsViews)
      return NextResponse.json({
        views: webAnalyticsViews,
        source: "vercel-web-analytics",
        period: "30-days",
        api: "web-analytics",
      })
    }

    // Fallback to persistent counter
    console.log("Using persistent counter:", persistentViewCount)
    return NextResponse.json({
      views: persistentViewCount,
      source: "live-counter",
      note: "Vercel Web Analytics not available, using live counter",
    })
  } catch (error) {
    console.error("Views API error:", error)
    return NextResponse.json({
      views: persistentViewCount,
      source: "error-fallback",
    })
  }
}

export async function POST() {
  try {
    // Increment the persistent counter for new sessions
    persistentViewCount += 1

    console.log("View count incremented to:", persistentViewCount)

    return NextResponse.json({
      views: persistentViewCount,
      source: "incremented",
      message: "New visitor session counted",
    })
  } catch (error) {
    console.error("Views POST error:", error)
    return NextResponse.json({
      views: persistentViewCount,
      source: "error",
    })
  }
}
