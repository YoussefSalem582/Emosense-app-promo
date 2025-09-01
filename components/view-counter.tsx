"use client"

import { Eye } from "lucide-react"
import { useViewCounter } from "@/hooks/useViewCounter"

export function ViewCounter() {
  const { views, loading } = useViewCounter()

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border border-gray-800 hover:bg-gray-800 transition-colors">
        <Eye className="w-4 h-4" />
        <span>Views</span>
        <span className="bg-gray-800 px-2 py-1 rounded-full text-xs font-bold">
          {loading ? "..." : views.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
