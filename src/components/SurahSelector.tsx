"use client";

import { Surah } from "@/types/quran";

interface SurahSelectorProps {
  surahs: Surah[];
  selectedSurah: number;
  onChange: (surahNumber: number) => void;
  label?: string;
  showAyatCount?: boolean;
}

export default function SurahSelector({
  surahs,
  selectedSurah,
  onChange,
  label = "Select Surah",
  showAyatCount = false,
}: SurahSelectorProps) {
  const selectedSurahObj = surahs.find(s => s.number === selectedSurah);
  const ayatCount = selectedSurahObj?.numberOfAyahs || 0;

  return (
    <div className="w-full flex flex-col gap-1">
      <select
        value={selectedSurah}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-2 py-1.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-xs font-medium h-[34px]"
      >
        <option value={0} disabled>
          {label}
        </option>
        {surahs.map((surah) => (
          <option key={surah.number} value={surah.number}>
            {surah.number}. {surah.englishName} ({surah.name})
          </option>
        ))}
      </select>
      {showAyatCount && selectedSurah > 0 && (
        <div className="text-[10px] text-emerald-600/70 font-medium pl-1">
          Ayat: {ayatCount}
        </div>
      )}
    </div>
  );
}
