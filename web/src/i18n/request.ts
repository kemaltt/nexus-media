import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  // Try to get locale from cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");
  const locale = localeCookie?.value || "de"; // Default to German

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
