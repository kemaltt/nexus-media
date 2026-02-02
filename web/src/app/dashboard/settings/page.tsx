"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  LogOut,
  Globe,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { CheckCircle } from "lucide-react"; // Keeping the helper import

type SettingsTab = "profile" | "security" | "notifications" | "preferences";
type Theme = "light" | "dark" | "system";
type Language = "en" | "tr" | "de";

import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";

export default function SettingsPage() {
  const router = useRouter();
  const t = useTranslations("Settings");
  const commonT = useTranslations("Common");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Preferences State
  const [preferences, setPreferences] = useState<{
    theme: Theme;
    language: Language;
  }>({
    theme: (theme as Theme) || "system",
    language: locale as Language,
  });

  // Keep internal state in sync with global theme
  useEffect(() => {
    if (theme) {
      setPreferences((prev) => ({ ...prev, theme: theme as Theme }));
    }
  }, [theme]);

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        setProfile({
          fullName: data.name || "",
          email: data.email || "",
          username: data.username || "",
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch("/users/profile", {
        name: profile.fullName,
        // username: profile.username,
      });

      // Update local storage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccessMessage(t("profile.updated"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("New passwords do not match");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Password changed successfully!");
      setPassword({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handlePreferenceUpdate = (
    key: keyof typeof preferences,
    value: Theme | Language,
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));

    if (key === "language") {
      document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`;
      router.refresh();
    } else if (key === "theme") {
      setTheme(value);
    }

    // Here act like we saved it
    setSuccessMessage(`${t("preferences.updated") || "Updated"}: ${value}`);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-4xl text-white font-bold">
                {profile.fullName.charAt(0)}
              </div>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {t("profile.changeAvatar")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("profile.fullName")}
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("profile.email")}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? commonT("loading") : t("profile.saveChanges")}
              </button>
            </div>
          </form>
        );

      case "security":
        return (
          <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("security.currentPassword") || "Current Password"}
              </label>
              <input
                type="password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("security.newPassword") || "New Password"}
              </label>
              <input
                type="password"
                value={password.new}
                onChange={(e) =>
                  setPassword({ ...password, new: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("security.confirmPassword") || "Confirm New Password"}
              </label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) =>
                  setPassword({ ...password, confirm: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {t("security.twoFactor") || "Two-Factor Authentication"}
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("security.authenticatorApp") || "Authenticator App"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("security.secureAccount") ||
                        "Secure your account with 2FA"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  {t("security.enable") || "Enable"}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? commonT("loading")
                  : t("security.updatePassword") || "Update Password"}
              </button>
            </div>
          </form>
        );

      case "notifications":
        return (
          <div className="space-y-6 max-w-2xl">
            {/* Notification settings placeholder */}
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
              <p className="text-sm">
                {t("notifications.managedGlobally") ||
                  "Notification settings are managed globally. Individual preferences coming soon."}
              </p>
            </div>
            <div className="space-y-4">
              {[
                t("notifications.email") || "Email Notifications",
                t("notifications.push") || "Push Notifications",
                t("notifications.weekly") || "Weekly Report",
                t("notifications.security") || "Security Alerts",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <span className="text-gray-900 font-medium">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-8 max-w-2xl">
            {/* Language Selection */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("preferences.language")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "en", name: "English", flag: "🇺🇸" },
                  { id: "tr", name: "Türkçe", flag: "🇹🇷" },
                  { id: "de", name: "Deutsch", flag: "🇩🇪" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() =>
                      handlePreferenceUpdate("language", lang.id as Language)
                    }
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      preferences.language === lang.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-600/20 ring-1 ring-purple-500"
                        : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-200 dark:hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span
                        className={`font-medium ${
                          preferences.language === lang.id
                            ? "text-purple-700 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lang.name}
                      </span>
                    </span>
                    {preferences.language === lang.id && (
                      <CheckCircle
                        size={18}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <hr className="border-gray-100 dark:border-white/10" />

            {/* Theme Selection */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("preferences.appearance")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "light", name: commonT("theme.light"), icon: Sun },
                  { id: "dark", name: commonT("theme.dark"), icon: Moon },
                  {
                    id: "system",
                    name: commonT("theme.system"),
                    icon: Laptop,
                  },
                ].map((themeItem) => (
                  <button
                    key={themeItem.id}
                    onClick={() =>
                      handlePreferenceUpdate("theme", themeItem.id as Theme)
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-3 ${
                      preferences.theme === themeItem.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-600/20 ring-1 ring-purple-500"
                        : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-200 dark:hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        preferences.theme === themeItem.id
                          ? "bg-white dark:bg-purple-500 text-purple-600 dark:text-white"
                          : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <themeItem.icon size={24} />
                    </div>
                    <span
                      className={`font-medium ${
                        preferences.theme === themeItem.id
                          ? "text-purple-700 dark:text-purple-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {themeItem.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <nav className="w-full lg:w-64 space-y-1">
          {[
            { id: "profile", label: t("tabs.profile"), icon: User },
            { id: "security", label: t("tabs.security"), icon: Lock },
            { id: "notifications", label: t("tabs.notifications"), icon: Bell },
            { id: "preferences", label: t("tabs.preferences"), icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon
                size={18}
                className={`mr-3 ${activeTab === item.id ? "text-purple-600" : "text-gray-400 dark:text-gray-500"}`}
              />
              {item.label}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              {commonT("logout")}
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#171021] p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm min-h-[500px]">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 flex items-center">
              <CheckCircle size={18} className="mr-2" />
              {successMessage}
            </div>
          )}

          <div className="fade-in">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
