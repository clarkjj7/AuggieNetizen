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
var incidents = [
    {
        type: "Medical",
        location: "Near Christensen Center",
        description: "Medical assistance requested on campus.",
        time: "2026-04-14T11:20:00",
        coords: [44.9670, -93.2450],
        icon: medicalIcon
    },
    {
        type: "Suspicious Activity",
        location: "Near Urness Hall",
        description: "Reported suspicious person in the area.",
        time: "2026-04-14T10:45:00",
        coords: [44.9670, -93.2440],
        icon: suspiciousIcon
    },
    {
        type: "Fire",
        location: "Near Science Hall",
        description: "Fire alarm incident reported.",
        time: "2026-04-14T09:30:00",
        coords: [44.9670, -93.2430],
        icon: fireIcon
    },
    {
        type: "Break-In",
        location: "Near Parking Lot",
        description: "Possible break-in reported.",
        time: "2026-04-13T11:15:00",
        coords: [44.9670, -93.2420],
        icon: breakinIcon
    },
    {
        type: "Accident",
        location: "Near Foss Center",
        description: "Vehicle accident reported nearby.",
        time: "2026-04-13T08:10:00",
        coords: [44.9670, -93.2410],
        icon: accidentIcon
    },
    {
        type: "Other",
        location: "Near Old Main",
        description: "General campus safety report submitted.",
        time: "2026-04-12T06:50:00",
        coords: [44.9670, -93.2460],
        icon: otherIcon
    }
];

/* sort incidents so the most recent incidents are first */
incidents.sort(function(a, b) {
    return new Date(b.time) - new Date(a.time);
});

/* now we add the icon to the map's location */
incidents.forEach(function(incident) {
    L.marker(incident.coords, {icon: incident.icon})
        .addTo(map)
        .bindPopup(
            "<strong>" + incident.type + "</strong><br>" +
            incident.location + "<br>" +
            incident.description
        );
});

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

    incidents.forEach(function(incident) {
        var card = document.createElement("div");
        card.className = "incident-card";

        card.innerHTML = `
            <div class="incident-top">
                <h4 class="incident-type">${incident.type}</h4>
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

renderIncidents();

// beginning of the javascript for the navigation on the button 
let nav = document.querySelector(".nav");
let navListItem = document.querySelectorAll(".nav__listitem");

//Bottom sheet js 
var bot = document.querySelector(".nearby-sheet");

bot.addEventListener("click", function () {
    this.classList.toggle("active");
});