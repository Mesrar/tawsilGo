import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NoTripsMessage = ({ clearFilters }: { clearFilters: () => void }) => (
  <div className="text-center bg-muted/30 rounded-lg p-8 mt-6">
    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
    <h3 className="text-lg font-medium mb-1">No Trips Found</h3>
    <p className="text-muted-foreground mb-4">
      We couldn't find any trips matching your search criteria. Try adjusting your filters or different dates.
    </p>
    <Button variant="outline" onClick={clearFilters}>
      Clear filters
    </Button>
  </div>
);