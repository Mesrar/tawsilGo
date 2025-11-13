"use client"
import ResetPassword from "@/components/Auth/reset-password";
import { userService } from "@/app/services/userService";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleResetPassword = async (data: { email: string }) => {
    setIsLoading(true);
    
    try {
      // Use userService instead of direct fetch
      const response = await userService.requestPasswordReset({
        email: data.email
      });
      
      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Reset email sent",
          description: "Check your email for instructions to reset your password",
        });
        
        // Optionally redirect to a confirmation page
        // router.push("/auth/reset-password/check-email");
      } else {
        throw new Error(response.error?.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-25 xl:py-30">
      <ResetPassword 
        onResetPassword={handleResetPassword} 
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    </section>
  );
}