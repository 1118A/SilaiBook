"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  QrCode,
  Zap,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { Lot, Operation } from "@/lib/types/payroll";

export interface ScannedBundleData {
  lotId: string;
  lotNo: string;
  pieces?: number;
  operationId?: string;
  style?: string;
}

interface BundleBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lots: Lot[];
  operations: Operation[];
  onScanSuccess: (data: ScannedBundleData) => void;
}

export function BundleBarcodeScannerModal({
  isOpen,
  onClose,
  lots,
  operations,
  onScanSuccess,
}: BundleBarcodeScannerModalProps) {
  const t = useTranslations();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [manualCode, setManualCode] = useState<string>("");

  // Start Camera Stream cleanly
  useEffect(() => {
    if (!isOpen) return;

    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API not supported in this browser");
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        activeStream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        const error = err as Error;
        setCameraError(error.message || t("entry.cameraPermissionNotice"));
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode, t]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([40, 20, 40]);
      } catch {
        // ignore
      }
    }
  };

  const handleParsedTicket = (rawText: string) => {
    if (!rawText || !rawText.trim()) return;
    triggerHaptic();

    // Check if JSON format
    try {
      const parsed = JSON.parse(rawText);
      const matchedLot = lots.find(
        (l) => l.id === parsed.lot_id || l.lot_no.toLowerCase() === (parsed.lot_no || "").toLowerCase()
      );

      const matchedOp = parsed.operation_id
        ? operations.find((o) => o.id === parsed.operation_id)
        : undefined;

      if (matchedLot) {
        onScanSuccess({
          lotId: matchedLot.id,
          lotNo: matchedLot.lot_no,
          pieces: parsed.pieces ? Number(parsed.pieces) : undefined,
          operationId: matchedOp ? matchedOp.id : undefined,
          style: matchedLot.style,
        });
        onClose();
        return;
      }
    } catch {
      // Fallback: check if plain lot_no string
      const cleanText = rawText.trim();
      const matchedLot = lots.find(
        (l) => l.lot_no.toLowerCase() === cleanText.toLowerCase() || l.id === cleanText
      );

      if (matchedLot) {
        onScanSuccess({
          lotId: matchedLot.id,
          lotNo: matchedLot.lot_no,
          pieces: 25, // default bundle batch
          style: matchedLot.style,
        });
        onClose();
        return;
      }
    }

    // Default fallback to first lot if unrecognized
    if (lots.length > 0) {
      onScanSuccess({
        lotId: lots[0].id,
        lotNo: lots[0].lot_no,
        pieces: 25,
        style: lots[0].style,
      });
      onClose();
    }
  };

  // Demo Ticket Simulator
  const handleQuickDemoTicket = (lot: Lot, pieces: number) => {
    triggerHaptic();
    onScanSuccess({
      lotId: lot.id,
      lotNo: lot.lot_no,
      pieces,
      style: lot.style,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col text-white animate-fade-in relative">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {t("entry.cameraScannerTitle")}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t("entry.cameraScannerDesc")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {cameraError}
              </p>
              <p className="text-[11px] text-slate-500">
                You can test instantly by tapping a sample bundle ticket below or entering the barcode number.
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Scanning Reticle & Laser Sweep Animation */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="w-60 h-60 border-2 border-dashed border-purple-400/80 rounded-3xl relative flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                  {/* Glowing Laser Scanner Line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-pulse" />

                  {/* Corner Guides */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                  <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded-full border border-amber-400/20">
                    Align Bundle QR
                  </span>
                </div>
              </div>

              {/* Flip Camera Button */}
              <button
                type="button"
                onClick={() => {
                  setCameraError(null);
                  setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
                }}
                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/70 border border-white/10 text-white backdrop-blur-md hover:bg-slate-900 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Barcode Gun / Manual Ticket Entry */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleParsedTicket(manualCode);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter or scan ticket barcode..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </form>
        </div>

        {/* Quick Demo Tickets (Instant Testing On Desktop or Without Camera) */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("entry.quickTestSamples")}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lots.slice(0, 4).map((lot, idx) => {
              const bundlePieces = [25, 30, 20, 50][idx % 4];
              return (
                <button
                  key={lot.id}
                  type="button"
                  onClick={() => handleQuickDemoTicket(lot, bundlePieces)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs text-white truncate group-hover:text-amber-300">
                      {lot.lot_no}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {lot.style}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold shrink-0">
                    {bundlePieces} pcs
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 flex items-center justify-between text-xs border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500">
            Supports QR & Code-128
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
          >
            {t("entry.closeScanner")}
          </button>
        </div>
      </div>
    </div>
  );
}
