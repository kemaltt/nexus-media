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
  Smartphone,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { CheckCircle } from "lucide-react"; // Keeping the helper import

type SettingsTab = "profile" | "security" | "notifications" | "preferences";
type Theme = "light" | "dark" | "system";
type Language = "en" | "tr" | "de";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Preferences State
  const [preferences, setPreferences] = useState<{
    theme: Theme;
    language: Language;
  }>({
    theme: "system",
    language: "en",
  });

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

      setSuccessMessage("Profile updated successfully!");
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
    value: any,
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    // Here act like we saved it
    setSuccessMessage(`Preferences updated: ${value}`);
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
                Change Avatar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        );

      case "security":
        return (
          <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
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
                New Password
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
                Confirm New Password
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
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Authenticator App
                    </p>
                    <p className="text-xs text-gray-500">
                      Secure your account with 2FA
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Enable
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
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
                Notification settings are managed globally. Individual
                preferences coming soon.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Email Notifications",
                "Push Notifications",
                "Weekly Report",
                "Security Alerts",
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Language
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "en", name: "English", flag: "🇺🇸" },
                  { id: "tr", name: "Türkçe", flag: "🇹🇷" },
                  { id: "de", name: "Deutsch", flag: "🇩🇪" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handlePreferenceUpdate("language", lang.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      preferences.language === lang.id
                        ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                        : "border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span
                        className={`font-medium ${preferences.language === lang.id ? "text-purple-700" : "text-gray-700"}`}
                      >
                        {lang.name}
                      </span>
                    </span>
                    {preferences.language === lang.id && (
                      <CheckCircle size={18} className="text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Theme Selection */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appearance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "light", name: "Light", icon: Sun },
                  { id: "dark", name: "Dark", icon: Moon },
                  { id: "system", name: "System", icon: Smartphone },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handlePreferenceUpdate("theme", theme.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-3 ${
                      preferences.theme === theme.id
                        ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                        : "border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        preferences.theme === theme.id
                          ? "bg-white text-purple-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <theme.icon size={24} />
                    </div>
                    <span
                      className={`font-medium ${preferences.theme === theme.id ? "text-purple-700" : "text-gray-700"}`}
                    >
                      {theme.name}
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
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your profile, security, and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <nav className="w-full lg:w-64 space-y-1">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "preferences", label: "Preferences", icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                size={18}
                className={`mr-3 ${activeTab === item.id ? "text-purple-600" : "text-gray-400"}`}
              />
              {item.label}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
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
