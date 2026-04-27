// ── Import Supabase client from CDN (no npm needed for frontend) ──
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ── Connect to the shared Supabase database ──
const supabase = createClient(
  'https://tqdizldvweawdiynscot.supabase.co',  // project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZGl6bGR2d2Vhd2RpeW5zY290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzMwOTEsImV4cCI6MjA4ODkwOTA5MX0.Z6EEj9W-8QeTtbFgX1pmiiHVWJX_T2z6st_DGt9KJrM'  // public anon key
);

// ── Incident type selector ──
// When a user clicks an option (e.g. "Fire", "Suspicious Activity"),
// remove "selected" from all options and add it only to the clicked one
const options = document.querySelectorAll(".option");
options.forEach(opt => {
  opt.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
  });
});

// ── Submit button ──
// When clicked, grab all form values and insert a new row into Supabase
document.getElementById("submit").addEventListener("click", async () => {

  // Get the selected incident type from whichever option has "selected" class
  const type        = document.querySelector(".option.selected")?.dataset.type;

  // Get text field values from the form
  const title       = document.getElementById("title")?.value;
  const description = document.getElementById("description")?.value;
  const severity    = document.getElementById("severity")?.value;

  // Basic validation — type and title are required
  if (!type || !title) {
    alert("Please select a type and enter a title.");
    return;
  }

  // Insert the new incident into the "incidents" table in Supabase
  const { error } = await supabase
    .from('incidents')
    .insert([{ type, title, description, severity }]);

  // Show error if insert failed, otherwise confirm success
  if (error) {
    console.error(error);
    alert("Failed to submit report.");
  } else {
    alert("Report submitted!");
  }
});