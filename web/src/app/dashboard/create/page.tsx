"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Image as ImageIcon,
  Video,
  Calendar,
  Send,
  X,
  Plus,
} from "lucide-react";
import { Share2 } from "lucide-react"; // Fallback for TikTok

type SocialPlatform =
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "tiktok";

import { useTranslations } from "next-intl";

export default function CreatePostPage() {
  const t = useTranslations("CreatePost");
  const commonT = useTranslations("Common");

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    [],
  );
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  const platforms: {
    id: SocialPlatform;
    name: string;
    icon: React.ElementType;
    color: string;
    bg: string;
  }[] = [
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      color: "text-black",
      bg: "bg-gray-50",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Share2,
      color: "text-black",
      bg: "bg-gray-50",
    },
  ];

  const togglePlatform = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      alert(t("selectPlatformError"));
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(t("success"));
      setContent("");
      setFiles([]);
      setSelectedPlatforms([]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Platform Selection */}
        <section className="bg-white dark:bg-[#171021] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("step1")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-600/20"
                      : "border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full mb-2 ${isSelected ? "bg-white dark:bg-purple-500" : platform.bg.includes("-50") ? platform.bg + " dark:" + platform.bg.replace("-50", "-900/20") : platform.bg}`}
                  >
                    <platform.icon className={platform.color} size={24} />
                  </div>
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-purple-700 dark:text-purple-400" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {platform.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Content Creation */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="bg-white dark:bg-[#171021] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("step2")}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("messageLabel")}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-400"
                placeholder={t("messagePlaceholder")}
                required
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                <span>
                  {content.length} {t("characters")}
                </span>
                <span className={content.length > 280 ? "text-red-500" : ""}>
                  {280 - content.length} {t("left")} (Twitter)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("mediaLabel")}
              </label>

              <div className="grid grid-cols-3 gap-3 mb-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10"
                  >
                    {/* Placeholder for preview logic - simple representation */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      {file.type.startsWith("video") ? (
                        <Video size={24} />
                      ) : (
                        <ImageIcon size={24} />
                      )}
                    </div>
                    {file.type.startsWith("image") && (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        fill
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-gray-400 hover:text-purple-500">
                  <Plus size={24} className="mb-1" />
                  <span className="text-xs font-medium">{t("add")}</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Preview Area (Simulated) */}
          <div className="bg-gray-50 dark:bg-[#1f1a29] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("step3")}
            </h2>

            {selectedPlatforms.length > 0 ? (
              <div className="flex-1 bg-white dark:bg-[#171021] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded mb-1" />
                    <div className="h-3 w-20 bg-gray-100 dark:bg-white/5 rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {content ? (
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {content}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded" />
                      <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/5 rounded" />
                    </div>
                  )}
                </div>
                {files.length > 0 && (
                  <div className="aspect-video bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200 dark:border-white/10">
                    {files.length} {t("mediaAttached")}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                {t("selectToPreview")}
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <Calendar size={18} />
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-transparent border-none focus:ring-0 p-0 text-gray-600 dark:text-gray-400"
              />
            </label>
          </div>

          <button
            type="button"
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {t("draft")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              t("posting")
            ) : (
              <>
                <Send size={18} />
                {scheduledDate ? t("schedulePost") : t("postNow")}
              </>
            )}
          </button>
        </section>
      </form>
    </div>
  );
}
