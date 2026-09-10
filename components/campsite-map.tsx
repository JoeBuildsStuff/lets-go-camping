"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

import type { Campsite, Region } from "@/lib/campsites";

const REGION_COLORS: Record<Region, string> = {
  Peninsula: "#16a34a",
  "North Bay": "#2563eb",
  "South Bay": "#ca8a04",
  "East Bay": "#9333ea",
  Coast: "#0891b2",
};

function pinIcon(color: string, selected: boolean): L.DivIcon {
  const size = selected ? 34 : 26;
  return L.divIcon({
    className: "campsite-pin-wrap",
    html: `<span class="campsite-pin${selected ? " campsite-pin-selected" : ""}" style="--pin-color:${color};width:${size}px;height:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToSelected({ site }: { site: Campsite | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (site) {
      map.flyTo([site.lat, site.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
    }
  }, [map, site]);
  return null;
}

interface CampsiteMapProps {
  sites: Campsite[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CampsiteMap({ sites, selectedId, onSelect }: CampsiteMapProps) {
  const selected = useMemo(() => sites.find((s) => s.id === selectedId), [sites, selectedId]);

  return (
    <MapContainer
      center={[37.75, -122.25]}
      zoom={9}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected site={selected} />
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          icon={pinIcon(REGION_COLORS[site.region], site.id === selectedId)}
          eventHandlers={{ click: () => onSelect(site.id) }}
        />
      ))}
    </MapContainer>
  );
}
