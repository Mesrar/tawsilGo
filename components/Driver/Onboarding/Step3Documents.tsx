"use client";

import { useWizard } from "./WizardContext";
import MobileButton from "@/components/ui/MobileButton";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FileUploadProps {
    label: string;
    file: File | null;
    onFileSelect: (file: File) => void;
    onRemove: () => void;
    error?: string;
    uploadText: string;
}

const FileUpload = ({ label, file, onFileSelect, onRemove, error, uploadText }: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div
                onClick={!file ? handleClick : undefined}
                className={`relative flex items-center justify-between rounded-xl border-2 border-dashed p-4 transition-all ${error
                    ? "border-red-500 bg-red-50"
                    : file
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "cursor-pointer border-gray-300 hover:border-primary/50 dark:border-gray-600"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleChange}
                />

                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        {file ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {file ? file.name : uploadText}
                        </span>
                        <span className="text-xs text-gray-500">
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "JPG, PNG or PDF"}
                        </span>
                    </div>
                </div>

                {file && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default function Step3Documents() {
    const { data, updateData, nextStep, prevStep } = useWizard();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const t = useTranslations("driverOnboarding.step3");

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!data.licenseFront) newErrors.licenseFront = t("errors.required");
        if (!data.licenseBack) newErrors.licenseBack = t("errors.required");
        if (!data.insurance) newErrors.insurance = t("errors.required");
        if (!data.nationalId) newErrors.nationalId = t("errors.required");

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
                <FileUpload
                    label={t("licenseFront")}
                    file={data.licenseFront}
                    onFileSelect={(f) => updateData({ licenseFront: f })}
                    onRemove={() => updateData({ licenseFront: null })}
                    error={errors.licenseFront}
                    uploadText={t("upload")}
                />
                <FileUpload
                    label={t("licenseBack")}
                    file={data.licenseBack}
                    onFileSelect={(f) => updateData({ licenseBack: f })}
                    onRemove={() => updateData({ licenseBack: null })}
                    error={errors.licenseBack}
                    uploadText={t("upload")}
                />
                <FileUpload
                    label={t("insurance")}
                    file={data.insurance}
                    onFileSelect={(f) => updateData({ insurance: f })}
                    onRemove={() => updateData({ insurance: null })}
                    error={errors.insurance}
                    uploadText={t("upload")}
                />
                <FileUpload
                    label={t("nationalId")}
                    file={data.nationalId}
                    onFileSelect={(f) => updateData({ nationalId: f })}
                    onRemove={() => updateData({ nationalId: null })}
                    error={errors.nationalId}
                    uploadText={t("upload")}
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
                    {t("review")}
                </MobileButton>
            </div>
        </motion.div>
    );
}
