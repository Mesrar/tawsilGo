import { useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Step3Data } from "../../app/(site)/auth/signup/driver/page";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userService } from "@/app/services/userService";
import { cn } from "@/lib/utils";

interface EmailVerificationStepProps {
  form: UseFormReturn<Step3Data>;
  email: string;
  onSuccess: (code: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
}

export function EmailVerificationStep({
  form,
  email,
  onSuccess,
  onResend,
  isLoading = false,
}: EmailVerificationStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false); // For operations not controlled by parent
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  
  // Combined loading state (either parent or local)
  const isSubmitting = isLoading || localLoading;

  useEffect(() => {
    // Join digits and update form value
    form.setValue("verificationCode", digits.join(""), { shouldValidate: true });
  }, [digits, form]);
  
  // Cooldown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // Take only the last character
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  
  // Handle pasting verification code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pastedDigits.length) {
      const newDigits = [...digits];
      pastedDigits.forEach((digit, index) => {
        if (index < 6) {
          newDigits[index] = digit;
        }
      });
      setDigits(newDigits);
      
      // Focus the next empty field or the last field
      const nextEmptyIndex = newDigits.findIndex(d => d === '');
      if (nextEmptyIndex !== -1) {
        inputsRef.current[nextEmptyIndex]?.focus();
      } else {
        inputsRef.current[5]?.focus();
      }
    }
  };

  const handleVerifyEmail = async () => {
    const isValid = await form.trigger("verificationCode");
    if (!isValid) return;

    setLocalLoading(true);
    setError("");

    try {
      const { verificationCode } = form.getValues();

      // Call /api/verify with email and code
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.clearErrors();
        onSuccess(verificationCode); // Pass the verification code to parent
      } else {
        setError(data.error || "Verification failed. Please check the code and try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during verification";
      setError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleResend = async () => {
    if (resendCooldown > 0 || !onResend) return;
    
    onResend();
    setResendCooldown(60); // Start 60-second cooldown
  };
  
  // Auto-submit when all digits are filled
  useEffect(() => {
    if (digits.every(d => d !== '') && digits.length === 6) {
      // Give a short delay to allow for UI update
      const timer = setTimeout(() => {
        handleVerifyEmail();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [digits]);

  return (
    <div className="space-y-6">
      {!isSubmitting && error && (
        <Alert variant="destructive" className="animate-appear">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="verificationCode"
        render={() => (
          <FormItem>
            <FormLabel className="text-center block">Enter the 6-digit verification code</FormLabel>
            <FormControl>
              <div 
                className="flex gap-2 justify-center"
                onPaste={handlePaste}
              >
                {digits.map((digit, index) => (
                  <Input
                    key={index}
                    value={digit}
                    maxLength={1}
                    className={cn(
                      "w-12 h-12 text-center text-xl font-mono",
                      digit && "border-primary bg-primary/5",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => {
                      if (el) {
                        inputsRef.current[index] = el;
                      }
                    }}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={isSubmitting}
                    data-index={index}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-center">
        <Button 
          variant="link" 
          size="sm" 
          onClick={handleResend}
          disabled={isSubmitting || resendCooldown > 0}
          className="text-sm text-slate-600 hover:text-primary"
          type="button"
        >
          {resendCooldown > 0 ? (
            <span className="flex items-center">
              <RefreshCw className="mr-1 h-3 w-3" />
              Resend in {resendCooldown}s
            </span>
          ) : (
            "Didn't receive a code? Resend"
          )}
        </Button>
      </div>

      <Button 
        onClick={handleVerifyEmail}
        disabled={isSubmitting || digits.some(d => d === "")}
        className="w-full h-11"
        type="button"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </span>
        ) : (
          "Verify Email"
        )}
      </Button>
      
      <p className="text-center text-xs text-slate-500 mt-4">
        The verification code will expire in 10 minutes.
        <br />
        Please check your spam folder if you don't see the email.
      </p>
    </div>
  );
}