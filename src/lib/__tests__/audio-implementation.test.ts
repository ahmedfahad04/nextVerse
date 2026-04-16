/**
 * Audio Implementation Test & Verification
 * Tests the audio API integration and player functionality
 */

import { 
  getVerseAudioUrl, 
  getReciters, 
  getVerseRecitationByKey,
  getVerseRecitationsByChapter 
} from "@/lib/quran-api";

/**
 * Test Case 1: Verify Audio URL Construction
 * Tests that audio URLs are constructed correctly for various verses
 */
export async function testAudioURLConstruction() {
  console.log("🧪 Test 1: Audio URL Construction");
  console.log("=====================================\n");

  const testCases = [
    { surah: 2, ayah: 255, expected: "https://audio.quran.com/alafasy/002_255.mp3" },
    { surah: 1, ayah: 1, expected: "https://audio.quran.com/alafasy/001_001.mp3" },
    { surah: 23, ayah: 46, expected: "https://audio.quran.com/alafasy/023_046.mp3" },
    { surah: 114, ayah: 6, expected: "https://audio.quran.com/alafasy/114_006.mp3" },
  ];

  let passCount = 0;
  for (const testCase of testCases) {
    const url = await getVerseAudioUrl(testCase.surah, testCase.ayah, 4);
    const passed = url === testCase.expected;
    passCount += passed ? 1 : 0;

    console.log(`${passed ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`  Input: Surah ${testCase.surah}, Ayah ${testCase.ayah}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got:      ${url}`);
    console.log();
  }

  return {
    test: "Audio URL Construction",
    passed: passCount,
    total: testCases.length,
    status: passCount === testCases.length ? "✅ PASSED" : "❌ FAILED",
  };
}

/**
 * Test Case 2: Verify Reciter Loading
 * Tests that reciters are loaded correctly from the API
 */
export async function testReciterLoading() {
  console.log("🧪 Test 2: Reciter Loading");
  console.log("=====================================\n");

  try {
    const reciters = await getReciters();

    console.log(`✅ Successfully loaded ${reciters.length} reciters\n`);
    console.log("Available Reciters:");
    console.log("-------------------");

    reciters.forEach((reciter, index) => {
      console.log(
        `${index + 1}. ${reciter.englishName} (ID: ${reciter.id}) - Format: ${reciter.format}`
      );
    });
    console.log();

    const hasAlFasy = reciters.some((r) => r.id === 4);
    console.log(`Default Reciter (Al-Afasy) Available: ${hasAlFasy ? "✅ YES" : "❌ NO"}`);

    return {
      test: "Reciter Loading",
      recitersLoaded: reciters.length,
      hasDefaultReciter: hasAlFasy,
      status: hasAlFasy ? "✅ PASSED" : "⚠️ WARNING",
    };
  } catch (error) {
    console.error("❌ Error loading reciters:", error);
    return {
      test: "Reciter Loading",
      status: "❌ FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test Case 3: Verify Verse Recitation Fetching
 * Tests that verse recitations can be fetched correctly
 */
export async function testVerseRecitationFetching() {
  console.log("🧪 Test 3: Verse Recitation Fetching");
  console.log("=====================================\n");

  const testVerses = ["2:255", "1:1", "23:46", "114:6"];
  let passCount = 0;

  for (const verseKey of testVerses) {
    try {
      const audio = await getVerseRecitationByKey(verseKey, 4);

      if (audio && audio.url) {
        const isCloudUrl = audio.url.startsWith(
          "https://cdn.islamic.network/quran/audio/"
        );
        console.log(`✅ PASS: ${verseKey}`);
        console.log(`  URL: ${audio.url}`);
        console.log(`  Format: ${audio.format}`);
        console.log(`  Source: ${isCloudUrl ? "Al Quran Cloud" : "Unknown"}`);
        passCount++;
      } else {
        console.log(`❌ FAIL: ${verseKey}`);
        console.log(`  No audio data returned`);
      }
    } catch (error) {
      console.log(`❌ FAIL: ${verseKey}`);
      console.log(`  Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    console.log();
  }

  return {
    test: "Verse Recitation Fetching",
    passed: passCount,
    total: testVerses.length,
    status: passCount === testVerses.length ? "✅ PASSED" : "⚠️ PARTIAL",
  };
}

/**
 * Test Case 4: Verify Different Reciter IDs
 * Tests that different reciters produce different URLs
 */
export async function testMultipleReciters() {
  console.log("🧪 Test 4: Multiple Reciter Support");
  console.log("=====================================\n");

  const reciterIds = [1, 2, 3, 4, 5, 6, 7];
  const testVerse = { surah: 2, ayah: 255 };
  const urls = new Set<string>();

  console.log(`Testing verse ${testVerse.surah}:${testVerse.ayah} with different reciters:\n`);

  for (const reciterId of reciterIds) {
    const url = await getVerseAudioUrl(testVerse.surah, testVerse.ayah, reciterId);
    urls.add(url || "");

    if (url) {
      const reciterName = url.split("/")[4];
      console.log(`✅ Reciter ${reciterId}: ${reciterName}`);
    } else {
      console.log(`❌ Reciter ${reciterId}: Failed to generate URL`);
    }
  }

  console.log(`\nTotal unique URLs generated: ${urls.size}`);

  return {
    test: "Multiple Reciter Support",
    uniqueUrls: urls.size,
    totalReiters: reciterIds.length,
    status: urls.size > 1 ? "✅ PASSED" : "❌ FAILED",
  };
}

/**
 * Run all tests and generate a report
 */
export async function runAllTests() {
  console.log("\n");
  console.log("════════════════════════════════════════════════════");
  console.log("   AUDIO API IMPLEMENTATION - TEST SUITE");
  console.log("════════════════════════════════════════════════════\n");

  const results = [];

  // Run all tests
  results.push(await testAudioURLConstruction());
  results.push(await testReciterLoading());
  results.push(await testVerseRecitationFetching());
  results.push(await testMultipleReciters());

  // Generate report
  console.log("\n");
  console.log("════════════════════════════════════════════════════");
  console.log("   TEST REPORT");
  console.log("════════════════════════════════════════════════════\n");

  let totalPassed = 0;
  let totalFailed = 0;

  results.forEach((result) => {
    console.log(`${result.status} - ${result.test}`);
    if ("passed" in result && "total" in result) {
      console.log(`   ${result.passed}/${result.total} tests passed`);
      totalPassed += result.passed || 0;
      totalFailed += ((result.total as number) - (result.passed as number)) || 0;
    }
    console.log();
  });

  const totalTests = totalPassed + totalFailed;
  const passPercentage = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(0) : "N/A";

  console.log("════════════════════════════════════════════════════");
  console.log(`TOTAL: ${totalPassed}/${totalTests} tests passed (${passPercentage}%)`);
  console.log("════════════════════════════════════════════════════\n");

  return {
    summary: {
      totalTests,
      passed: totalPassed,
      failed: totalFailed,
      percentage: passPercentage,
    },
    details: results,
  };
}

// Export for browser console testing
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).audioTests = {
    testAudioURLConstruction,
    testReciterLoading,
    testVerseRecitationFetching,
    testMultipleReciters,
    runAllTests,
  };

  console.log("🎵 Audio tests available in browser console:");
  console.log("  - audioTests.runAllTests()");
  console.log("  - audioTests.testAudioURLConstruction()");
  console.log("  - audioTests.testReciterLoading()");
  console.log("  - audioTests.testVerseRecitationFetching()");
  console.log("  - audioTests.testMultipleReciters()");
}
