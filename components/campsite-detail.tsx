"use client";

import { Dog, ExternalLink, MapPin, ShowerHead } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Campsite } from "@/lib/campsites";

interface CampsiteDetailProps {
  site: Campsite | null;
  onClose: () => void;
}

export default function CampsiteDetail({ site, onClose }: CampsiteDetailProps) {
  return (
    <Sheet
      open={site !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="gap-0 overflow-y-auto sm:max-w-md">
        {site && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2">
                <Badge>{site.region}</Badge>
                <Badge variant="outline">{site.bookingPlatform}</Badge>
              </div>
              <SheetTitle className="text-lg">{site.name}</SheetTitle>
              <SheetDescription>{site.park}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 p-6 pt-2 text-sm">
              <p className="leading-relaxed">{site.description}</p>
              <div className="flex flex-wrap gap-1">
                {site.siteTypes.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-muted p-2">
                  <dt className="text-muted-foreground">Nightly rate</dt>
                  <dd className="font-medium">{site.priceRange}</dd>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <dt className="text-muted-foreground">Booking</dt>
                  <dd className="font-medium">{site.reservable ? "Reservable" : "First-come"}</dd>
                </div>
              </dl>
              <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <li className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" /> {site.driveNotes}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Dog className="size-3.5 shrink-0" />
                  {site.dogFriendly ? "Dogs allowed (leashed in camp)" : "No dogs — check park rules"}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShowerHead className="size-3.5 shrink-0" />
                  {site.showers ? "Showers available" : "No showers"}
                </li>
              </ul>
            </div>
            <SheetFooter>
              <Button render={<a href={site.bookingUrl} target="_blank" rel="noreferrer" />}>
                Check availability <ExternalLink />
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Opens {site.bookingPlatform} in a new tab
              </p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
