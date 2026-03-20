import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ffpefnfhoegusxwoyeqn.supabase.co',  // paste your URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcGVmbmZob2VndXN4d295ZXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTY4NTUsImV4cCI6MjA4ODU5Mjg1NX0.xtYdvYYeFuBQ88tdofvKSv1rmfdKQKrROFT3okExp-w'                       // paste your anon key
)

export default supabase