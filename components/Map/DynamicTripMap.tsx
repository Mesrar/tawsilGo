import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Create a dynamic import version of the map component with no SSR
const DynamicTripMap = dynamic(
  () => import("./TripMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg h-[500px] w-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }
);

export default DynamicTripMap;