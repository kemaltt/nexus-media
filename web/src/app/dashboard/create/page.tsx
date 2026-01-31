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

export default function CreatePostPage() {
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
      alert("Please select at least one platform");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Post created successfully!");
      setContent("");
      setFiles([]);
      setSelectedPlatforms([]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-500 mt-1">
          Share content across multiple platforms simultaneously.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Platform Selection */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            1. Select Platforms
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
                      ? "border-purple-500 bg-purple-50"
                      : "border-transparent bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full mb-2 ${isSelected ? "bg-white" : platform.bg}`}
                  >
                    <platform.icon className={platform.color} size={24} />
                  </div>
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-purple-700" : "text-gray-600"}`}
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
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. Compose Content
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="What's on your mind?"
                required
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                <span>{content.length} characters</span>
                <span className={content.length > 280 ? "text-red-500" : ""}>
                  {280 - content.length} left (Twitter)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media
              </label>

              <div className="grid grid-cols-3 gap-3 mb-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
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

                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors text-gray-400 hover:text-purple-500">
                  <Plus size={24} className="mb-1" />
                  <span className="text-xs font-medium">Add</span>
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
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              3. Preview
            </h2>

            {selectedPlatforms.length > 0 ? (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {content ? (
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {content}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-100 rounded" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded" />
                    </div>
                  )}
                </div>
                {files.length > 0 && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                    {files.length} media attached
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                Select a platform to see preview
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <Calendar size={18} />
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-transparent border-none focus:ring-0 p-0 text-gray-600"
              />
            </label>
          </div>

          <button
            type="button"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Draft
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              "Posting..."
            ) : (
              <>
                <Send size={18} />
                {scheduledDate ? "Schedule Post" : "Post Now"}
              </>
            )}
          </button>
        </section>
      </form>
    </div>
  );
}
