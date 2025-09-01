import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize the views table and data
export async function initializeViewsTable() {
  try {
    // First, try to get existing data
    const { data: existingData, error: selectError } = await supabase
      .from("portfolio_views")
      .select("*")
      .eq("page_name", "emosense-app")
      .single()

    if (selectError && selectError.code === "PGRST116") {
      // Table doesn't exist or no data, try to insert initial record
      const { error: insertError } = await supabase
        .from("portfolio_views")
        .insert([{ page_name: "emosense-app", view_count: 0 }])

      if (insertError) {
        console.log("Table might not exist, will create on first API call")
      }
    }
  } catch (error) {
    console.log("Database initialization will happen on first API call")
  }
}
