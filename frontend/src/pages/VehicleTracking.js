import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function VehicleTracking() {

  const [position, setPosition] = useState([18.5204, 73.8567]); // Pune

  useEffect(() => {
    const interval = setInterval(() => {

      // Fake movement
      setPosition((prev) => [
        prev[0] + (Math.random() - 0.5) * 0.01,
        prev[1] + (Math.random() - 0.5) * 0.01,
      ]);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Vehicle Tracking</h2>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>Vehicle Location</Popup>
        </Marker>

      </MapContainer>
    </div>
  );
}

export default VehicleTracking;