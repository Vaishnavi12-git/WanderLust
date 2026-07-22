const map = L.map('map').setView([18.5204, 73.8567], 13);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom:19,
        attribution:'&copy; OpenStreetMap contributors'
    }
).addTo(map);

L.marker([18.5204,73.8567])
.addTo(map)
.bindPopup("Pune")
.openPopup();