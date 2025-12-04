"use client";

import { useWizard } from "./WizardContext";
import MobileInput from "@/components/ui/MobileInput";
import MobileButton from "@/components/ui/MobileButton";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Step1BasicInfo() {
    const { data, updateData, nextStep } = useWizard();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const t = useTranslations("driverOnboarding.step1");

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!data.firstName) newErrors.firstName = t("errors.firstName");
        if (!data.lastName) newErrors.lastName = t("errors.lastName");
        if (!data.email) newErrors.email = t("errors.email");
        if (!data.phone) newErrors.phone = t("errors.phone");
        if (!data.city) newErrors.city = t("errors.city");
        if (!data.licenseNumber) newErrors.licenseNumber = t("errors.licenseNumber");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };

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
                <div className="grid grid-cols-2 gap-4">
                    <MobileInput
                        id="firstName"
                        label={t("firstName")}
                        value={data.firstName}
                        onChange={(e) => updateData({ firstName: e.target.value })}
                        error={errors.firstName}
                        placeholder={t("placeholders.firstName")}
                    />
                    <MobileInput
                        id="lastName"
                        label={t("lastName")}
                        value={data.lastName}
                        onChange={(e) => updateData({ lastName: e.target.value })}
                        error={errors.lastName}
                        placeholder={t("placeholders.lastName")}
                    />
                </div>

                <MobileInput
                    id="email"
                    label={t("email")}
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    error={errors.email}
                    placeholder={t("placeholders.email")}
                />

                <MobileInput
                    id="phone"
                    label={t("phone")}
                    type="tel"
                    value={data.phone}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    error={errors.phone}
                    placeholder={t("placeholders.phone")}
                />

                <MobileInput
                    id="city"
                    label={t("city")}
                    value={data.city}
                    onChange={(e) => updateData({ city: e.target.value })}
                    error={errors.city}
                    placeholder={t("placeholders.city")}
                />

                <MobileInput
                    id="licenseNumber"
                    label={t("licenseNumber")}
                    value={data.licenseNumber}
                    onChange={(e) => updateData({ licenseNumber: e.target.value })}
                    error={errors.licenseNumber}
                    placeholder={t("placeholders.licenseNumber")}
                />
            </div>

            <div className="pt-4">
                <MobileButton onClick={handleNext} className="w-full">
                    {t("next")}
                </MobileButton>
            </div>
        </motion.div>
    );
}
