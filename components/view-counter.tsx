"use client"

import { Eye, TrendingUp } from "lucide-react"
import { useViewCounter } from "@/hooks/useViewCounter"

export function ViewCounter() {
  const { views, loading, source } = useViewCounter()

  const isAnalytics = source === "vercel-analytics"

  // Ensure views is always a valid number
  const safeViews = typeof views === "number" && !isNaN(views) ? views : 1

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-gray-800 hover:bg-gray-800 transition-colors">
        {isAnalytics ? <TrendingUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span>Views</span>
        <span className="bg-gray-800 px-2 py-1 rounded-full text-xs font-bold">
          {loading ? "..." : safeViews.toLocaleString()}
        </span>
        {isAnalytics && <span className="text-xs text-gray-400 ml-1">30d</span>}
      </div>
    </div>
  )
}
