import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Supported locales
export const locales = ['en', 'fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

// Default locale (French as primary diaspora language)
export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;

  // Validate and fallback to default if needed
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
