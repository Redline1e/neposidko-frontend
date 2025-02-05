"use client";

import dynamic from "next/dynamic";

// Dynamically import the MapClient component to ensure it's rendered client-side
const MapClient = dynamic(() => import("./Map"), {
  ssr: false, // Ensure the map is rendered on the client side
});

export default function MapClientWrapper() {
  return <MapClient />;
}
