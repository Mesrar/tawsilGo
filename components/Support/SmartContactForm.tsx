"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PaperClipIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const createFormSchema = (t: any) =>
  z.object({
    inquiryType: z.string().min(1, t("form.errors.inquiryTypeRequired")),
    fullName: z.string().min(2, t("form.errors.nameMin")),
    email: z.string().email(t("form.errors.emailInvalid")),
    phone: z.string().optional(),
    trackingNumber: z.string().optional(),
    companyName: z.string().optional(),
    subject: z.string().min(3, t("form.errors.subjectMin")),
    message: z.string().min(10, t("form.errors.messageMin")),
    urgent: z.boolean().optional(),
    terms: z.boolean().refine((val) => val === true, t("form.errors.termsRequired")),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export default function SmartContactForm() {
  const t = useTranslations("support.contactForm");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const formSchema = createFormSchema(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inquiryType: "",
      urgent: false,
      terms: false,
    },
  });

  const inquiryType = watch("inquiryType");
  const isUrgent = watch("urgent");

  const inquiryTypes = [
    { value: "question", label: t("form.inquiryTypes.question"), icon: "❓" },
    { value: "issue", label: t("form.inquiryTypes.issue"), icon: "⚠️" },
    { value: "business", label: t("form.inquiryTypes.business"), icon: "💼" },
    { value: "partnership", label: t("form.inquiryTypes.partnership"), icon: "🤝" },
  ];

  const showTrackingField = inquiryType === "issue" || inquiryType === "question";
  const showCompanyField = inquiryType === "business" || inquiryType === "partnership";
  const showUrgentOption = inquiryType === "issue";
  const showFileUpload = inquiryType === "business" || inquiryType === "partnership";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(t("form.errors.fileTooLarge"));
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError(t("form.errors.fileTypeInvalid"));
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Prepare form data for submission
      const formData = new FormData();
      formData.append("inquiryType", data.inquiryType);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("subject", data.subject);
      formData.append("message", data.message);

      if (data.phone) formData.append("phone", data.phone);
      if (data.trackingNumber) formData.append("trackingNumber", data.trackingNumber);
      if (data.companyName) formData.append("companyName", data.companyName);
      if (data.urgent) formData.append("urgent", "true");
      if (selectedFile) formData.append("attachment", selectedFile);

      // Submit to API
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Success
      setIsSuccess(true);
      reset();
      setSelectedFile(null);

      toast({
        title: t("form.success.title"),
        description: t("form.success.description"),
        variant: "default",
      });

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: t("form.errors.submitFailed"),
        description: t("form.errors.submitFailedDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="contact-form" className="py-16 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">{t("form.success.title")}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t("form.success.message")}
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              {t("form.success.sendAnother")}
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-16 px-4 bg-white dark:bg-slate-800">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-8 ${isRTL ? "text-right" : ""}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Inquiry Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="inquiryType" className={isRTL ? "text-right block" : ""}>
              {t("form.inquiryType")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={inquiryType}
              onValueChange={(value) => setValue("inquiryType", value)}
            >
              <SelectTrigger className={isRTL ? "text-right" : ""}>
                <SelectValue placeholder={t("form.selectInquiryType")} />
              </SelectTrigger>
              <SelectContent>
                {inquiryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className={isRTL ? "text-right" : ""}>
                      {type.icon} {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.inquiryType && (
              <p className="text-sm text-red-500">{errors.inquiryType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className={isRTL ? "text-right block" : ""}>
                {t("form.fullName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register("fullName")}
                className={isRTL ? "text-right" : ""}
                placeholder={t("form.fullNamePlaceholder")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className={isRTL ? "text-right block" : ""}>
                {t("form.email")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={isRTL ? "text-right" : ""}
                placeholder={t("form.emailPlaceholder")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className={isRTL ? "text-right block" : ""}>
                {t("form.phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className={isRTL ? "text-right" : ""}
                placeholder={t("form.phonePlaceholder")}
              />
            </div>

            {/* Tracking Number (Conditional) */}
            {showTrackingField && (
              <div className="space-y-2">
                <Label htmlFor="trackingNumber" className={isRTL ? "text-right block" : ""}>
                  {t("form.trackingNumber")}
                </Label>
                <Input
                  id="trackingNumber"
                  type="text"
                  {...register("trackingNumber")}
                  className={isRTL ? "text-right" : ""}
                  placeholder={t("form.trackingNumberPlaceholder")}
                />
              </div>
            )}

            {/* Company Name (Conditional) */}
            {showCompanyField && (
              <div className="space-y-2">
                <Label htmlFor="companyName" className={isRTL ? "text-right block" : ""}>
                  {t("form.companyName")}
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  {...register("companyName")}
                  className={isRTL ? "text-right" : ""}
                  placeholder={t("form.companyNamePlaceholder")}
                />
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className={isRTL ? "text-right block" : ""}>
              {t("form.subject")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              {...register("subject")}
              className={isRTL ? "text-right" : ""}
              placeholder={t("form.subjectPlaceholder")}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className={isRTL ? "text-right block" : ""}>
              {t("form.message")} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              className={`min-h-32 ${isRTL ? "text-right" : ""}`}
              placeholder={t("form.messagePlaceholder")}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* File Upload (Conditional) */}
          {showFileUpload && (
            <div className="space-y-2">
              <Label htmlFor="attachment" className={isRTL ? "text-right block" : ""}>
                {t("form.attachment")}
              </Label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="attachment"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <PaperClipIcon className="h-5 w-5" />
                  <span>{t("form.chooseFile")}</span>
                </label>
                <input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                />
                {selectedFile && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("form.fileInfo")}
              </p>
            </div>
          )}

          {/* Urgent Checkbox (Conditional) */}
          {showUrgentOption && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="urgent"
                checked={isUrgent}
                onCheckedChange={(checked) => setValue("urgent", checked as boolean)}
              />
              <Label
                htmlFor="urgent"
                className={`flex items-center gap-2 cursor-pointer ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />
                <span>{t("form.markAsUrgent")}</span>
              </Label>
            </div>
          )}

          {/* Priority Badge */}
          {isUrgent && (
            <Badge className="bg-amber-500 text-white">
              {t("form.urgentPriority")}
            </Badge>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={watch("terms")}
              onCheckedChange={(checked) => setValue("terms", checked as boolean)}
            />
            <Label
              htmlFor="terms"
              className={`text-sm cursor-pointer ${isRTL ? "text-right" : ""}`}
            >
              {t("form.termsText")}{" "}
              <a href="#" className="text-moroccan-mint hover:underline">
                {t("form.termsLink")}
              </a>
            </Label>
          </div>
          {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600 text-white py-6 text-lg"
          >
            {isSubmitting ? t("form.submitting") : t("form.submit")}
          </Button>

          {/* Response Time Info */}
          <p className="text-sm text-center text-slate-500 dark:text-slate-400">
            {isUrgent ? t("form.urgentResponseTime") : t("form.normalResponseTime")}
          </p>
        </motion.form>
      </div>
    </section>
  );
}
