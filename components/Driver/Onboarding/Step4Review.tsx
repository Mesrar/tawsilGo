"use client";

import { useWizard } from "./WizardContext";
import MobileButton from "@/components/ui/MobileButton";
import { motion } from "framer-motion";
import { CheckCircle, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Step4Review() {
    const { data, prevStep, setStep } = useWizard();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const t = useTranslations("driverOnboarding.step4");

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // TODO: Implement actual backend submission logic here
        // For now, simulate a delay and redirect
        setTimeout(() => {
            setIsSubmitting(false);
            router.push("/drivers/status");
        }, 2000);
    };

    const Section = ({ title, step, children }: { title: string; step: 1 | 2 | 3; children: React.ReactNode }) => (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <button
                    onClick={() => setStep(step)}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {children}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("title")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {t("subtitle")}
                </p>
            </div>

            <div className="space-y-4">
                <Section title={t("personalDetails")} step={1}>
                    <p><span className="font-medium">{t("labels.name")}</span> {data.firstName} {data.lastName}</p>
                    <p><span className="font-medium">{t("labels.email")}</span> {data.email}</p>
                    <p><span className="font-medium">{t("labels.phone")}</span> {data.phone}</p>
                    <p><span className="font-medium">{t("labels.city")}</span> {data.city}</p>
                </Section>

                <Section title={t("vehicleInfo")} step={2}>
                    <p><span className="font-medium">{t("labels.type")}</span> {data.vehicleType}</p>
                    <p><span className="font-medium">{t("labels.model")}</span> {data.vehicleModel} ({data.vehicleYear})</p>
                    <p><span className="font-medium">{t("labels.plate")}</span> {data.plateNumber}</p>
                </Section>

                <Section title={t("documents")} step={3}>
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{t("documentsAttached", { count: 4 })}</span>
                    </div>
                </Section>
            </div>

            <div className="flex gap-3 pt-4">
                <MobileButton
                    variant="outline"
                    onClick={prevStep}
                    className="w-1/3"
                    disabled={isSubmitting}
                >
                    {t("back")}
                </MobileButton>
                <MobileButton
                    onClick={handleSubmit}
                    className="w-2/3"
                    isLoading={isSubmitting}
                >
                    {isSubmitting ? t("submitting") : t("submit")}
                </MobileButton>
            </div>
        </motion.div>
    );
}
