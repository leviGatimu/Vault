import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Overseer Error: Supabase keys are missing from your .env file!")
}

// Add the exclamation marks !
export const supabase = createClient(supabaseUrl!, supabaseKey!)