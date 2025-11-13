"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowRight, Loader2, Truck, Lock,
  User, AlertCircle, Check, Eye, EyeOff,
  Package, MapPin, Shield
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { signIn } from "next-auth/react"
import { Alert, AlertDescription } from "../ui/alert"
import { cn } from "@/lib/utils"
import { SignInFormData, SignInformSchema } from "@/types/userFormSchema"
import { userService } from "@/app/services/userService"
import { useTranslations } from "next-intl"

const Signin = () => {
  const t = useTranslations("auth.signin")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInformSchema),
    defaultValues: {
      username: "",
      password: "",
      keepSignedIn: false,
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    setFormStatus("submitting");

    try {
      const result = await userService.login({
        username: data.username,
        password: data.password,
        keepSignedIn: data.keepSignedIn
      });

      if (result.success && result.data) {
        setFormStatus("success");

        const token = result.data.user.token;

        if (!token) {
          throw new Error(t("errors.noToken"));
        }

        const authResult = await signIn("credentials", {
          redirect: false,
          token: token
        });

        if (authResult?.error) {
          console.error("NextAuth signIn error:", authResult.error);
          setError(t("errors.authFailed") + ": " + authResult.error);
          setFormStatus("error");
        } else {
          router.push(callbackUrl);
        }
      } else {
        setError(result.error?.message || t("errors.signInFailed"));
        setFormStatus("error");
      }
    } catch (error) {
      console.error("SignIn exception:", error);
      setError(error instanceof Error ? error.message : t("errors.unexpectedError"));
      setFormStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Truck className="h-8 w-8 text-white" />
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

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <Card className="shadow-xl border-slate-200/60 dark:border-slate-700/60 overflow-hidden backdrop-blur-sm">
            {/* Progress indicator */}
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
              {formStatus === "submitting" && (
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
              {formStatus === "success" && (
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
              {formStatus === "error" && (
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>

            <CardContent className="pt-6 pb-6 px-6 sm:px-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                            <Input
                              placeholder={t("usernamePlaceholder")}
                              className={cn(
                                "pl-10 h-12 border-slate-200 dark:border-slate-700",
                                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400",
                                "transition-all duration-200",
                                "text-base",
                                form.formState.errors.username && "border-red-300 focus:ring-red-400/20 focus:border-red-400"
                              )}
                              autoComplete="username"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="mt-2 text-xs" />
                      </FormItem>
                    )}
                  />

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
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={t("passwordPlaceholder")}
                              className={cn(
                                "pl-10 pr-11 h-12 border-slate-200 dark:border-slate-700",
                                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400",
                                "transition-all duration-200",
                                "text-base",
                                form.formState.errors.password && "border-red-300 focus:ring-red-400/20 focus:border-red-400"
                              )}
                              autoComplete="current-password"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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
                        <FormMessage className="mt-2 text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <FormField
                      control={form.control}
                      name="keepSignedIn"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2.5 space-y-0">
                          <Checkbox
                            id="keepSignedIn"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                            disabled={isLoading}
                          />
                          <FormLabel
                            htmlFor="keepSignedIn"
                            className="text-sm font-normal cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                          >
                            {t("rememberMe")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="/auth/reset-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.span
                        className="flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("signingIn")}
                      </motion.span>
                    ) : formStatus === "success" ? (
                      <motion.span
                        className="flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <Check className="mr-2 h-5 w-5" />
                        {t("success")}
                      </motion.span>
                    ) : (
                      <span className="flex items-center justify-center">
                        {t("signInButton")}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Terms and Privacy */}
              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("agreeTerms")}{" "}
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  {t("privacyPolicy")}
                </Link>
              </p>
            </CardContent>

            <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/60 dark:border-slate-700/60 py-5 px-6 sm:px-8">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 w-full">
                {t("noAccount")}{" "}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  {t("createAccount")}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
        >
          <div className="flex items-center justify-center sm:justify-start space-x-2.5 group">
            <div className="flex-shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("features.fastShipping")}</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-2.5 group">
            <div className="flex-shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("features.globalCoverage")}</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start space-x-2.5 group">
            <div className="flex-shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("features.securePlatform")}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signin
