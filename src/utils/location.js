import L from 'leaflet';

let selectedLocation = null;

export function initMap() {
   const peta = L.map('map').setView([-6.597147, 106.806038], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(peta);

  let penanda = null;

  peta.on('click', function (event) {
    const { lat, lng } = event.latlng;

    if (penanda) {
      peta.removeLayer(penanda);
    }

    penanda = L.marker([lat, lng]).addTo(peta)
      .bindPopup(`Latitude: ${lat.toFixed(5)}<br>Longitude: ${lng.toFixed(5)}`)
      .openPopup();

    selectedLocation = { lat, lng };

     const inputLat = document.getElementById('latInput');
    const inputLng = document.getElementById('lngInput');
    if (inputLat && inputLng) {
      inputLat.value = lat.toFixed(5);
      inputLng.value = lng.toFixed(5);
    }
  });
}

export function getSelectedLocation() {
  return selectedLocation;
}
