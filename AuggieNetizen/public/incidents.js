// ── Import Supabase client from CDN (no npm needed for frontend) ──
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ── Connect to the shared Supabase database ──
const supabase = createClient(
  'https://tqdizldvweawdiynscot.supabase.co',  // project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZGl6bGR2d2Vhd2RpeW5zY290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzMwOTEsImV4cCI6MjA4ODkwOTA5MX0.Z6EEj9W-8QeTtbFgX1pmiiHVWJX_T2z6st_DGt9KJrM'  // public anon key
);

// ── Load a single incident from Supabase and display it on the page ──
async function loadIncident() {

  // Read the ?id=X value from the current page URL
  // Example: incidents.html?id=3 → id = "3"
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') ?? 1; // fallback to id 1 if none provided

  // Fetch the matching incident row from Supabase
  const { data, error } = await supabase
    .from('incidents')  // target the incidents table
    .select('*')        // get all columns
    .eq('id', id)       // where id matches the URL param
    .single();          // expect only one result

  // If something went wrong, log it and stop
  if (error || !data) {
    console.error(error);
    alert('Could not load incident.');
    return;
  }

  // ── Populate the page with the fetched incident data ──

  // Format the type: "suspicious_activity" → "SUSPICIOUS ACTIVITY"
  document.getElementById("type").textContent =
    data.type.replace("_", " ").toUpperCase();

  document.getElementById("title").textContent       = data.title;
  document.getElementById("address").textContent     = data.address;
  document.getElementById("description").textContent = data.description;

  // Show severity and status in uppercase for visual clarity
  document.getElementById("severity").textContent =
    data.severity.toUpperCase();

  document.getElementById("status").textContent =
    data.status.toUpperCase();

  document.getElementById("upvotes").textContent = data.upvotes;
}

// ── Run the function when the page loads ──
loadIncident();