import { Feature } from "@/types/feature";
import { Clock, Globe, Rocket, ShieldCheck, Users, Zap } from "lucide-react";

const featuresData: Feature[] = [
  {

    id:1,
    icon: <Rocket className="h-8 w-8 text-white" />,
    title: "Instant Matching",
    description: "Real-time traveler-package matching algorithm with 98% accuracy",
    badge: "Popular",
    progress: 85
  },
  {
    id:2,
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    title: "Secure Escrow",
    description: "100% payment protection with automated release on delivery confirmation",
    badge: "Secure",
    progress: 100
  },
  {
    id:3,
    icon: <Globe className="h-8 w-8 text-white" />,
    title: "Global Tracking",
    description: "Live GPS tracking with route optimization and ETA predictions",
    badge: "New",
    progress: 45
  },
  {
    id:4,
    icon: <Clock className="h-8 w-8 text-white" />,
    title: "24/7 Support",
    description: "Dedicated multilingual support team with <2min response time",
    badge: "",
    progress: 100
  },
  {
    id:5,
    icon: <Users className="h-8 w-8 text-white" />,
    title: "Community Network",
    description: "5000+ verified travelers across 12 European and 8 Moroccan cities",
    badge: "",
    progress: 72
  },
  {
    id:6,
    icon: <Zap className="h-8 w-8 text-white" />,
    title: "Instant Payments",
    description: "Automated payouts within 1hr of successful delivery confirmation",
    badge: "",
    progress: 100
  }
];

export default featuresData;
