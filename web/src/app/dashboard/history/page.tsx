"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { Share2 } from "lucide-react"; // Fallback for TikTok

type PostStatus = "published" | "scheduled" | "failed";
type SocialPlatform =
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "tiktok";

interface Post {
  id: string;
  content: string;
  platforms: SocialPlatform[];
  status: PostStatus;
  publishDate: string;
  mediaCount: number;
}

import { useTranslations, useLocale } from "next-intl";

export default function HistoryPage() {
  const t = useTranslations("History");
  const commonT = useTranslations("Common");
  const locale = useLocale();

  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data
  const posts: Post[] = [
    {
      id: "1",
      content: "Excited to announce our new product launch! 🚀 #LaunchDay",
      platforms: ["twitter", "linkedin"],
      status: "published",
      publishDate: "2024-01-30T10:00:00Z",
      mediaCount: 1,
    },
    {
      id: "2",
      content: "Behind the scenes look at our team retreat. 🌴",
      platforms: ["instagram", "facebook"],
      status: "published",
      publishDate: "2024-01-29T15:30:00Z",
      mediaCount: 3,
    },
    {
      id: "3",
      content: "Weekly tech roundup video is live now!",
      platforms: ["youtube"],
      status: "failed",
      publishDate: "2024-01-28T09:00:00Z",
      mediaCount: 1,
    },
    {
      id: "4",
      content: "Upcoming webinar on Social Media Trends 2024",
      platforms: ["linkedin", "twitter"],
      status: "scheduled",
      publishDate: "2024-02-05T14:00:00Z",
      mediaCount: 0,
    },
  ];

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
            <CheckCircle size={12} className="mr-1" /> {t("status.published")}
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
            <Clock size={12} className="mr-1" /> {t("status.scheduled")}
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
            <XCircle size={12} className="mr-1" /> {t("status.failed")}
          </span>
        );
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "youtube":
        return <Youtube size={16} className="text-red-600" />;
      case "instagram":
        return <Instagram size={16} className="text-pink-600" />;
      case "facebook":
        return <Facebook size={16} className="text-blue-600" />;
      case "twitter":
        return <Twitter size={16} className="text-black dark:text-white" />;
      case "linkedin":
        return (
          <Linkedin size={16} className="text-blue-700 dark:text-blue-400" />
        );
      case "tiktok":
        return <Share2 size={16} className="text-black dark:text-white" />;
      default:
        return null;
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    const matchesSearch = post.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t("subtitle")}</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#171021] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter size={18} className="text-gray-400 mr-2" />
          {(["all", "published", "scheduled", "failed"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400"
                    : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {t(`status.${status}`)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white dark:bg-[#171021] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {t("table.content")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {t("table.platforms")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {t("table.date")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {t("table.status")}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#171021] divide-y divide-gray-200 dark:divide-white/10">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate"
                        title={post.content}
                      >
                        {post.content}
                      </div>
                    </div>
                    {post.mediaCount > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        +{post.mediaCount} {t("mediaAttachment")}
                        {post.mediaCount > 1 && locale === "en" ? "s" : ""}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {post.platforms.map((platform) => (
                        <div
                          key={platform}
                          className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-md"
                          title={platform}
                        >
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.publishDate).toLocaleDateString(locale)}
                    <span className="block text-xs text-gray-400">
                      {new Date(post.publishDate).toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">{t("noPosts")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
