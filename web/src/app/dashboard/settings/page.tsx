"use client";

import { useState } from "react";
import { User, Lock, Bell, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type SettingsTab = "profile" | "security" | "notifications";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    bio: "Social media manager & content creator.",
  });

  // Password Form State
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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

// Helper import for CheckCircle which is used in success message
import { CheckCircle } from "lucide-react";
