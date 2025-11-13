import React from "react";
import { Metadata } from "next";
import Pickup from "@/components/Pickup/Pickup";
import { FormProvider } from "@/components/FormProvider/FormProvider";
import { MainForm } from "@/components/Pickup/form";

export const metadata: Metadata = {
  title: "Support Page - Solid SaaS Boilerplate",
  description: "This is Support page for Solid Pro",
  // other metadata
};

const PickupPage = () => {
  return (
    <div className="pb-20 pt-40">
      <FormProvider>
        <MainForm />
      </FormProvider>
    </div>
  );
};

export default PickupPage;
