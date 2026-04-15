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

  return (
    <div className="min-h-screen relative flex flex-col items-center px-4 py-8 overflow-hidden">
      <div className="islamic-pattern" />
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-emerald-50">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              ⚙️ Settings
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-medium">Show Bengali Translation</span>
                <button 
                  onClick={() => setShowBengali(!showBengali)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${showBengali ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showBengali ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-medium text-sm">Default Show Ayah Details</span>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${showDetails ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showDetails ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-emerald-50">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={rangeEnabled}
                    onChange={(e) => setRangeEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-800 font-medium">Restrict Surah Range</span>
                </label>
                {rangeEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-emerald-600 font-bold">Start Surah</span>
                      <input
                        type="number"
                        min={1}
                        max={114}
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Math.min(Math.max(1, parseInt(e.target.value) || 1), rangeEnd))}
                        className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-emerald-600 font-bold">End Surah</span>
                      <input
                        type="number"
                        min={1}
                        max={114}
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Math.max(Math.min(114, parseInt(e.target.value) || 114), rangeStart))}
                        className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full mt-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-tr from-emerald-800 to-emerald-600 bg-clip-text text-transparent italic">
            nextVerse
          </h1>
          <p className="text-emerald-900/60 text-sm font-medium tracking-wide">
            Divine Reflection & Practicing
          </p>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-2xl text-emerald-700 hover:bg-white/80 transition-all shadow-sm"
        >
          <span className="text-xl">⚙️</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center mb-40">
        {ayahState.loading ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="text-5xl mb-4 text-emerald-400">✨</div>
            <div className="text-emerald-800/40 font-bold text-xl uppercase tracking-widest">Loading Ayah...</div>
          </div>
        ) : ayahState.arabic ? (
          <div className="w-full relative group">
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(6,78,59,0.05)] text-center relative overflow-hidden transition-all duration-700 group-hover:shadow-[0_20px_70px_rgba(6,78,59,0.1)]">
              
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button 
                  onClick={() => setTempShowDetails(!tempShowDetails)}
                  className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                >
                  {tempShowDetails ? "🙈 Hide Details" : "👁️ Show Details"}
                </button>
              </div>

              {tempShowDetails && (
                <div className="mb-10 animate-fade-in">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-3 inline-block">
                    {currentSurah?.englishName} • {currentSurah?.revelationType}
                  </span>
                  <p className="text-emerald-800/40 text-sm font-medium">
                    Surah {ayahState.surah} : Ayah {ayahState.ayah}
                  </p>
                </div>
              )}

              <div className="mb-12">
                <p className="arabic-text text-4xl md:text-6xl text-emerald-950 leading-[1.8] md:leading-[1.8]">
                  {ayahState.arabic.text}
                </p>
              </div>

              {showBengali && bengaliTranslation && (
                <div className="pt-10 border-t border-emerald-100/50">
                  <p className="bengali-text text-xl md:text-2xl text-emerald-900 leading-relaxed font-medium">
                    {bengaliTranslation.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center group">
            <div className="text-8xl mb-8 animate-float opacity-80 cursor-default select-none">🌙</div>
            <p className="text-emerald-900 text-2xl font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
              Tap the button to reveal a verse
            </p>
          </div>
        )}
      </main>

      {/* Navigation Controls Fixed at Bottom */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40 w-full max-w-sm px-4">
        <button
          onClick={() => navigateAyah("prev")}
          disabled={!ayahState.arabic || ayahState.loading}
          className="flex-1 flex flex-col items-center gap-1 group disabled:opacity-30"
        >
          <div className="w-14 h-14 bg-white/80 backdrop-blur rounded-full flex items-center justify-center border border-emerald-100 text-emerald-700 font-bold transition-all group-active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <span className="text-xl">◀</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-tighter">Previous</span>
        </button>

        <button
          onClick={getRandomAyah}
          disabled={surahs.length === 0 || ayahState.loading}
          className="relative group transition-transform active:scale-95"
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(5,150,105,0.4)] border-4 border-white transition-all group-hover:bg-emerald-500 overflow-hidden">
             <span className="text-4xl transform group-hover:rotate-12 transition-transform select-none">🎲</span>
          </div>
          <div className="mt-3 text-[10px] font-bold text-emerald-800 uppercase tracking-widest text-center">Random</div>
        </button>

        <button
          onClick={() => navigateAyah("next")}
          disabled={!ayahState.arabic || ayahState.loading}
          className="flex-1 flex flex-col items-center gap-1 group disabled:opacity-30"
        >
          <div className="w-14 h-14 bg-white/80 backdrop-blur rounded-full flex items-center justify-center border border-emerald-100 text-emerald-700 font-bold transition-all group-active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <span className="text-xl">▶</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-tighter">Next</span>
        </button>
      </div>

      {/* History Controls */}
      <div className="fixed bottom-6 right-8 flex gap-3 z-40 scale-75 md:scale-100">
        <button 
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="p-3 bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-xl text-emerald-700 disabled:opacity-20 hover:bg-white/80 transition-all shadow-sm"
        >
          ↩
        </button>
        <button 
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="p-3 bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-xl text-emerald-700 disabled:opacity-20 hover:bg-white/80 transition-all shadow-sm"
        >
          ↪
        </button>
      </div>

    </div>
  );
}
