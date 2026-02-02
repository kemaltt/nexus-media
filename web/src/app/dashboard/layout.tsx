"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Send,
  Clock,
  Globe,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Get user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, [router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const t = useTranslations("Common");
  const locale = useLocale();

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("createPost"), href: "/dashboard/create", icon: Send },
    { name: t("history"), href: "/dashboard/history", icon: Clock },
    { name: t("accounts"), href: "/dashboard/accounts", icon: Users },
    { name: t("analytics"), href: "/dashboard/analytics", icon: BarChart2 },
  ];

  const languages = [
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const themes = [
    { id: "light", label: t("theme.light"), icon: Sun },
    { id: "dark", label: t("theme.dark"), icon: Moon },
    { id: "system", label: t("theme.system"), icon: Laptop },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0a19] flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#171021] text-white transform transition-transform duration-200 ease-in-out lg:transform-none lg:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          >
            Nexus Media
          </Link>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={`mr-3 ${isActive ? "text-purple-400" : "text-gray-500 group-hover:text-white"}`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
              pathname === "/dashboard/settings"
                ? "bg-purple-600/20 text-purple-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings
              size={20}
              className={`mr-3 ${pathname === "/dashboard/settings" ? "text-purple-400" : "text-gray-500 group-hover:text-white"}`}
            />
            <span className="font-medium">{t("settings")}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-[#171021] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
          <button
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Theme Selector */}
            <div className="relative z-50">
              <button
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center justify-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                onBlur={() =>
                  setTimeout(() => setIsThemeDropdownOpen(false), 200)
                }
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <Moon size={20} />
                  ) : (
                    <Sun size={20} />
                  )
                ) : (
                  <Sun size={20} />
                )}
              </button>
              {isThemeDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1f162d] rounded-xl shadow-lg border border-gray-100 dark:border-white/10 py-1 animate-in fade-in zoom-in-95 duration-200">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                        theme === t.id
                          ? "bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <t.icon size={16} />
                      <span className="font-medium">{t.label}</span>
                      {theme === t.id && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative group z-50">
              <button
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center justify-center"
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                onBlur={() =>
                  setTimeout(() => setIsLanguageDropdownOpen(false), 200)
                }
              >
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <span className="text-2xl leading-none -mt-0.5">
                    {currentLang.flag}
                  </span>
                </div>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1f162d] rounded-xl shadow-lg border border-gray-100 dark:border-white/10 py-1 animate-in fade-in zoom-in-95 duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        document.cookie = `NEXT_LOCALE=${lang.code}; path=/; max-age=31536000`;
                        router.refresh();
                        setIsLanguageDropdownOpen(false);
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

            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2" />

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900 leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0] || "U"}
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:block text-right space-y-1">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                </>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-1"
                title={t("logout")}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
