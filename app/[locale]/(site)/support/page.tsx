import React from "react";
import { Metadata } from "next";
import QuickActions from "@/components/Support/QuickActions";
import FAQSection from "@/components/Support/FAQSection";
import SmartContactForm from "@/components/Support/SmartContactForm";
import SupportChannels from "@/components/Support/SupportChannels";
import BusinessSupport from "@/components/Support/BusinessSupport";

export const metadata: Metadata = {
  title: "Support & Help Center - TawsilGo",
  description: "Get help with your shipments, track packages, contact support, and explore business solutions for cross-border shipping between Europe and Morocco.",
};

const SupportPage = () => {
  return (
    <div className="pb-20 pt-24">
      {/* Quick Actions - First thing users see */}
      <QuickActions />

      {/* FAQ Section - Self-service support */}
      <FAQSection />

      {/* Support Channels - Communication options */}
      <SupportChannels />

      {/* Business Support - B2B solutions */}
      <BusinessSupport />

      {/* Contact Form - Last resort */}
      <SmartContactForm />
    </div>
  );
};

export default SupportPage;
