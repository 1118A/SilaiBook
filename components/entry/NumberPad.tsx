"use client";

import { Delete, RotateCcw } from "lucide-react";

interface NumberPadProps {
  value: number | string;
  onChange: (val: number) => void;
}

export function NumberPad({ value, onChange }: NumberPadProps) {
  const handlePress = (num: string) => {
    const currentStr = value === 0 || value === "" ? "" : String(value);
    const newStr = currentStr + num;
    const parsed = parseInt(newStr, 10);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleBackspace = () => {
    const currentStr = String(value);
    if (currentStr.length <= 1) {
      onChange(0);
    } else {
      const newStr = currentStr.slice(0, -1);
      onChange(parseInt(newStr, 10) || 0);
    }
  };

  const handleClear = () => {
    onChange(0);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
      <div className="grid grid-cols-3 gap-3 text-center">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handlePress(n)}
            className="h-16 rounded-2xl bg-slate-800 hover:bg-violet-600 text-white font-bold text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          title="Clear"
          className="h-16 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 font-semibold text-sm active:scale-95 transition-all border border-rose-800/40 flex items-center justify-center gap-1"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => handlePress("0")}
          className="h-16 rounded-2xl bg-slate-800 hover:bg-violet-600 text-white font-bold text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          title="Backspace"
          className="h-16 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 font-semibold text-sm active:scale-95 transition-all border border-amber-800/40 flex items-center justify-center"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
