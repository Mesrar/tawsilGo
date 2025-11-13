"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Code,
  FileText,
  Users,
  BarChart3,
  ChevronRight,
  Check,
  Zap,
  Globe,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function BusinessSolutionsPage() {
  const businessFeatures = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Volume Discounts",
      description: "Save up to 40% on bulk shipments. The more you ship, the less you pay per parcel.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "API Integration",
      description: "Seamlessly integrate our shipping into your e-commerce platform or ERP system.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Track shipments, analyze costs, and optimize your logistics with real-time data.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Account Manager",
      description: "Personal support for businesses shipping 100+ parcels per month.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Bulk Upload",
      description: "Upload hundreds of shipments at once via CSV. Process orders in minutes, not hours.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Route Optimization",
      description: "We automatically select the fastest, most cost-effective routes for your shipments.",
    },
  ];

  const useCases = [
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "E-Commerce Stores",
      description: "Moroccan artisans, fashion brands, and online shops selling to European customers",
      example: "Ship 200+ orders/month from Marrakech to France, Spain, Belgium",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Import/Export Businesses",
      description: "Regular shipments between Morocco and Europe for wholesale operations",
      example: "Weekly bulk shipments of textiles, electronics, or food products",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Corporate Offices",
      description: "Companies with offices in both Morocco and Europe needing document courier",
      example: "Confidential documents, contracts, product samples",
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      minOrders: "10-50 parcels/month",
      discount: "10% off",
      features: [
        "Bulk upload via CSV",
        "Email support",
        "Basic analytics",
        "Standard insurance included",
      ],
      cta: "Get Started",
    },
    {
      name: "Growth",
      minOrders: "50-200 parcels/month",
      discount: "25% off",
      features: [
        "Everything in Starter",
        "API access",
        "Priority support",
        "Enhanced insurance (€2,000)",
        "Branded tracking page",
      ],
      cta: "Contact Sales",
      popular: true,
    },
    {
      name: "Enterprise",
      minOrders: "200+ parcels/month",
      discount: "40% off",
      features: [
        "Everything in Growth",
        "Dedicated account manager",
        "Custom integrations",
        "Premium insurance (€5,000)",
        "White-label solution",
        "Custom routing",
      ],
      cta: "Contact Sales",
    },
  ];

  const apiFeatures = [
    "RESTful API with comprehensive documentation",
    "Webhook notifications for tracking updates",
    "Rate calculation endpoint",
    "Label generation (PDF/PNG)",
    "Bulk shipment creation",
    "Real-time tracking data",
    "Sandbox environment for testing",
    "SDKs for PHP, Python, Node.js",
  ];

  const caseStudy = {
    company: "Moroccan Spice Co.",
    location: "Marrakech → France, Spain, Belgium",
    volume: "250 parcels/month",
    savings: "€2,400/month compared to DHL",
    testimonial:
      "TawsilGo transformed our logistics. We used to spend 3 hours processing daily shipments. Now it takes 20 minutes with their bulk upload. The API integration with our Shopify store is seamless.",
    result: "40% reduction in shipping costs, 3x faster fulfillment",
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-center py-20 px-4 overflow-hidden">
        {/* Enhanced background with animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-moroccan-blue-midnight to-slate-900 z-0" />

        {/* Animated gradient shimmer overlay - matching other service pages */}
        <div className="absolute inset-0 opacity-30 motion-reduce:hidden z-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-moroccan-mint/20 to-transparent animate-bounce-x" />
        </div>

        {/* Floating Moroccan geometric particles - matching other service pages */}
        <div className="absolute inset-0 pointer-events-none motion-reduce:hidden z-5">
          <div className="absolute top-20 left-10 w-8 h-8 border-2 border-moroccan-mint/30 rotate-45 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-12 h-12 border-2 border-moroccan-blue-chefchaouen/20 rotate-12 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 left-1/4 w-6 h-6 border-2 border-moroccan-mint/25 rotate-45 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-moroccan-blue-chefchaouen/15 rotate-45 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 right-1/4 w-8 h-8 border-2 border-moroccan-mint/20 rotate-12 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Moroccan pattern overlay - matching other service pages */}
        <div
          className="absolute inset-0 opacity-10 z-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-moroccan-mint text-white border-none">
                For Businesses
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Scale Your Logistics
              <motion.span
                className="block text-moroccan-mint mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Between Europe & Morocco
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Purpose-built shipping solutions for e-commerce brands, wholesalers,
              and enterprises. Save up to 40% with volume pricing.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button
                size="lg"
                className="bg-moroccan-mint hover:bg-moroccan-mint-600 text-white h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="#contact">
                  Request a Quote
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-moroccan-mint text-moroccan-mint hover:bg-moroccan-mint/10 h-14 px-8 text-lg"
                asChild
              >
                <Link href="#api-docs">View API Docs</Link>
              </Button>
            </motion.div>

            {/* Quick Stats with staggered animation */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { value: "500+", label: "Business Clients" },
                { value: "50k+", label: "Monthly Shipments" },
                { value: "40%", label: "Average Savings" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.9 + (index * 0.1)
                  }}
                >
                  <motion.div
                    className="text-3xl font-bold text-moroccan-mint"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Everything your business needs to streamline cross-border shipping
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-moroccan-mint/10 text-moroccan-mint flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who We Serve
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Tailored solutions for different business types
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <motion.div
                      className="h-14 w-14 rounded-full bg-moroccan-mint text-white flex items-center justify-center mb-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      {useCase.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-slate-700 dark:text-slate-300 mb-3">
                      {useCase.description}
                    </p>
                    <p className="text-sm text-slate-500 italic">{useCase.example}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Volume Pricing Tiers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              The more you ship, the more you save
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card
                  className={`h-full transition-all duration-300 ${
                    tier.popular
                      ? "border-moroccan-mint border-2 shadow-lg hover:shadow-xl bg-gradient-to-br from-moroccan-mint/5 to-transparent"
                      : "hover:shadow-lg border-0 shadow-md"
                  }`}
                >
                  <CardContent className="p-6">
                    {tier.popular && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      >
                        <Badge className="mb-4 bg-moroccan-mint text-white">
                          Most Popular
                        </Badge>
                      </motion.div>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {tier.minOrders}
                    </div>
                    <motion.div
                      className="text-3xl font-bold text-moroccan-mint mb-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tier.discount}
                    </motion.div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1 + i * 0.05 }}
                        >
                          <Check className="h-5 w-5 text-moroccan-mint flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Button
                        className={`w-full ${
                          tier.popular
                            ? "bg-moroccan-mint hover:bg-moroccan-mint-600"
                            : ""
                        }`}
                        variant={tier.popular ? "default" : "outline"}
                      >
                        {tier.cta}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api-docs" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-moroccan-mint/10 text-moroccan-mint border-none">
                Developer-Friendly
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful API Integration
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                Integrate TawsilGo into your existing systems in minutes. Our RESTful
                API is built for developers, with comprehensive documentation and SDKs.
              </p>
              <ul className="space-y-3">
                {apiFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-moroccan-mint flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-4">
                <Button className="bg-moroccan-mint hover:bg-moroccan-mint-600">
                  View Documentation
                </Button>
                <Button variant="outline">Get API Key</Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900 text-white">
                <CardContent className="p-6">
                  <div className="text-sm font-mono">
                    <div className="text-green-400 mb-2">// Create a shipment</div>
                    <div className="text-purple-400">POST</div>{" "}
                    <span className="text-blue-400">/api/v1/shipments</span>
                    <div className="mt-4 pl-4 border-l-2 border-moroccan-mint">
                      <div>{'{'}</div>
                      <div className="pl-4">
                        <span className="text-yellow-300">"origin"</span>:{" "}
                        <span className="text-green-300">"Paris, FR"</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-yellow-300">"destination"</span>:{" "}
                        <span className="text-green-300">"Casablanca, MA"</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-yellow-300">"weight"</span>:{" "}
                        <span className="text-blue-300">2.5</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-yellow-300">"service"</span>:{" "}
                        <span className="text-green-300">"express"</span>
                      </div>
                      <div>{'}'}</div>
                    </div>
                    <div className="mt-4 text-green-400">
                      // → Returns tracking number & label
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-moroccan-mint border-2">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-moroccan-mint text-white">Case Study</Badge>
                <h3 className="text-2xl font-bold mb-2">{caseStudy.company}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {caseStudy.location} • {caseStudy.volume}
                </p>
                <blockquote className="text-lg italic border-l-4 border-moroccan-mint pl-4 mb-6">
                  "{caseStudy.testimonial}"
                </blockquote>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-moroccan-mint/10 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-moroccan-mint mb-1">
                      {caseStudy.savings}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Savings vs. DHL
                    </div>
                  </div>
                  <div className="bg-moroccan-mint/10 p-4 rounded-lg">
                    <div className="text-lg font-semibold mb-1">{caseStudy.result}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Business Impact
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 px-4 bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none motion-reduce:hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/8 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              Ready to Scale Your Shipping?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Let's discuss how TawsilGo can optimize your logistics operations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                size="lg"
                className="bg-white text-moroccan-mint hover:bg-slate-100 h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/support">
                  Contact Sales Team
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
