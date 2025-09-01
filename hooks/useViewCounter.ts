"use client"

import { useState, useEffect } from "react"

export function useViewCounter() {
  const [views, setViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const incrementViews = async () => {
      try {
        // Check if this user has already been counted in this session
        const hasViewed = sessionStorage.getItem("emosense-viewed")

        if (!hasViewed) {
          // Increment the view count
          const response = await fetch("/api/views", {
            method: "POST",
          })
          const data = await response.json()
          setViews(data.views)

          // Mark this session as having viewed
          sessionStorage.setItem("emosense-viewed", "true")
        } else {
          // Just get the current count without incrementing
          const response = await fetch("/api/views")
          const data = await response.json()
          setViews(data.views)
        }
      } catch (error) {
        console.error("Error updating views:", error)
        setViews(0) // Fallback to 0
      } finally {
        setLoading(false)
      }
    }

    incrementViews()
  }, [])

  return { views, loading }
}
