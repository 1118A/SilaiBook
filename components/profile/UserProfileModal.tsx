"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/context/AuthContext";
import { getRoleBadgeInfo } from "@/lib/auth/permissions";
import {
  User,
  Camera,
  Lock,
  X,
  Check,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  "🧵", "✂️", "👔", "👗", "🪡", "🧥", "⚡", "🌟"
];

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const t = useTranslations();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar_url || "🧵");
  const [language, setLanguage] = useState<"en" | "gu" | "hi">(user?.language || "en");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const roleBadge = getRoleBadgeInfo(user.role);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      avatar_url: avatar,
      language,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E2340] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in relative text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("profile.editProfileTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("profile.editProfileSubtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Profile Image & Avatar Picker */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-900 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white dark:border-slate-800 overflow-hidden">
                {avatar.startsWith("data:image") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{avatar || user.name.charAt(0)}</span>
                )}
              </div>

              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow-md transition">
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Avatar Emoji Presets */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition ${
                    avatar === preset
                      ? "bg-white dark:bg-slate-700 shadow-sm scale-110"
                      : "hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t("profile.fullName")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Patel"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-900 dark:focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t("profile.phone")}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-900 dark:focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t("auth.email")} ({t("profile.readOnly")})
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Strictly Read-Only User Role Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("auth.role")}
              </label>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>{t("profile.roleProtectedNotice")}</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${roleBadge.bgClass} ${roleBadge.textClass} ${roleBadge.borderClass}`}>
                  {t(roleBadge.labelKey)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {t("profile.managedByAdmin")}
              </span>
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t("profile.preferredLanguage")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: "en", label: "English" },
                { code: "gu", label: "ગુજરાતી" },
                { code: "hi", label: "हिन्दी" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code as "en" | "gu" | "hi")}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-xl border transition ${
                    language === lang.code
                      ? "bg-indigo-900 dark:bg-indigo-600 text-white border-indigo-900 dark:border-indigo-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="px-5 py-2.5 bg-indigo-900 dark:bg-indigo-600 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-900/25 transition flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{t("common.saved")}</span>
                </>
              ) : (
                <span>{t("common.save")}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
