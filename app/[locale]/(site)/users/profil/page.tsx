import { CustomerProfile } from "@/components/customer";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Profile page skeleton loader
function ProfileSkeleton() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  // Authentication is handled by middleware - no need to check here
  return (
    <section className="pb-8 pt-6 md:pb-12 md:pt-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Mobile-friendly page header */}
     
        
        {/* Background container with improved responsive design */}
        <div className="relative rounded-xl bg-card overflow-hidden">
          {/* Decorative gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
            aria-hidden="true"
          />
          
          {/* Content with better padding for all devices */}
          <div className="relative z-10 p-4 md:p-6 lg:p-8">
            {/* Suspense boundary for profile data */}
            <Suspense fallback={<ProfileSkeleton />}>
              <CustomerProfile />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}