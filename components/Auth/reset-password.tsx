import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { resetEmailFormSchema, ResetEmailPasswordFormData, ResetPasswordFormData, resetPasswordFormSchema } from "@/types/userFormSchema";



interface ResetPasswordProps {
  onResetPassword: (data: { email: string }) => Promise<void>;
  isLoading?: boolean;
  isSuccess?: boolean;
}

const ResetPassword = ({ onResetPassword, isLoading = false, isSuccess = false }: ResetPasswordProps) => {
  const form = useForm<ResetEmailPasswordFormData>({
    resolver: zodResolver(resetEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ResetEmailPasswordFormData) => {
    onResetPassword(data);
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md"
      >
        {!isSuccess ? (
          <Card className="shadow-md border-slate-200 overflow-hidden">
            <CardHeader className="space-y-1">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="mr-2 h-8 w-8 rounded-full"
                >
                  <Link href="/auth/signin">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email address and we'll send you a link to reset your password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Enter your email address"
                              className={cn(
                                "pl-10 h-11",
                                form.formState.errors.email && 
                                "border-red-300 focus:ring-red-400"
                              )}
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-11" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-center text-sm text-slate-500">
                Remember your password?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  Back to sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-md border-slate-200 text-center p-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold mb-3">Check Your Email</CardTitle>
            <CardDescription className="text-base mb-6">
              We've sent a password reset link to your email address. Please check your inbox
              and follow the instructions to reset your password.
            </CardDescription>
            <Button asChild>
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
            <p className="mt-6 text-sm text-slate-500">
              Didn't receive the email?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend Link"}
              </Button>
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;