"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showTagline = false,
  href,
  className = "",
}: BrandLogoProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const targetHref = href !== undefined ? href : `/${locale}`;

  const sizeClasses = {
    sm: {
      mark: "w-6 h-6",
      text: "text-base font-bold",
      sub: "text-[10px]",
    },
    md: {
      mark: "w-8 h-8",
      text: "text-xl font-extrabold tracking-tight",
      sub: "text-xs",
    },
    lg: {
      mark: "w-11 h-11",
      text: "text-2xl font-black tracking-tight",
      sub: "text-xs",
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Mark SVG */}
      <div className={`relative flex-shrink-0 ${sizeClasses.mark}`}>
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Rounded Ticket Body */}
          <rect
            x="96"
            y="80"
            width="320"
            height="352"
            rx="72"
            stroke="currentColor"
            className="text-indigo-900 dark:text-indigo-400"
            strokeWidth="40"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Needle Eye Slot */}
          <rect
            x="236"
            y="128"
            width="40"
            height="84"
            rx="20"
            fill="currentColor"
            className="text-indigo-900 dark:text-indigo-400"
          />
          {/* Golden / Amber Verified Thread Tick */}
          <path
            d="M160 260 L236 336 L368 184"
            stroke="#E9A21B"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <span className={`${sizeClasses.text} text-slate-900 dark:text-white`}>
          Silai<span className="text-amber-500">Book</span>
        </span>
        {showTagline && (
          <span className={`${sizeClasses.sub} text-slate-500 dark:text-slate-400 font-medium`}>
            {locale === "gu" ? "સિલાઈબુક" : locale === "hi" ? "सिलाईबुक" : "Piece-Rate Ledger"}
          </span>
        )}
      </div>
    </div>
  );

  if (targetHref) {
    return (
      <Link href={targetHref} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
