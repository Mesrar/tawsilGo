import SignupEssential from "@/components/Auth/SignupEssential";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Registration - TawsilGo",
  description: "Create your TawsilGo customer account to start shipping parcels with real-time tracking, secure payments, and reliable delivery.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <SignupEssential accountType="personal" />
    </>
  );
}
