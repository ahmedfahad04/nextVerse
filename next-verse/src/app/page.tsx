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

  // New settings for custom fonts and sizes
  const [arabicFont, setArabicFont] = useState("font-arabic"); // default Amiri
  const [fontSize, setFontSize] = useState(32); // base font size in px
  const [bengaliFontSize, setBengaliFontSize] = useState(18);

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
    <div className="min-h-screen relative flex flex-col items-center px-4 py-6 md:py-8 overflow-hidden safe-area-inset">
      <div className="islamic-pattern" />
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 md:p-8 shadow-2xl border border-emerald-50">
            <h2 className="text-xl md:text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              ⚙️ Settings
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-medium text-sm md:text-base">Show Bengali Translation</span>
                <button 
                  onClick={() => setShowBengali(!showBengali)}
                  className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-colors relative ${showBengali ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 md:w-5 h-4 md:h-5 bg-white rounded-full transition-transform ${showBengali ? 'translate-x-5 md:translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-medium text-xs md:text-sm">Default Show Ayah Details</span>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-colors relative ${showDetails ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 md:w-5 h-4 md:h-5 bg-white rounded-full transition-transform ${showDetails ? 'translate-x-5 md:translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-emerald-50">
                {/* Arabic Font Preview */}
                <div className="mt-3 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl text-center overflow-hidden">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-2 opacity-50">Preview</p>
                  <p className={`${arabicFont} text-2xl md:text-3xl text-emerald-950 leading-relaxed`} dir="rtl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
                <label className="block text-emerald-800 font-medium text-sm mb-2">Preferred Arabic Font</label>
                <select 
                  value={arabicFont}
                  onChange={(e) => setArabicFont(e.target.value)}
                  className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                >
                  <option value="font-arabic">Amiri (Default)</option>
                  <option value="font-mushaf">Al Mushaf Quran</option>
                  <option value="font-muhammadi">Muhammadi Quranic</option>
                  <option value="font-nabi">Nabi</option>
                </select>
                
                
              </div>

              <div className="pt-4 border-t border-emerald-50">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={rangeEnabled}
                    onChange={(e) => setRangeEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-800 font-medium text-sm">Restrict Surah Range</span>
                </label>
                {rangeEnabled && (
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">Start</span>
                      <input
                        type="text"
                        min={1}
                        max={114}
                        value={rangeStart}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setRangeStart(0 as any); // allow clear
                            return;
                          }
                          const num = Math.min(Math.max(1, parseInt(val) || 1), 114);
                          setRangeStart(num);
                        }}
                        onBlur={() => {
                          if (!rangeStart) setRangeStart(1);
                          if (rangeStart > rangeEnd) setRangeStart(rangeEnd);
                        }}
                        className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">End</span>
                      <input
                        type="text"
                        min={1}
                        max={114}
                        value={rangeEnd}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setRangeEnd(0 as any); // allow clear
                            return;
                          }
                          const num = Math.min(Math.max(1, parseInt(val) || 1), 114);
                          setRangeEnd(num);
                        }}
                        onBlur={() => {
                          if (!rangeEnd) setRangeEnd(114);
                          if (rangeEnd < rangeStart) setRangeEnd(rangeStart);
                        }}
                        className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full mt-8 md:mt-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 text-sm md:text-base"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center gap-3 md:gap-5 group transition-all duration-500">
          {/* <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-800 drop-shadow-sm group-hover:fill-emerald-600 transition-colors">
              <path d="M50 5 L63 25 L85 25 L75 44 L90 63 L70 63 L60 85 L44 75 L25 90 L25 70 L5 60 L25 44 L15 25 L37 25 Z" />
              <path d="M50 15 L58 30 L78 30 L68 44 L81 58 L63 58 L54 75 L43 66 L30 78 L30 58 L18 52 L32 41 L27 30 L45 30 Z" fill="white" />
              <circle cx="50" cy="50" r="8" className="fill-emerald-800 group-hover:fill-emerald-600" />
            </svg>
          </div> */}
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-emerald-950 uppercase leading-none selection:bg-islam-gold selection:text-white">
              next<span className="text-emerald-700">Verse</span>
            </h1>
            <p className="text-emerald-900/40 text-[9px] md:text-xs font-bold tracking-[0.3em] uppercase mt-1">
              Divine Reflection & Practice
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 md:p-4 glass-card bg-emerald-900/5 hover:bg-emerald-900/10 rounded-full text-emerald-800 transition-all active:scale-95 border border-emerald-900/10"
        >
          <span className="text-xl md:text-2xl drop-shadow-sm">⚙️</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center mb-36 md:mb-40">
        {ayahState.loading ? (
          <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white/40 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] border-2 border-white/60 shadow-2xl">
            <div className="relative group/loading">
              <div className="w-24 h-24 md:w-32 md:h-32 border-[6px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin shadow-inner" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl md:text-5xl animate-bounce">
                📖
              </div>
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
            </div>
            <div className="mt-8 md:mt-12 text-emerald-900/40 text-[10px] md:text-sm font-black tracking-[0.4em] uppercase text-center max-w-[200px] leading-loose">
              Refining the <br/> Divine Verse
            </div>
          </div>
        ) : ayahState.arabic ? (
          <div className="w-full relative group px-2 md:px-0">
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(6,78,59,0.05)] text-center relative overflow-hidden transition-all duration-700 group-hover:shadow-[0_20px_70px_rgba(6,78,59,0.1)]">
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-emerald-100/30">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setTempShowDetails(!tempShowDetails)}
                    className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2"
                  >
                    <span>{tempShowDetails ? "🙈" : "👁️"}</span>
                    <span>{tempShowDetails ? "Hide Context" : "Show Context"}</span>
                  </button>
                </div>

                {/* Securely Positioned Font Controls */}
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <button 
                    onClick={() => setFontSize(prev => Math.min(prev + 4, 80))}
                    className="w-10 h-10 flex items-center justify-center bg-white text-emerald-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90 border border-emerald-100"
                    title="Increase Font"
                  >
                    <span className="text-sm font-black">A+</span>
                  </button>
                  <button 
                    onClick={() => setFontSize(prev => Math.max(prev - 4, 16))}
                    className="w-10 h-10 flex items-center justify-center bg-white text-emerald-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90 border border-emerald-100"
                    title="Decrease Font"
                  >
                    <span className="text-sm font-black">A-</span>
                  </button>
                </div>
              </div>

              {tempShowDetails && (
                <div className="mb-8 animate-fade-in translate-y-4">
                  <span className="text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-3 inline-block">
                    {currentSurah?.englishName} • {currentSurah?.revelationType}
                  </span>
                  <p className="text-emerald-800/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                    Surah {ayahState.surah} • Ayah {ayahState.ayah}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <p 
                  className={`${arabicFont} text-emerald-950 leading-[1.8] md:leading-[2] px-4`}
                  style={{ fontSize: `${fontSize}px` }}
                  dir="rtl"
                >
                  {ayahState.arabic.text}
                </p>
                
                {showBengali && bengaliTranslation && (
                  <div className="pt-6 border-t border-emerald-100/40 mt-6 max-w-3xl mx-auto">
                    <p 
                      className="bengali-text text-emerald-900/70 font-medium leading-relaxed italic"
                      style={{ fontSize: `${Math.max(14, fontSize * 0.45)}px` }}
                    >
                      {bengaliTranslation.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center group cursor-pointer" onClick={getRandomAyah}>
            <div className="text-6xl md:text-8xl mb-6 md:mb-8 animate-float opacity-80 group-hover:scale-110 transition-transform duration-500 cursor-pointer select-none">🌙</div>
            <p className="text-emerald-900 text-xl md:text-2xl font-semibold opacity-60 group-hover:opacity-100 transition-opacity px-6">
              Tap the moon to reveal a verse
            </p>
          </div>
        )}
      </main>

      {/* Navigation Controls Fixed at Bottom */}
      <div className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-6 z-40 w-full max-w-xs md:max-w-sm px-4">
        <button
          onClick={() => navigateAyah("prev")}
          disabled={!ayahState.arabic || ayahState.loading}
          className="flex-1 flex flex-col items-center gap-1 group disabled:opacity-30"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur rounded-full flex items-center justify-center border border-emerald-100 text-emerald-700 font-bold transition-all group-active:scale-75 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <span className="text-lg md:text-xl">◀</span>
          </div>
          <span className="text-[8px] md:text-[10px] font-bold text-emerald-800/40 uppercase tracking-tighter">Prev</span>
        </button>

        <button
          onClick={getRandomAyah}
          disabled={surahs.length === 0 || ayahState.loading}
          className="relative group transition-transform active:scale-90"
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl md:blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(5,150,105,0.4)] border-4 border-white transition-all group-hover:bg-emerald-500 overflow-hidden">
             <span className="text-3xl md:text-4xl transform group-hover:rotate-12 transition-transform select-none">🎲</span>
          </div>
          <div className="mt-2 text-[9px] md:text-[10px] font-bold text-emerald-800 uppercase tracking-widest text-center">Random</div>
        </button>

        <button
          onClick={() => navigateAyah("next")}
          disabled={!ayahState.arabic || ayahState.loading}
          className="flex-1 flex flex-col items-center gap-1 group disabled:opacity-30"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur rounded-full flex items-center justify-center border border-emerald-100 text-emerald-700 font-bold transition-all group-active:scale-75 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <span className="text-lg md:text-xl">▶</span>
          </div>
          <span className="text-[8px] md:text-[10px] font-bold text-emerald-800/40 uppercase tracking-tighter">Next</span>
        </button>
      </div>

      {/* History Controls */}
      {/* <div className="fixed bottom-6 right-6 md:right-8 flex gap-2 md:gap-3 z-40 scale-[0.8] md:scale-100 origin-bottom-right">
        <button 
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="p-2.5 md:p-3 bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-xl text-emerald-700 disabled:opacity-20 hover:bg-white/80 transition-all shadow-sm active:scale-95"
        >
          ↩
        </button>
        <button 
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="p-2.5 md:p-3 bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-xl text-emerald-700 disabled:opacity-20 hover:bg-white/80 transition-all shadow-sm active:scale-95"
        >
          ↪
        </button>
      </div> */}

    </div>
  );
}
