"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ParcelStatus } from "@/types/booking";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
  link?: { text: string; href: string };
}

interface ContextualFAQProps {
  currentStatus: ParcelStatus;
}

// FAQ database organized by status
const faqByStatus: Record<string, FAQ[]> = {
  // Customs-related statuses
  CUSTOMS_SUBMITTED_EU: [
    {
      question: "How long does EU customs clearance take?",
      answer:
        "Typically 6-24 hours. EU export customs verifies documentation and HS codes. 90% of packages clear within 12 hours unless physical inspection is required.",
    },
    {
      question: "Why is my package being held at EU customs?",
      answer:
        "Routine checks for export compliance. If held >24 hours, we'll contact you for additional documentation (commercial invoice, certificate of origin).",
    },
    {
      question: "Can I speed up customs clearance?",
      answer:
        "Clearance time is determined by customs authorities. Ensure your commercial invoice is accurate and includes all required information to avoid delays.",
      link: { text: "View customs checklist", href: "/services/specialized#customs-guide" },
    },
  ],

  CUSTOMS_SUBMITTED_MA: [
    {
      question: "How long does Morocco customs take?",
      answer:
        "Typically 12-48 hours. Morocco customs assesses duty and inspects packages. Peak times (holidays, Ramadan) may add 24 hours.",
    },
    {
      question: "Will I have to pay customs duty?",
      answer:
        "Items valued under €150 (MAD 1,250) are usually exempt. Above this, expect 2.5-25% duty + 20% VAT. We'll notify you immediately if payment is required.",
      link: { text: "Calculate duty estimate", href: "#duty-calculator" },
    },
    {
      question: "What if I can't pay the customs duty?",
      answer:
        "Unpaid parcels are held for 30 days, then returned to sender. You'll be charged return shipping fees. We recommend paying through TawsilGo for instant processing.",
    },
  ],

  DUTY_PAYMENT_PENDING: [
    {
      question: "How do I pay customs duty?",
      answer:
        "Pay via TawsilGo (instant, +€5 fee) or directly at customs (2-5 day delay). We accept all major cards and release your package within 4 hours of payment.",
    },
    {
      question: "Can I dispute the duty amount?",
      answer:
        "Duty is assessed by Morocco customs based on declared value and category. If you believe it's incorrect, contact our customs specialist for review before paying.",
      link: { text: "Contact customs support", href: "/support?topic=customs" },
    },
    {
      question: "What happens if I don't pay within 30 days?",
      answer:
        "Your package will be returned to sender and you'll be charged return shipping fees (typically €25-40). We recommend paying promptly to avoid this.",
    },
  ],

  IN_TRANSIT_BUS: [
    {
      question: "Why hasn't my tracking updated recently?",
      answer:
        "We update tracking every 30 minutes at major checkpoints. If no update for >6 hours, the bus is between stops (normal). Next update when reaching a hub or border crossing.",
    },
    {
      question: "Is my package safe on a bus?",
      answer:
        "Yes! Our parcels travel in secure, climate-controlled cargo holds. All drivers are background-checked, and buses have GPS tracking. Insured up to €500.",
    },
    {
      question: "What if the bus is delayed?",
      answer:
        "We'll notify you via SMS/email if delays exceed 2 hours. Common causes: traffic, weather, or border crossing queues. Your delivery date will be automatically updated.",
    },
  ],

  OUT_FOR_DELIVERY: [
    {
      question: "When will my package arrive today?",
      answer:
        "Deliveries occur 9 AM - 7 PM local time. You'll receive an SMS with a 2-hour delivery window 30 minutes before arrival. Track your driver's progress in real-time.",
    },
    {
      question: "What if I'm not home for delivery?",
      answer:
        "Driver will attempt contact via phone. If unavailable, package is returned to hub. You can reschedule (free) or request hold for pickup (€2 fee).",
      link: { text: "Manage delivery preferences", href: "#delivery-management" },
    },
    {
      question: "Can I change my delivery address today?",
      answer:
        "Once out for delivery, address changes aren't possible. You can request the driver deliver to a neighbor or hold for pickup at our Casablanca hub.",
    },
  ],

  DELIVERED: [
    {
      question: "I didn't receive my package but tracking says delivered?",
      answer:
        "Check with household members or neighbors. If not found within 24 hours, file a claim with photo evidence. Deliveries are photo-verified by drivers.",
      link: { text: "File missing package claim", href: "#issue-reporter" },
    },
    {
      question: "Package arrived damaged - what do I do?",
      answer:
        "Take photos immediately and file a damage claim within 48 hours. Our insurance covers up to €500. Most claims resolved in 3-5 business days.",
      link: { text: "Report damage", href: "#issue-reporter" },
    },
    {
      question: "How do I rate my delivery experience?",
      answer:
        "You'll receive a rating prompt via email/SMS 2 hours after delivery. Your feedback helps us improve service and reward top-performing drivers.",
    },
  ],

  // Fallback for other statuses
  DEFAULT: [
    {
      question: "How often is tracking updated?",
      answer:
        "Every 30 minutes at checkpoints (hubs, borders, ferry terminals). Real-time GPS tracking is available during out-for-delivery status.",
    },
    {
      question: "Can I change my delivery preferences?",
      answer:
        "Yes, before the package is out for delivery. You can change address, request hold for pickup, or schedule a specific time window (€5 fee).",
      link: { text: "Manage delivery", href: "#delivery-management" },
    },
    {
      question: "What if I need to contact support?",
      answer:
        "Use our live chat (response <5 min), call +33 1 23 45 67 89, or email support@tawsilgo.com. Include your tracking number for faster assistance.",
      link: { text: "Contact support", href: "/support" },
    },
  ],
};

export function ContextualFAQ({ currentStatus }: ContextualFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Get relevant FAQs for current status
  const getRelevantFAQs = (): FAQ[] => {
    // Check for exact status match
    if (faqByStatus[currentStatus]) {
      return faqByStatus[currentStatus];
    }

    // Check for grouped statuses
    if (currentStatus.includes("CUSTOMS")) {
      if (currentStatus.includes("_EU")) {
        return faqByStatus.CUSTOMS_SUBMITTED_EU;
      }
      if (currentStatus.includes("_MA")) {
        return faqByStatus.CUSTOMS_SUBMITTED_MA;
      }
    }

    // Fallback to default
    return faqByStatus.DEFAULT;
  };

  const faqs = getRelevantFAQs();

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-6 w-6 text-moroccan-mint" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Common questions about your current shipment status
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start justify-between gap-3"
              >
                <span className="font-medium text-slate-900 dark:text-white text-sm">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-slate-400 flex-shrink-0 transition-transform",
                    expandedIndex === index && "transform rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400">
                      <p>{faq.answer}</p>
                      {faq.link && (
                        <Link
                          href={faq.link.href}
                          className="inline-flex items-center gap-1 mt-2 text-moroccan-mint hover:underline"
                        >
                          {faq.link.text}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* More Help */}
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Still have questions?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/support">
                Visit Help Center
              </Link>
            </Button>
            <Button size="sm" className="bg-moroccan-mint hover:bg-moroccan-mint-600">
              Live Chat Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
