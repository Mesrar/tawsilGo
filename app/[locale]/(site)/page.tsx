"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Feature from "@/components/Features";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import { BookingHero } from "@/components/Booking/BookingHero";
import { TrustMarquee } from "@/components/TrustMarquee";
import {
  HowItWorksSection,
  DriverStoriesSection,
  CustomsSimplifiedSection,
  BusinessSolutionsPreview,
} from "@/components/Homepage";

export default function Home() {
  const router = useRouter();
  const [departureCountry, setDepartureCountry] = useState("france");
  const [destinationCountry, setDestinationCountry] = useState("morocco");

  // Handle search from homepage - redirects to booking page with selected countries
  const handleHomeSearch = () => {
    // Create query parameters for the booking page
    const params = new URLSearchParams();
    params.append("from", departureCountry);
    params.append("to", destinationCountry);

    // Redirect to the booking page with these parameters
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <main>
      <BookingHero
        departureCountry={departureCountry}
        destinationCountry={destinationCountry}
        setDepartureCountry={setDepartureCountry}
        setDestinationCountry={setDestinationCountry}
        onSearchClick={handleHomeSearch}
      />
      <TrustMarquee />
      <HowItWorksSection />
      <Feature />
      <DriverStoriesSection />
      <CustomsSimplifiedSection />
      <BusinessSolutionsPreview />
       </main>
  );
}