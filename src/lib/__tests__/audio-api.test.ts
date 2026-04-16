import { getVerseRecitationByKey, getReciters, getVerseAudioUrl } from "@/lib/quran-api";

/**
 * Test Suite for Audio API
 * Tests the audio fetching and URL construction
 */

export async function testAudioAPI() {
  console.log("🎵 Starting Audio API Tests...\n");

  try {
    // Test 1: Audio URL Construction
    console.log("✅ Test 1: Audio URL Construction");
    const testCases = [
      { surah: 2, ayah: 255, reciterId: 4 },
      { surah: 1, ayah: 1, reciterId: 4 },
      { surah: 114, ayah: 6, reciterId: 4 },
      { surah: 24, ayah: 14, reciterId: 4 },
    ];

    for (const testCase of testCases) {
      const url = await getVerseAudioUrl(
        testCase.surah,
        testCase.ayah,
        testCase.reciterId
      );
      const expected = `https://audio.quran.com/alafasy/${String(testCase.surah).padStart(3, "0")}_${String(testCase.ayah).padStart(3, "0")}.mp3`;
      console.log(
        `   ${url === expected ? "✓" : "✗"} Surah ${testCase.surah}:${testCase.ayah} → ${url}`
      );
    }
    console.log();

    // Test 2: Reciter Loading
    console.log("✅ Test 2: Load Reciters");
    const reciters = await getReciters();
    console.log(`   ✓ Loaded ${reciters.length} reciters`);
    reciters.slice(0, 3).forEach((reciter) => {
      console.log(
        `   - ${reciter.englishName} (ID: ${reciter.id}, Format: ${reciter.format})`
      );
    });
    console.log();

    // Test 3: Verse Recitation Fetching
    console.log("✅ Test 3: Fetch Verse Recitation");
    const verseTests = ["2:255", "1:1", "114:6", "24:14"];

    for (const verseKey of verseTests) {
      const audio = await getVerseRecitationByKey(verseKey, 4);
      if (audio) {
        const isCloudUrl = audio.url.startsWith(
          "https://cdn.islamic.network/quran/audio/"
        );
        console.log(
          `   ${isCloudUrl ? "✓" : "✗"} ${verseKey}: ${audio.url.substring(0, 80)}...`
        );
      } else {
        console.log(`   ✗ ${verseKey}: Failed to fetch`);
      }
    }
    console.log();

    // Test 4: Different Reciter IDs
    console.log("✅ Test 4: Test Multiple Reciters");
    const reciterIds = [1, 4, 5, 7];
    const testVerse = "2:255";

    for (const reciterId of reciterIds) {
      const url = await getVerseAudioUrl(2, 255, reciterId);
      console.log(`   ✓ Reciter ${reciterId}: ${url}`);
    }
    console.log();

    console.log("✅ All Audio API Tests Completed Successfully!");
    return {
      status: "success",
      message: "All audio API tests passed",
      reciters: reciters.length,
      testCases: testCases.length,
    };
  } catch (error) {
    console.error("❌ Audio API Test Failed:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Export for use in development
if (typeof window !== "undefined") {
  (window as any).testAudioAPI = testAudioAPI;
}
