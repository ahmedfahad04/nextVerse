"use client";

import { Surah } from "@/types/quran";

interface SurahSelectorProps {
  surahs: Surah[];
  selectedSurah: number;
  onChange: (surahNumber: number) => void;
  label?: string;
}

export default function SurahSelector({
  surahs,
  selectedSurah,
  onChange,
  label = "Select Surah",
}: SurahSelectorProps) {
  return (
    <select
      value={selectedSurah}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
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
  );
}
