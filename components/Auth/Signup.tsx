"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ChevronRight,
  Sparkles,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { EmailVerificationStep } from "../Driver/email-verification-step";
import { Step3Data } from "@/app/(site)/auth/signup/driver/page";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { userService } from "@/app/services/userService";
import { useToast } from "@/hooks/use-toast";
import {
  PASSWORD_REQUIREMENTS,
  RegistrationFormData,
  registrationFormSchema,
  verificationAccountSchema,
} from "@/types/userFormSchema";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { useTranslations } from "next-intl";

const Signup = () => {
  const t = useTranslations("auth.signup");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const steps = [t("steps.personalInfo"), t("steps.verification")];
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
    },
    mode: "onChange",
  });

  const formStep2 = useForm<Step3Data>({
    resolver: zodResolver(verificationAccountSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // Calculate form completion percentage
  const watchedValues = form.watch();

  const calculateProgress = () => {
    const filledFields = Object.entries(watchedValues).filter(
      ([_, value]) => value !== ""
    ).length;
    const totalFields = Object.keys(form.formState.defaultValues || {}).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      setFormProgress(calculateProgress());
    });
    return () => subscription.unsubscribe();
  }, [form, watchedValues]);

  // Password strength checker
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    meetsAllRequirements: false,
  });

  const checkPasswordStrength = (password: string) => {
    const metRequirements = PASSWORD_REQUIREMENTS.filter((requirement) =>
      requirement.regex.test(password)
    );

    const score = metRequirements.length;
    const meetsAllRequirements = score === PASSWORD_REQUIREMENTS.length;

    setPasswordStrength({
      score,
      meetsAllRequirements,
    });
  };

  const getPasswordStrengthLabel = () => {
    const { score } = passwordStrength;
    if (score === 0) return { label: "Very Weak", color: "bg-red-500" };
    if (score === 1) return { label: "Weak", color: "bg-red-500" };
    if (score === 2) return { label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { label: "Good", color: "bg-blue-500" };
    if (score === 4) return { label: "Strong", color: "bg-green-500" };
    return { label: "Very Strong", color: "bg-green-600" };
  };

  const handleStep1Submit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.register({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        confirmPassword: data.password,
        username: data.username,
        phoneNumber: data.phone,
        acceptTerms: true,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || "Registration failed");
      }

      setFormData(data);
      setUserId(response.data.id);
      setStep(2);

      toast({
        title: "Registration initiated",
        description: "Please verify your email to complete registration",
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.message || "An error occurred during registration");

      toast({
        title: "Registration failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAccount = async (code: string) => {
    // Verification is already handled by EmailVerificationStep
    // This function just handles the success state
    setVerificationComplete(true);

    toast({
      title: "Verification successful",
      description: "Your account has been verified successfully!",
    });
  };

  const handleResendVerification = async () => {
    if (!formData.email) return;

    setIsLoading(true);

    try {
      const response = await userService.resendVerification({
        email: formData.email,
      });

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to resend verification code"
        );
      }

      toast({
        title: "Verification code resent",
        description: `A new verification code has been sent to ${formData.email}`,
      });
    } catch (error: any) {
      console.error("Failed to resend verification:", error);

      toast({
        title: "Failed to resend code",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async (code: string) => {
    await handleVerifyAccount(code);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        {!verificationComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="inline-flex"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {t("subtitle")}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Progress Indicator */}
        {!verificationComplete && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Step {step} of {steps.length}: {steps[step - 1]}
              </span>
              {step === 1 && (
                <span className="text-slate-500 dark:text-slate-400">
                  {formProgress}% complete
                </span>
              )}
            </div>
            <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-gradient-to-r from-green-500 to-green-600"
                initial={{ width: 0 }}
                animate={{
                  width: step === 1 ? `${formProgress}%` : `${(step / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Forms */}
        <AnimatePresence mode="wait">
          {!verificationComplete ? (
            <>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => router.push("/auth/signup")}
                          disabled={isLoading}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                          <CardTitle className="text-2xl">Your Information</CardTitle>
                          <CardDescription className="text-base">
                            Fill in your details to get started
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleStep1Submit)}
                          className="space-y-5"
                        >
                          {/* Name Fields */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("firstName")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-green-500" />
                                      <Input
                                        placeholder={t("firstNamePlaceholder")}
                                        className={cn(
                                          "pl-10 h-12 border-slate-200 dark:border-slate-700",
                                          "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                                          "transition-all duration-200 text-base",
                                          form.formState.errors.firstName &&
                                            "border-red-300 focus:ring-red-400/20"
                                        )}
                                        disabled={isLoading}
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs mt-1.5" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("lastName")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-green-500" />
                                      <Input
                                        placeholder={t("lastNamePlaceholder")}
                                        className={cn(
                                          "pl-10 h-12 border-slate-200 dark:border-slate-700",
                                          "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                                          "transition-all duration-200 text-base",
                                          form.formState.errors.lastName &&
                                            "border-red-300 focus:ring-red-400/20"
                                        )}
                                        disabled={isLoading}
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs mt-1.5" />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Username and Email */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("username")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-green-500" />
                                      <Input
                                        placeholder={t("usernamePlaceholder")}
                                        className={cn(
                                          "pl-10 h-12 border-slate-200 dark:border-slate-700",
                                          "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                                          "transition-all duration-200 text-base",
                                          form.formState.errors.username &&
                                            "border-red-300 focus:ring-red-400/20"
                                        )}
                                        disabled={isLoading}
                                        autoComplete="username"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs mt-1.5" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("email")}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-green-500" />
                                      <Input
                                        placeholder={t("emailPlaceholder")}
                                        type="email"
                                        className={cn(
                                          "pl-10 h-12 border-slate-200 dark:border-slate-700",
                                          "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                                          "transition-all duration-200 text-base",
                                          form.formState.errors.email &&
                                            "border-red-300 focus:ring-red-400/20"
                                        )}
                                        disabled={isLoading}
                                        autoComplete="email"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-xs mt-1.5" />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Phone */}
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  {t("phone")}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-green-500" />
                                    <Input
                                      placeholder={t("phonePlaceholder")}
                                      type="tel"
                                      className={cn(
                                        "pl-10 h-12 border-slate-200 dark:border-slate-700",
                                        "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                                        "transition-all duration-200 text-base",
                                        form.formState.errors.phone &&
                                          "border-red-300 focus:ring-red-400/20"
                                      )}
                                      disabled={isLoading}
                                      autoComplete="tel"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1.5" />
                              </FormItem>
                            )}
                          />

                          {/* Password */}
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  {t("password")}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-green-500" />
                                    <Input
                                      placeholder={t("passwordPlaceholder")}
                                      type={showPassword ? "text" : "password"}
                                      className={cn(
                                        "pl-10 pr-11 h-12 border-slate-200 dark:border-slate-700",
                                        "focus:ring-2 focus:ring-green-500/20 focus:border-green-500",
                                        "transition-all duration-200 text-base",
                                        form.formState.errors.password &&
                                          "border-red-300 focus:ring-red-400/20"
                                      )}
                                      disabled={isLoading}
                                      autoComplete="new-password"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        checkPasswordStrength(e.target.value);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                      disabled={isLoading}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1.5" />
                              </FormItem>
                            )}
                          />

                          {/* Password Strength Indicator */}
                          {form.watch("password") && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 dark:text-slate-400">
                                  Password strength:
                                </span>
                                <span
                                  className={cn(
                                    "font-semibold",
                                    passwordStrength.meetsAllRequirements
                                      ? "text-green-600"
                                      : "text-amber-600"
                                  )}
                                >
                                  {getPasswordStrengthLabel().label}
                                </span>
                              </div>
                              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full transition-all duration-300",
                                    getPasswordStrengthLabel().color
                                  )}
                                  style={{
                                    width: `${
                                      (passwordStrength.score /
                                        PASSWORD_REQUIREMENTS.length) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <div className="space-y-1.5">
                                {PASSWORD_REQUIREMENTS.map((req, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 text-xs"
                                  >
                                    {req.regex.test(form.watch("password")) ? (
                                      <Check className="h-3.5 w-3.5 text-green-600" />
                                    ) : (
                                      <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                    )}
                                    <span
                                      className={cn(
                                        "transition-colors",
                                        req.regex.test(form.watch("password"))
                                          ? "text-green-600 font-medium"
                                          : "text-slate-500 dark:text-slate-400"
                                      )}
                                    >
                                      {req.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Address with Autocomplete */}
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  {t("address")}
                                </FormLabel>
                                <FormControl>
                                  <AddressAutocomplete
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={t("addressPlaceholder")}
                                    disabled={isLoading}
                                    error={!!form.formState.errors.address}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs mt-1.5" />
                              </FormItem>
                            )}
                          />

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            className="w-full h-12 mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {t("creating")}
                              </span>
                            ) : (
                              <span className="flex items-center justify-center group">
                                {t("nextStep")}
                                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 py-5">
                      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                        {t("alreadyHaveAccount")}{" "}
                        <Link
                          href="/auth/signin"
                          className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
                        >
                          {t("signIn")}
                        </Link>
                      </p>
                      <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t("agreeTerms")}{" "}
                        <Link
                          href="/terms"
                          className="text-green-600 dark:text-green-400 hover:underline font-medium"
                        >
                          {t("termsOfService")}
                        </Link>{" "}
                        {t("and")}{" "}
                        <Link
                          href="/privacy"
                          className="text-green-600 dark:text-green-400 hover:underline font-medium"
                        >
                          {t("privacyPolicy")}
                        </Link>
                      </p>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Email Verification */}
              {step === 2 && formData.email && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => setStep(1)}
                          disabled={isLoading}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                          <CardDescription className="text-base">
                            Check your inbox for the verification code
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-4 rounded-lg flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">
                            Verification email sent
                          </p>
                          <p className="text-xs">
                            We've sent a 6-digit code to{" "}
                            <span className="font-semibold">
                              {formData.email}
                            </span>
                            . Check your inbox and enter the code below.
                          </p>
                        </div>
                      </div>

                      <FormProvider {...formStep2}>
                        <EmailVerificationStep
                          form={formStep2}
                          email={formData.email}
                          onSuccess={handleVerificationSuccess}
                          onResend={handleResendVerification}
                          isLoading={isLoading}
                        />
                      </FormProvider>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-6"
              >
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Welcome to TawsilGo!
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Your account has been successfully created. You can now start
                    shipping parcels with ease.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    variant="outline"
                    className="h-12 px-6"
                  >
                    Sign In Now
                  </Button>
                  <Button
                    onClick={() => router.push("/booking")}
                    className="h-12 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Book Your First Shipment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;
