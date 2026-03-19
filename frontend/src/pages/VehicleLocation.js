import React, { useEffect } from "react";

function VehicleLocation() {

  useEffect(() => {

    const vehicleLocation = { lat: 18.5204, lng: 73.8567 };

    const map = new window.google.maps.Map(
      document.getElementById("map"),
      {
        zoom: 12,
        center: vehicleLocation
      }
    );

    new window.google.maps.Marker({
      position: vehicleLocation,
      map: map,
      title: "Vehicle Location"
    });

  }, []);

  return (
    <div>
      <h2>Vehicle Live Location</h2>
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
}

export default VehicleLocation;