/* this stores every incident from the backend */
var allIncidents = [];
/* this keeps track of what filter button is selected */
var activeFilter = "all";

/* pick the right icon based on incident type */
function getIconPath(type) {
    var iconMap = {
        car_accident: "images/accident.png",
        break_in: "images/breakin.png",
        fire: "images/fire.png",
        suspicious_activity: "images/suspicious.png",
        medical: "images/medical.png",
        other: "images/other.png"
    };

    if (iconMap[type]) {
        return iconMap[type];
    }

    return "images/other.png";
}

/* status text in the feed cards */
function statusLabel(status) {
    if (status === "resolved") {
        return "clear";
    }

    return "active";
}

/* makes the time look like 3m, 2h, etc */
function timeAgo(dateString) {
    var now = Date.now();
    var then = new Date(dateString).getTime();
    var diffMs = now - then;
    if (diffMs < 0) {
        diffMs = 0;
    }

    var mins = Math.floor(diffMs / 60000);
    var hours = Math.floor(mins / 60);
    var days = Math.floor(hours / 24);

    if (mins < 1) {
        return "now";
    }

    if (mins < 60) {
        return mins + "m";
    }

    if (hours < 24) {
        return hours + "h";
    }

    return days + "d";
}

/* render all incidents in the feed list */
function renderFeed() {
    var feedList = document.getElementById("feedList");
    var filtered = [];
    var i;

    for (i = 0; i < allIncidents.length; i++) {
        if (activeFilter === "all" || allIncidents[i].type === activeFilter) {
            filtered.push(allIncidents[i]);
        }
    }

    if (filtered.length === 0) {
        feedList.innerHTML = '<div class="empty-state">No incidents in this category yet.</div>';
        return;
    }

    var cardsHtml = "";

    for (i = 0; i < filtered.length; i++) {
        var item = filtered[i];
        var status = statusLabel(item.status);
        cardsHtml += `
        <article class="feed-item">
            <img class="feed-icon" src="${getIconPath(item.type)}" alt="${item.type}">
            <div>
                <div class="feed-meta">
                    <span class="status-pill ${status}">${status}</span>
                    <span class="feed-time">${timeAgo(item.created_at)}</span>
                </div>
                <h3 class="feed-title">${item.title || "Incident"}</h3>
                <p class="feed-description">${item.description || "No description provided."}</p>
            </div>
        </article>
        `;
    }

    feedList.innerHTML = cardsHtml;
}

/* update active filter and re-render list */
function setFilter(filterKey) {
    activeFilter = filterKey;

    var buttons = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].dataset.filter === filterKey) {
            buttons[i].classList.add("active");
        } else {
            buttons[i].classList.remove("active");
        }
    }

    renderFeed();
}

/* connect filter buttons to click events */
function setupFilters() {
    var buttons = document.querySelectorAll(".filter-btn");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            setFilter(this.dataset.filter);
        });
    }
}

/* get incidents from backend and show in feed */
function loadFeed() {
    fetch("/incidents")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Could not fetch incidents");
            }

            return response.json();
        })
        .then(function(payload) {
            if (Array.isArray(payload.incidents)) {
                allIncidents = payload.incidents;
            } else {
                allIncidents = [];
            }

            allIncidents.sort(function(a, b) {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            renderFeed();
        })
        .catch(function() {
            document.getElementById("feedList").innerHTML = '<div class="empty-state">Could not load incidents right now.</div>';
        });
}

/* start the feed page */
setupFilters();
loadFeed();