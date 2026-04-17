const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /\{\/\* Settings Modal \*\/\}(.|\n)*?\/\/ <\/div>\n\s*\)\}/m;

const replacement = `{/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-3">
          <div className="min-h-full flex items-center justify-center py-6">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-emerald-50">
              <h2 className="text-lg md:text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                ⚙️ Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-800 font-medium text-xs md:text-sm">
                    Show Bengali Translation
                  </span>
                  <button
                    onClick={() => setShowBengali(!showBengali)}
                    className={\`w-9 md:w-10 h-5 rounded-full transition-colors relative \${showBengali ? "bg-emerald-500" : "bg-slate-300"}\`}
                  >
                    <div
                      className={\`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform \${showBengali ? "translate-x-4 md:translate-x-5" : ""}\`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-emerald-800 font-medium text-xs md:text-sm">
                    Default Show Ayah Details
                  </span>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={\`w-9 md:w-10 h-5 rounded-full transition-colors relative \${showDetails ? "bg-emerald-500" : "bg-slate-300"}\`}
                  >
                    <div
                      className={\`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform \${showDetails ? "translate-x-4 md:translate-x-5" : ""}\`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-emerald-50">
                  <label className="block text-emerald-800 font-medium text-xs md:text-sm mb-2">
                    Quranic Reciter
                  </label>
                  <select
                    value={selectedReciterId}
                    onChange={(e) =>
                      handleReciterChange(parseInt(e.target.value))
                    }
                    className="w-full px-2 py-1.5 md:py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-xs font-medium"
                  >
                    {reciters.length === 0 ? (
                      <option value={selectedReciterId}>
                        Loading reciters...
                      </option>
                    ) : (
                      reciters.map((reciter) => (
                        <option key={reciter.id} value={reciter.id}>
                          {reciter.englishName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="pt-3 border-t border-emerald-50">
                  <label className="flex items-center justify-between">
                    <span className="text-emerald-800 font-medium text-xs md:text-sm">
                      Audio Autoplay
                    </span>
                    <button
                      onClick={() => setAudioAutoplay(!audioAutoplay)}
                      className={\`w-9 md:w-10 h-5 rounded-full transition-colors relative \${audioAutoplay ? "bg-emerald-500" : "bg-slate-300"}\`}
                    >
                      <div
                        className={\`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform \${audioAutoplay ? "translate-x-4 md:translate-x-5" : ""}\`}
                      />
                    </button>
                  </label>
                  <p className="text-[10px] text-emerald-600/60 mt-1">
                    Auto-play audio when loaded
                  </p>
                </div>

                {/* Arabic Font Preview */}
                <div className="mt-2 p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl text-center overflow-hidden">
                  <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-1 opacity-50">
                    Preview
                  </p>
                  <p
                    className={\`\${arabicFont} text-xl md:text-2xl text-emerald-950 leading-relaxed\`}
                    dir="rtl"
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
                <div className="pb-2">
                  <label className="block text-emerald-800 font-medium text-xs md:text-sm mb-1.5">
                    Arabic Font
                  </label>
                  <select
                    value={arabicFont}
                    onChange={(e) => setArabicFont(e.target.value)}
                    className="w-full px-2 py-1.5 md:py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-xs"
                  >
                    <option value="font-arabic">Amiri (Default)</option>
                    <option value="font-mushaf">Al Mushaf Quran</option>
                    <option value="font-muhammadi">Muhammadi Quranic</option>
                    <option value="font-nabi">Nabi</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-emerald-50">
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={rangeEnabled}
                      onChange={(e) => setRangeEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-800 font-medium text-xs md:text-sm">
                      Restrict Surah Range
                    </span>
                  </label>
                  
                  {rangeEnabled && surahs.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {/* From Surah/Ayat */}
                      <div className="flex items-end gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[9px] text-emerald-600 font-bold uppercase">
                            From Surah
                          </span>
                          <SurahSelector
                            surahs={surahs}
                            selectedSurah={rangeStart}
                            onChange={setRangeStart}
                            label="Choose start"
                            showAyatCount={false}
                          />
                        </div>
                        <div className="w-16 flex flex-col gap-1">
                          <span className="text-[9px] text-emerald-600 font-bold uppercase">
                            Ayat
                          </span>
                          <input
                            type="number"
                            min={1}
                            max={
                              surahs.find((s) => s.number === rangeStart)?.numberOfAyahs || 1
                            }
                            value={rangeStartAyat}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              const maxAyat = surahs.find((s) => s.number === rangeStart)?.numberOfAyahs || 1;
                              setRangeStartAyat(Math.min(Math.max(1, val), maxAyat));
                            }}
                            className="w-full px-2 h-[34px] bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-xs text-center"
                          />
                        </div>
                      </div>

                      {/* To Surah/Ayat */}
                      <div className="flex items-end gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[9px] text-emerald-600 font-bold uppercase">
                            To Surah
                          </span>
                          <SurahSelector
                            surahs={surahs}
                            selectedSurah={rangeEnd}
                            onChange={setRangeEnd}
                            label="Choose end"
                            showAyatCount={false}
                          />
                        </div>
                        <div className="w-16 flex flex-col gap-1">
                          <span className="text-[9px] text-emerald-600 font-bold uppercase">
                            Ayat
                          </span>
                          <input
                            type="number"
                            min={1}
                            max={
                              surahs.find((s) => s.number === rangeEnd)?.numberOfAyahs || 1
                            }
                            value={rangeEndAyat}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              const maxAyat = surahs.find((s) => s.number === rangeEnd)?.numberOfAyahs || 1;
                              setRangeEndAyat(Math.min(Math.max(1, val), maxAyat));
                            }}
                            className="w-full px-2 h-[34px] bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    resetSettings();
                    setShowBengali(true);
                    setShowDetails(false);
                    setSelectedReciterId(4);
                    setArabicFont("font-arabic");
                    setFontSize(32);
                    setRangeEnabled(false);
                    setRangeStart(1);
                    setRangeEnd(114);
                    setRangeStartAyat(1);
                    setRangeEndAyat(1);
                    setAudioAutoplay(false);
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-sm active:scale-95 text-xs md:text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 text-xs md:text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}`;

if (!regex.test(content)) {
  console.log("Regex didn't match.");
  process.exit(1);
}

const newContent = content.replace(regex, replacement);
fs.writeFileSync('src/app/page.tsx', newContent);
console.log("Patched page.tsx successfully.");
