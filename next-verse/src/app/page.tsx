"use client";

import { useEffect, useState, useCallback } from "react";
import { getAyahData, getSurahs } from "@/lib/quran-api";
import { Surah, ArabicAyah, Translation } from "@/types/quran";

interface AyahState {
  surah: number;
  ayah: number;
  arabic: ArabicAyah | null;
  translations: Translation[];
  loading: boolean;
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahState, setAyahState] = useState<AyahState>({
    surah: 0,
    ayah: 0,
    arabic: null,
    translations: [],
    loading: false,
  });
  
  // Settings Toggles
  const [showBengali, setShowBengali] = useState(true);
  const [showDetails, setShowDetails] = useState(false); // Default setting
  const [tempShowDetails, setTempShowDetails] = useState(false); // Inline toggle
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [rangeEnabled, setRangeEnabled] = useState(false);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(114);
  const [history, setHistory] = useState<Array<{ surah: number; ayah: number }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    getSurahs().then(setSurahs).catch(console.error);
  }, []);

  // Sync tempShowDetails with showDetails when ayah changes
  useEffect(() => {
    setTempShowDetails(showDetails);
  }, [ayahState.surah, ayahState.ayah, showDetails]);

  const getRandomAyah = useCallback(() => {
    const start = Math.max(1, rangeStart);
    const end = Math.min(114, rangeEnd);
    const validSurahs: number[] = [];
    for (let i = start; i <= end; i++) {
      if (surahs.find((s) => s.number === i)) {
        validSurahs.push(i);
      }
    }
    if (validSurahs.length === 0) return;

    const randomSurah = validSurahs[Math.floor(Math.random() * validSurahs.length)];
    const surah = surahs.find((s) => s.number === randomSurah);
    if (!surah) return;

    const randomAyah = Math.floor(Math.random() * surah.numberOfAyahs) + 1;

    const newEntry = { surah: randomSurah, ayah: randomAyah };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    fetchAyah(randomSurah, randomAyah);
  }, [surahs, rangeStart, rangeEnd, history, historyIndex]);

  const fetchAyah = async (surah: number, ayah: number) => {
    setAyahState((prev) => ({ ...prev, loading: true }));
    const data = await getAyahData(surah, ayah);
    if (data) {
      setAyahState({
        surah,
        ayah,
        arabic: data.arabic,
        translations: data.translations,
        loading: false,
      });
    } else {
      setAyahState((prev) => ({ ...prev, loading: false }));
    }
  };

  const navigateAyah = async (direction: "prev" | "next") => {
    const currentSurah = surahs.find((s) => s.number === ayahState.surah);
    if (!currentSurah || !ayahState.arabic) return;

    let newSurah = ayahState.surah;
    let newAyah = ayahState.ayah + (direction === "next" ? 1 : -1);

    if (newAyah < 1) {
      const prevSurah = surahs.find((s) => s.number === newSurah - 1);
      if (prevSurah) {
        newSurah = prevSurah.number;
        newAyah = prevSurah.numberOfAyahs;
      } else {
        return;
      }
    } else if (newAyah > currentSurah.numberOfAyahs) {
      const nextSurah = surahs.find((s) => s.number === newSurah + 1);
      if (nextSurah) {
        newSurah = nextSurah.number;
        newAyah = 1;
      } else {
        return;
      }
    }

    if (rangeEnabled) {
      if (newSurah < rangeStart || newSurah > rangeEnd) return;
    }

    const newEntry = { surah: newSurah, ayah: newAyah };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    fetchAyah(newSurah, newAyah);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      fetchAyah(prev.surah, prev.ayah);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      fetchAyah(next.surah, next.ayah);
    }
  };

  const currentSurah = surahs.find((s) => s.number === ayahState.surah);
  const bengaliTranslation = ayahState.translations.find(
    (t) => t.resource_id === 161
  );
  const englishTranslation = ayahState.translations.find(
    (t) => t.resource_id === 20
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="w-full max-w-3xl mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-emerald-400">nextVerse</h1>
          <button
            onClick={getRandomAyah}
            disabled={surahs.length === 0 || ayahState.loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
          >
            🎲 Random Ayah
          </button>
        </div>
        <p className="text-slate-400 mt-2 text-sm">
          Your Quran memorization companion
        </p>
      </header>

      {/* Range Filter */}
      <div className="w-full max-w-3xl mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rangeEnabled}
                onChange={(e) => setRangeEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-300">Limit Surah Range</span>
            </label>
            {rangeEnabled && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">From:</span>
                  <input
                    type="number"
                    min={1}
                    max={114}
                    value={rangeStart}
                    onChange={(e) =>
                      setRangeStart(
                        Math.min(
                          Math.max(1, parseInt(e.target.value) || 1),
                          rangeEnd
                        )
                      )
                    }
                    className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">To:</span>
                  <input
                    type="number"
                    min={1}
                    max={114}
                    value={rangeEnd}
                    onChange={(e) =>
                      setRangeEnd(
                        Math.max(
                          Math.min(114, parseInt(e.target.value) || 114),
                          rangeStart
                        )
                      )
                    }
                    className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ayah Display */}
      <main className="w-full max-w-3xl flex-1">
        {ayahState.loading ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="animate-pulse text-slate-400">Loading...</div>
          </div>
        ) : ayahState.arabic ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            {/* Surah Info */}
            <div className="bg-slate-700/50 px-6 py-3 flex items-center justify-between border-b border-slate-700">
              <div>
                <span className="text-emerald-400 font-semibold">
                  {currentSurah?.englishName} ({currentSurah?.name})
                </span>
                <span className="text-slate-400 text-sm ml-3">
                  Surah {ayahState.surah}:{ayahState.ayah}
                </span>
              </div>
              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                {currentSurah?.revelationType}
              </span>
            </div>

            {/* Arabic Text */}
            <div className="px-6 py-8 text-center border-b border-slate-700/50">
              <p className="arabic-text text-3xl text-white leading-loose">
                {ayahState.arabic.text}
              </p>
            </div>

            {/* Translations */}
            <div className="px-6 py-4 space-y-3">
              {bengaliTranslation && (
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                    Bengali
                  </span>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {bengaliTranslation.text}
                  </p>
                </div>
              )}
              {englishTranslation && (
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                    English
                  </span>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {englishTranslation.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">
              Click the{" "}
              <span className="text-emerald-400 font-semibold">Random Ayah</span>{" "}
              button to start
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => navigateAyah("prev")}
            disabled={!ayahState.arabic || ayahState.loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            ← Previous Ayah
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              disabled={historyIndex <= 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
            >
              ↩
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
            >
              ↪
            </button>
          </div>

          <button
            onClick={() => navigateAyah("next")}
            disabled={!ayahState.arabic || ayahState.loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            Next Ayah →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl mt-8 pt-6 border-t border-slate-700/50 text-center text-slate-500 text-sm">
        <p>
          Data from{" "}
          <a
            href="https://alquran.cloud"
            className="text-slate-400 hover:text-emerald-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            alquran.cloud
          </a>{" "}
          &{" "}
          <a
            href="https://quran.com"
            className="text-slate-400 hover:text-emerald-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            quran.com
          </a>
        </p>
      </footer>
    </div>
  );
}
