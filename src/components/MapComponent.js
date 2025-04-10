import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Ensure you have this CSS

const MapComponent = () => {
  useEffect(() => {
    // Only initialize the map once
    if (!window.map) {
      // Create a new map if it doesn't already exist
      const map = L.map("map").setView([51.505, -0.09], 13); // Coordinates for London

      // Store the map instance in a global variable to check in subsequent renders
      window.map = map;

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add initial marker
      const marker = L.marker([51.505, -0.09]).addTo(map);
      marker.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

      // Handle map click event to update marker location
      map.on("click", (e) => {
        const latlng = e.latlng;
        marker.setLatLng(latlng);
        alert("New location: " + latlng.lat + ", " + latlng.lng);
      });
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div
      id="map"
      style={{
        height: "400px",
        width: "100%",
      }}
    />
  );
};

export default MapComponent;
