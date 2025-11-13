import SignupEssential from "@/components/Auth/SignupEssential";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Registration - TawsilGo",
  description: "Create your TawsilGo business account for volume shipping, invoicing, and dedicated support for your company's logistics needs.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <SignupEssential accountType="business" />
    </>
  );
}
