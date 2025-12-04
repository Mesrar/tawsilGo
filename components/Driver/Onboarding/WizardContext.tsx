"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface DriverData {
    // Step 1: Basic Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    licenseNumber: string;

    // Step 2: Vehicle
    vehicleType: "CAR" | "VAN" | "TRUCK" | "BUS" | "";
    vehicleModel: string;
    vehicleYear: string;
    plateNumber: string;

    // Step 3: Documents (File objects or URLs)
    licenseFront: File | null;
    licenseBack: File | null;
    insurance: File | null;
    nationalId: File | null;
}

interface WizardContextType {
    currentStep: OnboardingStep;
    data: DriverData;
    isLoading: boolean;
    setStep: (step: OnboardingStep) => void;
    updateData: (data: Partial<DriverData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    setIsLoading: (loading: boolean) => void;
}

const initialData: DriverData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    licenseFront: null,
    licenseBack: null,
    insurance: null,
    nationalId: null,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
    const [data, setData] = useState<DriverData>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    const updateData = (newData: Partial<DriverData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as OnboardingStep);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as OnboardingStep);
        }
    };

    return (
        <WizardContext.Provider
            value={{
                currentStep,
                data,
                isLoading,
                setStep: setCurrentStep,
                updateData,
                nextStep,
                prevStep,
                setIsLoading,
            }}
        >
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error("useWizard must be used within a WizardProvider");
    }
    return context;
}
