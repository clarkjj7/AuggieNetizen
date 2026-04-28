//the supabase server


/* created the map  from leaflet https://leafletjs.com/examples/quick-start/ */
/* different types of tile layers maps here: https://leaflet-extras.github.io/leaflet-providers/preview/ */

var map = L.map('map').setView([44.9670, -93.2400], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/*adding markers for the events happening on campus */

//this is the creation of the icon (fire)
//how to create icons and use them https://leafletjs.com/examples/custom-icons/

//icon class so we can create all the icons 
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [38, 50],
        iconAnchor: [22, 94],
        //popupAnchor:  [-3, -76] dont need for now 
    }
});

//make all the icons 
var accidentIcon = new LeafIcon({iconUrl: 'images/accident.png'}),
    breakinIcon = new LeafIcon({iconUrl: 'images/breakin.png'}), //change to break_in
    fireIcon = new LeafIcon({iconUrl: 'images/fire.png'}),
    suspiciousIcon = new LeafIcon({iconUrl: 'images/suspicious.png'}), //change to suspicous acitvity 
    medicalIcon = new LeafIcon({iconUrl: 'images/medical.png'}),
    otherIcon = new LeafIcon({iconUrl: 'images/other.png'});

/* recent incident data */
/* newest ones should show first in the bottom sheet */
var incidents = [];
var markersLayer = L.layerGroup().addTo(map);

function toTitleCase(value) {
    return String(value || "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, function(match) {
            return match.toUpperCase();
        });
}

function getIncidentIcon(type) {
    var iconMap = {
        car_accident: accidentIcon,
        break_in: breakinIcon,
        fire: fireIcon,
        suspicious_activity: suspiciousIcon,
        medical: medicalIcon,
        other: otherIcon
    };

    return iconMap[type] || otherIcon;
}

function normalizeIncident(incident) {
    return {
        id: incident.id,
        type: incident.type || "other",
        title: incident.title || toTitleCase(incident.type || "other"),
        description: incident.description || "No description provided.",
        location: incident.address || "Augsburg University",
        time: incident.created_at || new Date().toISOString(),
        coords: [Number(incident.lat), Number(incident.lng)],
        icon: getIncidentIcon(incident.type)
    };
}

/* now we add the icon to the map's location */
function renderMarkers() {
    markersLayer.clearLayers();

    incidents.forEach(function(incident) {
        L.marker(incident.coords, {icon: incident.icon})
            .addTo(markersLayer)
            .bindPopup(
                "<strong>" + incident.title + "</strong><br>" +
                incident.location + "<br>" +
                incident.description
            );
    });
}

/* render incidents inside the bottom sheet */
function formatIncidentTime(dateString) {
    var date = new Date(dateString);

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function renderIncidents() {
    var incidentList = document.getElementById("incidentList");
    incidentList.innerHTML = "";

    incidents.slice(0, 5).forEach(function(incident) {
        var card = document.createElement("div");
        card.className = "incident-card";

        card.innerHTML = `
            <div class="incident-top">
                <h4 class="incident-type">${incident.title}</h4>
                <span class="incident-time">${formatIncidentTime(incident.time)}</span>
            </div>
            <p class="incident-location">${incident.location}</p>
            <p class="incident-description">${incident.description}</p>
        `;

        card.addEventListener("click", function(event) {
            event.stopPropagation();
            map.setView(incident.coords, 17);
        });

        incidentList.appendChild(card);
    });
}

function loadIncidents() {
    fetch("/incidents")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Could not fetch incidents");
            }
            return response.json();
        })
        .then(function(payload) {
            var incidentRows = Array.isArray(payload.incidents) ? payload.incidents : [];

            incidents = incidentRows
                .map(normalizeIncident)
                .filter(function(incident) {
                    return !Number.isNaN(incident.coords[0]) && !Number.isNaN(incident.coords[1]);
                })
                .sort(function(a, b) {
                    return new Date(b.time) - new Date(a.time);
                });

            renderMarkers();
            renderIncidents();
        })
        .catch(function(error) {
            console.error("Error loading incidents:", error);
        });
}

loadIncidents();

//Bottom sheet js 
var bot = document.querySelector(".nearby-sheet");

bot.addEventListener("click", function () {
    this.classList.toggle("active");
});