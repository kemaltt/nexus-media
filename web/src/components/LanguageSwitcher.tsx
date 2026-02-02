"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  const languages = [
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className={`relative group z-50 ${className}`}>
      <button
        className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <span className="text-2xl leading-none -mt-0.5">
            {currentLang.flag}
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1f162d] rounded-xl shadow-lg border border-gray-100 dark:border-white/10 py-1 animate-in fade-in zoom-in-95 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${lang.code}; path=/; max-age=31536000`;
                router.refresh();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                locale === lang.code
                  ? "bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
              {locale === lang.code && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
