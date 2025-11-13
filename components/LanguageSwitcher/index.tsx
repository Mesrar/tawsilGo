"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

type Locale = 'en' | 'fr' | 'ar';

const languages = [
  { code: 'fr' as Locale, name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'ar' as Locale, name: 'العربية', flag: '🇲🇦', nativeName: 'العربية' },
  { code: 'en' as Locale, name: 'English', flag: '🇬🇧', nativeName: 'English' },
];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    const nextLocale = newLocale as Locale;

    startTransition(() => {
      // Remove current locale from pathname if it exists
      const pathnameWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, '') || '/';

      // Always add locale prefix to path for all languages
      const newPath = `/${nextLocale}${pathnameWithoutLocale}`;

      // Store locale preference in cookie
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

      router.push(newPath);
      router.refresh();
    });
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <Select
        value={locale}
        onValueChange={handleLocaleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px] h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLanguage?.flag}</span>
              <span className="text-sm">{currentLanguage?.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          {languages.map((language) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{language.nativeName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {language.name}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
