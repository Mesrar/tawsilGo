import { DriverJoinLanding } from "@/components/Driver/DriverJoinLanding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Driver - TawsilGo",
  description: "Join TawsilGo's driver network and earn €500-800/month delivering parcels on your regular routes between Europe and Morocco. Flexible schedule, full insurance, competitive earnings.",
};

export default function DriverJoinPage() {
  return <DriverJoinLanding />;
}
