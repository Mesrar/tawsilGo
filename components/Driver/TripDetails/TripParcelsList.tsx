"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Weight, User } from "lucide-react";

interface Parcel {
  id: string;
  trackingNumber: string;
  weight: number;
  status: string;
  senderName: string;
  recipientCity: string;
}

interface TripParcelsListProps {
  parcels?: Parcel[];
  isLoading?: boolean;
}

export function TripParcelsList({ parcels = [], isLoading }: TripParcelsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (parcels.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No Parcels Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No bookings have been made for this trip yet. Customers can still book if
            you have available capacity.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {parcels.map((parcel) => (
        <Card key={parcel.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {parcel.trackingNumber}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {parcel.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{parcel.senderName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>To {parcel.recipientCity}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Weight className="h-3 w-3" />
                      <span>{parcel.weight} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {parcels.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <p className="text-sm text-muted-foreground">
              Total: {parcels.length} parcel{parcels.length !== 1 ? "s" : ""} •{" "}
              {parcels.reduce((sum, p) => sum + p.weight, 0).toFixed(1)} kg
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
