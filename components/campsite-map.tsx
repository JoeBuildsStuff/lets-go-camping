"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Button } from "@/components/ui/button";
import { REGIONS, type Campsite, type Region } from "@/lib/campsites";

export const REGION_COLORS: Record<Region, string> = {
  Peninsula: "#16a34a",
  "North Bay": "#2563eb",
  "South Bay": "#ca8a04",
  "East Bay": "#9333ea",
  Coast: "#0891b2",
};

function pinIcon(color: string, selected: boolean, favorite: boolean): L.DivIcon {
  const size = selected ? 34 : 26;
  const ring = favorite ? `<span class="campsite-pin-fav"></span>` : "";
  return L.divIcon({
    className: "campsite-pin-wrap",
    html: `<span class="campsite-pin${selected ? " campsite-pin-selected" : ""}" style="--pin-color:${color};width:${size}px;height:${size}px">${ring}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToSelected({ site }: { site: Campsite | null }) {
  const map = useMap();
  useEffect(() => {
    if (site) {
      map.flyTo([site.lat, site.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
    }
  }, [map, site]);
  return null;
}

function FitToSites({ sites }: { sites: Campsite[] }) {
  const map = useMap();
  const mounted = useRef(false);
  useEffect(() => {
    // Skip the initial mount so the default Bay Area view (center/zoom)
    // stays put — only refit when the user actually filters.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (sites.length === 0) return;
    if (sites.length === 1) {
      map.flyTo([sites[0].lat, sites[0].lng], 11, { duration: 0.6 });
      return;
    }
    const bounds = L.latLngBounds(sites.map((s) => [s.lat, s.lng] as [number, number]));
    map.flyToBounds(bounds.pad(0.25), { duration: 0.6 });
    // Only refit when the result count changes to avoid fighting user pan/zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, sites.length]);
  return null;
}

interface CampsiteMapProps {
  sites: Campsite[];
  selectedId: string | null;
  selectedSite: Campsite | null;
  favorites: Set<string>;
  onSelect: (id: string) => void;
}

export default function CampsiteMap({
  sites,
  selectedId,
  selectedSite,
  favorites,
  onSelect,
}: CampsiteMapProps) {
  return (
    <MapContainer center={[37.75, -122.25]} zoom={9} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToSites sites={sites} />
      <FlyToSelected site={selectedSite} />
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={[site.lat, site.lng]}
          icon={pinIcon(
            REGION_COLORS[site.region],
            site.id === selectedId,
            favorites.has(site.id)
          )}
          eventHandlers={{ click: () => onSelect(site.id) }}
        >
          <Popup>
            <div className="flex min-w-[160px] flex-col gap-1">
              <p className="text-xs font-semibold leading-tight">{site.name}</p>
              <p className="text-[11px] leading-tight text-muted-foreground">{site.park}</p>
              <p className="text-[11px] text-muted-foreground">
                {site.priceRange} · {site.reservable ? "Reservable" : "First-come"}
              </p>
              <Button size="xs" className="mt-1" onClick={() => onSelect(site.id)}>
                View details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
      <LegendControl />
    </MapContainer>
  );
}

function LegendControl() {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "campsite-legend");
      div.innerHTML = REGIONS.map(
        (r) =>
          `<span class="campsite-legend-item"><span class="campsite-legend-dot" style="background:${REGION_COLORS[r]}"></span>${r}</span>`
      ).join("");
      return div;
    };
    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
