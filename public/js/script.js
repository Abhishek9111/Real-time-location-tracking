const socket = io();

let myLocation = null;
const otherLocations = {};
let polyline = null; //storing the polyline
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      myLocation = { latitude, longitude };
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => {
      console.log("error", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

const map = L.map("map").setView([0, 0], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Abhishek's map",
}).addTo(map);

const markers = {};

socket.on("receive-location", function (data) {
  const { id, latitude, longitude } = data;
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  otherLocations[id] = { latitude, longitude };
});

socket.on("disconnected", function (id) {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    delete otherLocations[id];
  }
});
function addPolyLine() {
  const ids = Object.keys(otherLocations);
  if (myLocation && ids.length > 0) {
    const otherLocation = otherLocations[ids[0]];
  }
  const latlngs = [
    [myLocation.latitude, myLocation.longitude],
    [otherLocation.latitude, otherLocation.longitude],
  ];
  if (polyline) {
    map.removeLayer(polyline);
  }

  polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
}
