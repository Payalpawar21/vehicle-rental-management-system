import React from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

function VehicleMap({ vehicle }) {

  const center = {
    lat: vehicle?.location?.lat || 18.5204,
    lng: vehicle?.location?.lng || 73.8567
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAP_KEY">
      <GoogleMap
        center={center}
        zoom={10}
        mapContainerStyle={{ height: "300px", width: "100%" }}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default VehicleMap;