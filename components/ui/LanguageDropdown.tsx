"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", short: "EN" },
  { code: "gu", name: "ગુજરાતી", short: "GU" },
  { code: "hi", name: "हिन्दी", short: "HI" },
];

interface LanguageDropdownProps {
  direction?: "up" | "down";
}

export function LanguageDropdown({ direction = "up" }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = (params?.locale as string) || "en";

  const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTargetUrl = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/");
    if (segments.length > 1 && ["en", "gu", "hi"].includes(segments[1])) {
      segments[1] = targetLocale;
      return segments.join("/");
    }
    return `/${targetLocale}`;
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center justify-between gap-2 font-semibold text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-900 w-full min-w-[130px]"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-900 dark:text-indigo-400 shrink-0" />
          <span>{currentLang.name}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            direction === "up" ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0"
          } w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-[100] p-1.5 animate-fade-in`}
        >
          {languages.map((l) => {
            const isSelected = currentLocale === l.code;
            return (
              <Link
                key={l.code}
                href={getTargetUrl(l.code)}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? "bg-indigo-900 dark:bg-indigo-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{l.name}</span>
                  <span className={`text-[10px] uppercase font-bold ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                    ({l.short})
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
