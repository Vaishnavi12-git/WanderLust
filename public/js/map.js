const coordinates = [
    listing.geometry.coordinates[1], // latitude
    listing.geometry.coordinates[0], // longitude
];

const map = L.map("map").setView(coordinates, 13);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

L.marker(coordinates)
    .addTo(map)
    .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
    .openPopup();