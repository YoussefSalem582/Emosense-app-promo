"use client"

import { useState, useEffect } from "react"

export function useViewCounter() {
  const [views, setViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleViews = async () => {
      try {
        const hasViewedThisSession = sessionStorage.getItem("emosense-session-viewed")

        if (!hasViewedThisSession) {
          // New session - increment view count
          try {
            const response = await fetch("/api/views", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })

            if (response.ok) {
              const data = await response.json()
              setViews(data.views)
              console.log(`Views incremented to: ${data.views} (source: ${data.source})`)

              // Mark this session as counted
              sessionStorage.setItem("emosense-session-viewed", "true")
            } else {
              console.error("POST request failed:", response.status)
              setViews(1)
              sessionStorage.setItem("emosense-session-viewed", "true")
            }
          } catch (postError) {
            console.error("POST request error:", postError)
            setViews(1)
            sessionStorage.setItem("emosense-session-viewed", "true")
          }
        } else {
          // Existing session - just get current count
          try {
            const response = await fetch("/api/views")

            if (response.ok) {
              const data = await response.json()
              setViews(data.views)
              console.log(`Current views: ${data.views} (source: ${data.source})`)
            } else {
              console.error("GET request failed:", response.status)
              setViews(1)
            }
          } catch (getError) {
            console.error("GET request error:", getError)
            setViews(1)
          }
        }
      } catch (error) {
        console.error("View counter error:", error)
        setViews(1)
      } finally {
        setLoading(false)
      }
    }

    handleViews()
  }, [])

  return { views, loading }
}
