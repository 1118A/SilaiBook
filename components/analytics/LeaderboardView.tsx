"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trophy, Eye, EyeOff } from "lucide-react";
import { TailorPerformanceMetric } from "@/lib/analytics/engine";
import { formatINR } from "@/lib/money";

interface LeaderboardViewProps {
  metrics: TailorPerformanceMetric[];
}

export function LeaderboardView({ metrics }: LeaderboardViewProps) {
  const t = useTranslations();
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(true);

  // Sort tailors by verified pieces descending
  const rankedTailors = [...metrics].sort((a, b) => b.verifiedPieces - a.verifiedPieces);

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t("analytics.leaderboard")}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition"
        >
          {showLeaderboard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{t("analytics.toggleLeaderboard")}</span>
        </button>
      </div>

      {showLeaderboard && (
        <div className="space-y-3">
          {rankedTailors.map((tailor, index) => {
            const rank = index + 1;
            return (
              <div
                key={tailor.tailorId}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center ${
                      rank === 1
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                        : rank === 2
                        ? "bg-slate-300 text-slate-950"
                        : rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {rank === 1 ? <Trophy className="w-4 h-4" /> : rank === 2 ? <Medal className="w-4 h-4" /> : `#${rank}`}
                  </div>

                  <div>
                    <div className="font-bold text-white text-sm">{tailor.tailorName}</div>
                    <div className="text-xs text-slate-400 font-medium">
                      Avg {tailor.avgPiecesPerDay} pcs/day • Rejection: {tailor.rejectionRatePercent}%
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-violet-400">
                    {tailor.verifiedPieces} pcs
                  </div>
                  <div className="text-xs font-semibold text-emerald-400">
                    {formatINR(tailor.totalEarningsPaise)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
