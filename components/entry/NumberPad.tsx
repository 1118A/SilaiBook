"use client";

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
    <div className="w-full max-w-sm mx-auto bg-slate-900/90 dark:bg-slate-950 p-4 rounded-3xl shadow-xl border border-slate-800">
      <div className="grid grid-cols-3 gap-3 text-center">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handlePress(n)}
            className="h-16 rounded-2xl bg-slate-800 hover:bg-violet-600/80 text-white font-bold text-2xl active:scale-95 transition shadow"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          className="h-16 rounded-2xl bg-rose-950/60 hover:bg-rose-700/80 text-rose-300 font-bold text-lg active:scale-95 transition border border-rose-800/50"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handlePress("0")}
          className="h-16 rounded-2xl bg-slate-800 hover:bg-violet-600/80 text-white font-bold text-2xl active:scale-95 transition shadow"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-16 rounded-2xl bg-amber-950/60 hover:bg-amber-700/80 text-amber-300 font-bold text-lg active:scale-95 transition border border-amber-800/50"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
