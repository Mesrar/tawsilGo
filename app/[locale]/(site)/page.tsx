"use client";

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
  return (
    <main>
      <BookingHero />
      <TrustMarquee />
      <HowItWorksSection />
      <Feature />
      <DriverStoriesSection />
      <CustomsSimplifiedSection />
      <BusinessSolutionsPreview />
       </main>
  );
}