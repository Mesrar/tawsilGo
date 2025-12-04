"use client";

import { useWizard } from "@/components/Driver/Onboarding/WizardContext";
import Step1BasicInfo from "@/components/Driver/Onboarding/Step1BasicInfo";
import Step2Vehicle from "@/components/Driver/Onboarding/Step2Vehicle";
import Step3Documents from "@/components/Driver/Onboarding/Step3Documents";
import Step4Review from "@/components/Driver/Onboarding/Step4Review";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function OnboardingPage() {
    const { currentStep } = useWizard();
    const t = useTranslations("driverOnboarding.steps");

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1BasicInfo />;
            case 2:
                return <Step2Vehicle />;
            case 3:
                return <Step3Documents />;
            case 4:
                return <Step4Review />;
            default:
                return <Step1BasicInfo />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 flex flex-col justify-center sm:py-12">
            <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl sm:bg-white sm:dark:bg-slate-800 sm:rounded-2xl sm:shadow-xl sm:p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                        <span>{t("progress", { current: currentStep, total: 4 })}</span>
                        <span>{Math.round((currentStep / 4) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Wizard Content */}
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>
        </div>
    );
}
