"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";

const emptySubscribe = () => () => {};

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.replace(`/${locale}/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isClient, isAuthenticated, router, locale, pathname]);

  if (!isClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t("protectedNotice")}</p>
          <div className="animate-pulse text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Redirecting to sign-in page...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
