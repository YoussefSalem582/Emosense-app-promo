"use client"

import { useState, useEffect } from "react"

export function useViewCounter() {
  const [views, setViews] = useState<number>(17)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<string>("loading")

  useEffect(() => {
    const incrementViewForSession = async () => {
      // Check if this session has already been counted
      const sessionKey = "emosense_view_counted"
      const hasViewedThisSession = sessionStorage.getItem(sessionKey)

      if (!hasViewedThisSession) {
        try {
          // Increment the view count for this new session
          const response = await fetch("/api/views", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            console.log("View incremented:", data)

            // Mark this session as counted
            sessionStorage.setItem(sessionKey, "true")
          }
        } catch (error) {
          console.error("Failed to increment view:", error)
        }
      }
    }

    const fetchViews = async () => {
      try {
        const response = await fetch("/api/views", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON")
        }

        const data = await response.json()
        const viewCount = typeof data.views === "number" && !isNaN(data.views) ? data.views : 17

        setViews(Math.max(17, viewCount)) // Ensure minimum of 17
        setSource(data.source || "unknown")

        // Log Web Analytics status
        if (data.source === "vercel-web-analytics") {
          console.log(`✅ Vercel Web Analytics: ${viewCount} views (${data.period})`)
        } else {
          console.log(`📊 Live Counter: ${viewCount} views (${data.note || "fallback"})`)
        }
      } catch (error) {
        console.error("View counter error:", error)
        setViews(17)
        setSource("error")
      } finally {
        setLoading(false)
      }
    }

    // First increment view for new sessions, then fetch current count
    incrementViewForSession().then(() => {
      fetchViews()
    })

    // Refresh data every 5 minutes to check for Web Analytics updates
    const interval = setInterval(fetchViews, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { views, loading, source }
}
