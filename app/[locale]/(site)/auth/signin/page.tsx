import SigninClient from "@/components/Auth/SigninClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - TawsilGo",
  description: "Sign in to your TawsilGo account to manage parcels, track shipments, and access our logistics platform",
  // other metadata
};


const SigninPage = () => {

  return (
    <section className="py-20 lg:py-25 xl:py-30">
    <SigninClient />
    </section>
  );
};

export default SigninPage;
