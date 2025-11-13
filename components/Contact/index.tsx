"use client";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations, useLocale } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Import Heroicons (stroke-based SVGs) instead of Lucide icons
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
  // Removed redundant form fields: subject and phone
});

interface ContactInfo {
  location: string;
  email: string;
  phone: string;
}

const Contact = () => {
  const t = useTranslations('support');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const contactInfo: ContactInfo = {
    location: "Boulogne billancourt",
    email: "momo@momo.com",
    phone: "+33763215487"
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
      terms: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Submission failed");

      toast({
        title: `✉️ ${t('messageSent')}`,
        description: t('messageSentDescription'),
      });
      form.reset();
    } catch (error) {
      toast({
        title: `⚠️ ${t('error')}`,
        description: t('errorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Animation variants for subtle motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section
      id="support"
      className="px-4 py-8 md:px-8 bg-gray-50 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ maxWidth: "375px", margin: "0 auto" }} // Force iPhone 13 Mini viewport width
    >
      {/* Contact Information Cards - Moved to top for mobile */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mb-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
          {t('contactUs')}
        </h2>

        <div className="space-y-4">
          <Card className="p-4 shadow-sm border-0 bg-white dark:bg-gray-800 rounded-xl">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center" style={{ minWidth: "48px", minHeight: "48px" }}>
                <MapPinIcon className="h-5 w-5 text-primary" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-base font-medium mb-1">{t('location')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{contactInfo?.location}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-sm border-0 bg-white dark:bg-gray-800 rounded-xl">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center" style={{ minWidth: "48px", minHeight: "48px" }}>
                <EnvelopeIcon className="h-5 w-5 text-primary" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-base font-medium mb-1">{t('email')}</h3>
                <a
                  href={`mailto:${contactInfo?.email}`}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {contactInfo?.email}
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-sm border-0 bg-white dark:bg-gray-800 rounded-xl">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center" style={{ minWidth: "48px", minHeight: "48px" }}>
                <PhoneIcon className="h-5 w-5 text-primary" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-base font-medium mb-1">{t('phone')}</h3>
                <a
                  href={`tel:${contactInfo?.phone}`}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {contactInfo?.phone}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
          {t('sendMessage')}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>{t('fullName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('fullNamePlaceholder')}
                      {...field}
                      className={`h-12 px-4 focus:ring-2 focus:ring-primary text-base ${isRTL ? 'text-right' : ''}`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      {...field}
                      className={`h-12 px-4 focus:ring-2 focus:ring-primary text-base ${isRTL ? 'text-right' : ''}`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>{t('message')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('messagePlaceholder')}
                      rows={4}
                      className={`min-h-[100px] p-4 focus:ring-2 focus:ring-primary text-base resize-none ${isRTL ? 'text-right' : ''}`}
                      {...field}
                    />
                  </FormControl>
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {field.value.length}/10 min
                    </span>
                  </div>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start ${isRTL ? 'space-x-reverse' : ''} space-x-3 space-y-0 py-2`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 h-5 w-5 rounded"
                    />
                  </FormControl>
                  <div className={`leading-tight ${isRTL ? 'text-right' : ''}`}>
                    <FormLabel className="text-xs">
                      {t('agreeToTerms')}{' '}
                      <a href="/terms" className="text-primary underline">
                        {t('terms')}
                      </a>{' '}
                      {t('and')}{' '}
                      <a href="/privacy" className="text-primary underline">
                        {t('privacyPolicy')}
                      </a>
                    </FormLabel>
                    <FormMessage className="text-red-500 text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base mt-4 rounded-lg transition-transform active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className={`h-5 w-5 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('sending')}
                </>
              ) : (
                <>
                  {t('sendMessageButton')}
                  <EnvelopeIcon className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </>
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </section>
  );
};

export default Contact;