// ===== GET ELEMENTS =====
const tabs = document.querySelectorAll(".tabs span");
const messagesContainer = document.getElementById("messages-container");
const editBtn = document.getElementById("edit-btn");


// ===== Filler to get replaced later =====
const messagesData = [
    {
        name: "Campus Police",
        text: "Please avoid the north parking lot.",
        time: "1m",
        color: "red",
        initials: "CP"
    },
    {
        name: "Security Office",
        text: "Report received. Thank you.",
        time: "5m",
        color: "blue",
        initials: "SO"
    }
];

const activityData = [
    {
        name: "Report Submitted",
        text: "Suspicious activity near library",
        time: "10m",
        color: "red",
        initials: "R"
    }
];

const savedData = [
    {
        name: "Saved Alert",
        text: "Theft reported near dorms",
        time: "1h",
        color: "blue",
        initials: "S"
    }
];


// ===== RENDER FUNCTION =====
function renderData(data) {
    messagesContainer.innerHTML = ""; // clear old content

    data.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("message");

        div.innerHTML = `
            <div class="icon ${item.color}">${item.initials}</div>
            <div class="text">
                <h4>${item.name}</h4>
                <p>${item.text}</p>
            </div>
            <span class="time">${item.time}</span>
        `;

        messagesContainer.appendChild(div);
    });
}


// ===== TAB SWITCHING =====
tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // remove active class
        tabs.forEach(t => t.classList.remove("active"));

        // add active to clicked tab
        tab.classList.add("active");

        // change content based on tab
        const tabText = tab.textContent;

        if (tabText === "Messages") {
            renderData(messagesData);
        } else if (tabText === "Activity") {
            renderData(activityData);
        } else if (tabText === "Saved") {
            renderData(savedData);
        }
    });
});


// ===== EDIT BUTTON =====
editBtn.addEventListener("click", () => {
    alert("Edit profile coming soon!");
});


// ===== LOAD DEFAULT (messages on page load) =====
renderData(messagesData);