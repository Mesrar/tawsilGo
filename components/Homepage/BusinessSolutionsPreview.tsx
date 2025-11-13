"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Code,
  BarChart3,
  ChevronRight,
  Check,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BusinessSolutionsPreview() {
  const features = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Volume Discounts",
      description: "Save up to 40% on bulk shipments",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "API Integration",
      description: "Seamless e-commerce platform integration",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Analytics Dashboard",
      description: "Real-time tracking and cost analysis",
    },
  ];

  const useCases = [
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "E-Commerce Stores",
      description: "Moroccan brands selling to European customers",
      example: "200+ orders/month with automated fulfillment",
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Import/Export",
      description: "Regular wholesale shipments between Europe & Morocco",
      example: "Weekly bulk deliveries with dedicated support",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Corporate Offices",
      description: "Document courier for multi-location companies",
      example: "Secure, trackable delivery of contracts & samples",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-900 via-moroccan-blue-midnight to-slate-900 text-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-moroccan-mint text-white border-none">
            For Businesses
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Business Growth
          </h2>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            Whether you're an e-commerce store, wholesaler, or enterprise, we have
            scalable logistics solutions designed for your business.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-moroccan-mint/20 text-moroccan-mint flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Who We Serve</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-moroccan-mint/20 text-moroccan-mint flex items-center justify-center mb-4 mx-auto">
                    {useCase.icon}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-center text-white">
                    {useCase.title}
                  </h4>
                  <p className="text-sm text-slate-300 text-center mb-3">
                    {useCase.description}
                  </p>
                  <p className="text-xs text-slate-400 italic text-center">
                    {useCase.example}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Case Study Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="bg-moroccan-mint/10 border-moroccan-mint/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-3 bg-moroccan-mint text-white">Case Study</Badge>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Moroccan Spice Co.
                  </h3>
                  <p className="text-slate-300 mb-4">
                    "TawsilGo transformed our logistics. We used to spend 3 hours
                    processing daily shipments. Now it takes 20 minutes with their bulk
                    upload."
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-moroccan-mint mb-1">
                        €2,400
                      </div>
                      <div className="text-xs text-slate-300">Saved monthly vs DHL</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-moroccan-mint mb-1">
                        250
                      </div>
                      <div className="text-xs text-slate-300">Parcels/month</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-4">What They Got:</h4>
                  <ul className="space-y-3">
                    {[
                      "40% volume discount",
                      "API integration with Shopify",
                      "Dedicated account manager",
                      "Custom routing optimization",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0" />
                        <span className="text-slate-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">
            Ready to Scale Your Logistics?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Join 500+ businesses using TawsilGo for their Europe-Morocco shipping needs.
            Volume discounts start at just 10 parcels/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-moroccan-mint hover:bg-moroccan-mint-600 text-white h-12"
              asChild
            >
              <Link href="/services/business-solutions">
                Explore Business Solutions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-slate-500 hover:bg-white h-12"
              asChild
            >
              <Link href="/support">Contact Sales Team</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
