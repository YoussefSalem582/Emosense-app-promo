"use client"

import { Users } from "lucide-react"
import { useViewCounter } from "@/hooks/useViewCounter"

export function ViewCounter() {
  const { views, loading, source } = useViewCounter()

  const isWebAnalytics = source === "vercel-web-analytics"
  const isLiveCounter = source === "live-counter" || source === "incremented"

  // Ensure views is always a valid number
  const safeViews = typeof views === "number" && !isNaN(views) ? views : 17

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-gray-800 hover:bg-gray-800 transition-colors">
        {isWebAnalytics ? (
          <>
            <span>📊</span>
            <span>Page Views</span>
            <span className="bg-blue-600 px-2 py-1 rounded-full text-xs font-bold">
              {loading ? "..." : safeViews.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">analytics</span>
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            <span>Visitors</span>
            <span className="bg-green-600 px-2 py-1 rounded-full text-xs font-bold">
              {loading ? "..." : safeViews.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">live</span>
          </>
        )}
      </div>
    </div>
  )
}
