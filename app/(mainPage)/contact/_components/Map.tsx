import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Pin } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const position: [number, number] = [50.3036071, 34.890111];

const MapClient: React.FC = () => {
  return (
    <MapContainer
      center={position}
      zoom={17}
      className="w-full h-96 rounded-lg shadow-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <div className="flex gap-[2px]">
            <Pin size="15px" />
            Ми тут!
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapClient;
