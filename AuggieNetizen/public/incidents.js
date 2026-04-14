// ===== SIMULATED DATA (replace with API later) =====
const incident = {
    id: 1,
    type: "suspicious_activity",
    title: "Suspicious person near Murphy Square",
    description: "Individual in all-black near bike racks for 20+ min.",
    address: "Murphy Square Park, Minneapolis MN",
    severity: "high",
    status: "active",
    upvotes: 14
};


// ===== LOAD DATA INTO PAGE =====
document.getElementById("type").textContent =
    incident.type.replace("_", " ").toUpperCase();

document.getElementById("title").textContent = incident.title;
document.getElementById("address").textContent = incident.address;
document.getElementById("description").textContent = incident.description;

document.getElementById("severity").textContent =
    incident.severity.toUpperCase();

document.getElementById("status").textContent =
    incident.status.toUpperCase();

document.getElementById("upvotes").textContent = incident.upvotes;


// ===== UPVOTE BUTTON =====
const upvoteBtn = document.getElementById("upvote-btn");

upvoteBtn.addEventListener("click", () => {
    incident.upvotes++;
    document.getElementById("upvotes").textContent = incident.upvotes;
});