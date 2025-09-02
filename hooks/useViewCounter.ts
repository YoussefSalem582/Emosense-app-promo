"use client"

import { useState, useEffect } from "react"

export function useViewCounter() {
  const [views, setViews] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<string>("loading")

  useEffect(() => {
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

        // Ensure we always have a valid number
        const viewCount = typeof data.views === "number" && !isNaN(data.views) ? data.views : 1

        setViews(Math.max(1, viewCount))
        setSource(data.source || "unknown")

        console.log(`Views: ${viewCount} (source: ${data.source})`)

        if (data.period) {
          console.log(`Period: ${data.period}`)
        }
      } catch (error) {
        console.error("View counter error:", error)
        setViews(1)
        setSource("error")
      } finally {
        setLoading(false)
      }
    }

    fetchViews()

    // Refresh analytics data every 5 minutes
    const interval = setInterval(fetchViews, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { views, loading, source }
}
