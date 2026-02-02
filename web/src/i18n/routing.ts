import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "de", "tr"],

  // Used when no locale matches
  defaultLocale: "en",

  // Disable locale prefix for the default locale to make URLs cleaner (optional)
  // or keep it to ensure consistency.
  localePrefix: "never",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
