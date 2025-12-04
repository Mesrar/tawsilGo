"use client";

import { WizardProvider } from "@/components/Driver/Onboarding/WizardContext";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <WizardProvider>{children}</WizardProvider>;
}
