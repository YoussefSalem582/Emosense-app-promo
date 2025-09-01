import { NextResponse } from "next/server"

// Simple fallback storage that works immediately
let fallbackViewCount = 1

// Try to use Supabase if available, otherwise use fallback
async function getSupabaseViews() {
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not available")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("portfolio_views")
      .select("view_count")
      .eq("page_name", "emosense-app")
      .single()

    if (error) throw error
    return data?.view_count || 0
  } catch (error) {
    console.log("Supabase not available, using fallback:", error)
    return null
  }
}

async function incrementSupabaseViews() {
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not available")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try to get current count first
    const { data: currentData } = await supabase
      .from("portfolio_views")
      .select("view_count")
      .eq("page_name", "emosense-app")
      .single()

    if (currentData) {
      // Update existing record
      const newCount = currentData.view_count + 1
      const { data, error } = await supabase
        .from("portfolio_views")
        .update({ view_count: newCount })
        .eq("page_name", "emosense-app")
        .select("view_count")
        .single()

      if (error) throw error
      return data?.view_count || newCount
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("portfolio_views")
        .insert([{ page_name: "emosense-app", view_count: 1 }])
        .select("view_count")
        .single()

      if (error) throw error
      return data?.view_count || 1
    }
  } catch (error) {
    console.log("Supabase increment failed, using fallback:", error)
    return null
  }
}

export async function GET() {
  try {
    // Try Supabase first
    const supabaseViews = await getSupabaseViews()
    if (supabaseViews !== null) {
      return NextResponse.json({ views: supabaseViews, source: "database" })
    }

    // Fallback to local counter
    return NextResponse.json({ views: fallbackViewCount, source: "fallback" })
  } catch (error) {
    console.error("GET /api/views error:", error)
    return NextResponse.json({ views: fallbackViewCount, source: "fallback" })
  }
}

export async function POST() {
  try {
    // Try Supabase first
    const supabaseViews = await incrementSupabaseViews()
    if (supabaseViews !== null) {
      // Sync fallback with database value
      fallbackViewCount = supabaseViews
      return NextResponse.json({ views: supabaseViews, source: "database" })
    }

    // Fallback to local counter
    fallbackViewCount += 1
    return NextResponse.json({ views: fallbackViewCount, source: "fallback" })
  } catch (error) {
    console.error("POST /api/views error:", error)
    fallbackViewCount += 1
    return NextResponse.json({ views: fallbackViewCount, source: "fallback" })
  }
}
