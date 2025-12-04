"use client";

import { useWizard } from "./WizardContext";
import MobileInput from "@/components/ui/MobileInput";
import MobileButton from "@/components/ui/MobileButton";
import { useState } from "react";
import { motion } from "framer-motion";
import { Car, Truck, Bus } from "lucide-react";
import { useTranslations } from "next-intl";

// Custom Van icon since lucide might not have a specific one, or reuse Truck
const VanIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

export default function Step2Vehicle() {
    const { data, updateData, nextStep, prevStep } = useWizard();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const t = useTranslations("driverOnboarding.step2");

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!data.vehicleType) newErrors.vehicleType = t("errors.vehicleType");
        if (!data.vehicleModel) newErrors.vehicleModel = t("errors.model");
        if (!data.vehicleYear) newErrors.vehicleYear = t("errors.year");
        if (!data.plateNumber) newErrors.plateNumber = t("errors.plateNumber");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };

    const vehicleTypes = [
        { id: "CAR", label: t("types.car"), icon: Car },
        { id: "VAN", label: t("types.van"), icon: VanIcon },
        { id: "TRUCK", label: t("types.truck"), icon: Truck },
        { id: "BUS", label: t("types.bus"), icon: Bus },
    ];

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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("vehicleType")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {vehicleTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = data.vehicleType === type.id;
                        return (
                            <div
                                key={type.id}
                                onClick={() => updateData({ vehicleType: type.id as any })}
                                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-gray-200 bg-white hover:border-primary/50 dark:border-gray-700 dark:bg-gray-800"
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Icon
                                        className={`h-8 w-8 ${isSelected ? "text-primary" : "text-gray-500"
                                            }`}
                                    />
                                    <span
                                        className={`font-medium ${isSelected
                                            ? "text-primary"
                                            : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {type.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {errors.vehicleType && (
                    <p className="text-sm text-red-500">{errors.vehicleType}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <MobileInput
                        id="vehicleModel"
                        label={t("model")}
                        value={data.vehicleModel}
                        onChange={(e) => updateData({ vehicleModel: e.target.value })}
                        error={errors.vehicleModel}
                        placeholder={t("placeholders.model")}
                    />
                    <MobileInput
                        id="vehicleYear"
                        label={t("year")}
                        type="number"
                        value={data.vehicleYear}
                        onChange={(e) => updateData({ vehicleYear: e.target.value })}
                        error={errors.vehicleYear}
                        placeholder={t("placeholders.year")}
                    />
                </div>

                <MobileInput
                    id="plateNumber"
                    label={t("plateNumber")}
                    value={data.plateNumber}
                    onChange={(e) => updateData({ plateNumber: e.target.value })}
                    error={errors.plateNumber}
                    placeholder={t("placeholders.plateNumber")}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <MobileButton
                    variant="outline"
                    onClick={prevStep}
                    className="w-1/3"
                >
                    {t("back")}
                </MobileButton>
                <MobileButton onClick={handleNext} className="w-2/3">
                    {t("next")}
                </MobileButton>
            </div>
        </motion.div>
    );
}
