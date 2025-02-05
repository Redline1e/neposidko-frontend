import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Pin } from "lucide-react";

// Use the path from the public directory
const customIcon = new L.Icon({
  iconUrl: "/images/marker-icon.png", // Path from the public directory
  shadowUrl: "/images/marker-shadow.png", // Path from the public directory
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const position: [number, number] = [50.3036071, 34.890111];

export default function MapClient() {
  return (
    <MapContainer
      center={position}
      zoom={17}
      className="w-full h-96 rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
}
