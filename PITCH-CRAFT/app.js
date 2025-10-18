const SUPABASE_URL = "https://eemagvauvidoqtzupiiz.supabase.co";
const  SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbWFndmF1dmlkb3F0enVwaWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODc2ODIsImV4cCI6MjA3NjM2MzY4Mn0.AMl3hItaUXl6nsecv3r8mljrlt79Bf-RU0aNAxW5XCI";


const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

console.log(supabase);


