var options = document.querySelectorAll(".option");
var submitButton = document.getElementById("submit");

// Keep incident type selection reliable.
options.forEach(function(option) {
  option.addEventListener("click", function() {
    options.forEach(function(item) {
      item.classList.remove("selected");
    });
    option.classList.add("selected");
  });
});

submitButton.addEventListener("click", async function () {

  // Get the selected incident type from whichever option has "selected" class
  var selectedTypeOption = document.querySelector(".option.selected");
  var type = selectedTypeOption ? selectedTypeOption.dataset.type : "";

  // Get text field values from the form
  var titleInput = document.getElementById("title");
  var descriptionInput = document.getElementById("description");
  var severitySelect = document.getElementById("severity");
  var locationSelect = document.getElementById("locationSelect");
  var selectedOption = locationSelect ? locationSelect.options[locationSelect.selectedIndex] : null;

  var title = titleInput ? titleInput.value.trim() : "";
  var description = descriptionInput ? descriptionInput.value.trim() : "";
  var severity = severitySelect ? severitySelect.value : "medium";

  // Basic validation — type and title are required
  if (!type || !title) {
    alert("Please select a type and enter a title.");
    return;
  }

  if (!selectedOption || !selectedOption.value) {
    alert("Please choose a location.");
    return;
  }

  var lat = selectedOption.dataset.lat ? Number(selectedOption.dataset.lat) : null;
  var lng = selectedOption.dataset.lng ? Number(selectedOption.dataset.lng) : null;
  var address = selectedOption.value;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    alert("Please choose a mapped location.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "SUBMITTING...";

  // Insert the new incident into the "incidents" table in Supabase
  try {
    var response = await fetch("/incidents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type,
        title: title,
        description: description,
        severity: severity,
        address: address,
        lat: lat,
        lng: lng
      })
    });

    var payload = await response.json();

    submitButton.disabled = false;
    submitButton.textContent = "SUBMIT REPORT";

    if (!response.ok) {
      console.error(payload);
      alert(payload.error || "Failed to submit report.");
      return;
    }

    var params = new URLSearchParams();
    params.set("submitted", "1");
    if (payload && payload.id) {
      params.set("incident", payload.id);
    }

    window.location.href = "map.html?" + params.toString();
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "SUBMIT REPORT";
    console.error(error);
    if (window.location.protocol === "file:") {
      alert("Could not reach server. Open this page at http://localhost:3030/report.html (not as a local file).");
      return;
    }
    alert("Could not reach server. Make sure server.js is running on port 3030.");
  }
});