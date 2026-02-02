"use client";

import { useState } from "react";
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
  Share2,
} from "lucide-react";

type SocialPlatform =
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "tiktok";

interface Account {
  id: string;
  platform: SocialPlatform;
  username: string;
  avatarUrl?: string;
  connectedAt: string;
  status: "active" | "expired" | "error";
}

import { useTranslations, useLocale } from "next-intl";

export default function AccountsPage() {
  const t = useTranslations("Accounts");
  const commonT = useTranslations("Common");
  const locale = useLocale();

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      platform: "youtube",
      username: "Nexus Tech",
      connectedAt: "2024-01-15T10:00:00Z",
      status: "active",
    },
    {
      id: "2",
      platform: "instagram",
      username: "@nexustech_official",
      connectedAt: "2024-01-20T14:30:00Z",
      status: "expired",
    },
  ]);

  // Helper to get platform details
  const getPlatformDetails = (platform: SocialPlatform) => {
    switch (platform) {
      case "youtube":
        return {
          name: "YouTube",
          icon: Youtube,
          color: "text-red-600",
          bg: "bg-red-50 dark:bg-red-900/10",
        };
      case "instagram":
        return {
          name: "Instagram",
          icon: Instagram,
          color: "text-pink-600",
          bg: "bg-pink-50 dark:bg-pink-900/10",
        };
      case "facebook":
        return {
          name: "Facebook",
          icon: Facebook,
          color: "text-blue-600",
          bg: "bg-blue-50 dark:bg-blue-900/10",
        };
      case "twitter":
        return {
          name: "X (Twitter)",
          icon: Twitter,
          color: "text-black dark:text-white",
          bg: "bg-gray-50 dark:bg-white/10",
        };
      case "linkedin":
        return {
          name: "LinkedIn",
          icon: Linkedin,
          color: "text-blue-700 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-900/10",
        };
      case "tiktok":
        return {
          name: "TikTok",
          icon: Share2,
          color: "text-black dark:text-white",
          bg: "bg-gray-50 dark:bg-white/10",
        }; // Share2 as placeholder for TikTok if not available in lucide version
      default:
        return {
          name: platform,
          icon: Share2,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-white/10",
        };
    }
  };

  // Mock function to simulate connection flow
  const handleConnect = (platform: SocialPlatform) => {
    // In a real app, this would redirect to OAuth URL
    // router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/${platform}`);
    alert(`Connecting to ${platform}... (OAuth implementation pending)`);
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm(t("disconnectConfirm"))) return;

    // Optimistic update
    setAccounts(accounts.filter((a) => a.id !== accountId));

    try {
      // await api.delete(`/social-accounts/${accountId}`);
    } catch (error) {
      console.error("Failed to disconnect", error);
      // Revert if failed
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

      {/* Connected Accounts List */}
      <div className="grid gap-4">
        {accounts.map((account) => {
          const {
            name,
            icon: Icon,
            color,
            bg,
          } = getPlatformDetails(account.platform);
          return (
            <div
              key={account.id}
              className="bg-white dark:bg-[#171021] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${bg}`}>
                  <Icon className={`${color}`} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{account.username}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <span>
                      {t("connectedOn")}{" "}
                      {new Date(account.connectedAt).toLocaleDateString(locale)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {account.status === "active" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                    <CheckCircle size={12} className="mr-1" /> {t("active")}
                  </span>
                ) : (
                  <button className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors">
                    <AlertCircle size={12} className="mr-1" /> {t("reconnect")}
                  </button>
                )}

                <button
                  onClick={() => handleDisconnect(account.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/20"
                  title="Disconnect Account"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {accounts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {t("noAccounts")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t("getStarted")}</p>
          </div>
        )}
      </div>

      {/* Add New Connection Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-8">
          {t("connectNew")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              "youtube",
              "instagram",
              "facebook",
              "twitter",
              "linkedin",
              "tiktok",
            ] as SocialPlatform[]
          ).map((platform) => {
            const {
              name,
              icon: Icon,
              color,
              bg,
            } = getPlatformDetails(platform);
            const isConnected = accounts.some((a) => a.platform === platform);

            return (
              <button
                key={platform}
                onClick={() => handleConnect(platform)}
                disabled={isConnected}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  isConnected
                    ? "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 opacity-50 cursor-default"
                    : "bg-white dark:bg-[#171021] border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`${color}`} size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block">
                    {name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isConnected ? t("alreadyConnected") : t("connectNow")}
                  </span>
                </div>
                {!isConnected && <Plus size={16} className="text-gray-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
