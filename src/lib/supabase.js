import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials
const SUPABASE_URL = 'https://ganrbipdbyzrmzecbesb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbnJiaXBkYnl6cm16ZWNiZXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzQzNDgsImV4cCI6MjA2Nzg1MDM0OH0.ynq8K5n9IBi-4XbQmAg1dDd-FEsmouZzGvk3bjYlPJ0'

// Validate credentials are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials')
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase