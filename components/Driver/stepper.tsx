// app/driver/onboarding/components/stepper.tsx
import { cn } from "@/lib/utils"
import { string } from "zod";

export function Stepper({ currentStep , steps }: { currentStep: number, steps : string[] }) {
  

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div key={label} className="flex flex-col items-center w-1/3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <div className="text-sm mt-2 text-center">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}