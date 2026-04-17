import { Surah, ArabicAyah, VerseWithTranslation, Translation, VerseRecitation, VerseRecitationResponse, ChapterRecitation, Reciter } from "@/types/quran";

const ALQURAN_API = "https://api.alquran.cloud/v1";
const QURAN_COM_API = "https://api.quran.com/api/v4";

export async function getSurahs(): Promise<Surah[]> {
  const res = await fetch(`${ALQURAN_API}/surah`);
  const data = await res.json();
  if (data.code === 200) {
    return data.data;
  }
  throw new Error("Failed to fetch surahs");
}

export async function getArabicAyah(
  surah: number,
  ayah: number
): Promise<ArabicAyah> {
  const res = await fetch(`${ALQURAN_API}/ayah/${surah}:${ayah}/ar.alafasy`);
  const data = await res.json();
  if (data.code === 200) {
    return data.data;
  }
  throw new Error("Failed to fetch Arabic ayah");
}

export async function getTranslations(
  surah: number,
  ayah: number,
  translationIds: number[] = [161, 20]
): Promise<VerseWithTranslation | null> {
  const ids = translationIds.join(",");
  const res = await fetch(
    `${QURAN_COM_API}/verses/by_key/${surah}:${ayah}?translations=${ids}`
  );
  const data = await res.json();
  return data.verse || null;
}

export async function getAyahData(
  surah: number,
  ayah: number,
  translationIds: number[] = [161, 20]
): Promise<{
  arabic: ArabicAyah;
  translations: Translation[];
} | null> {
  try {
    const [arabic, verseData] = await Promise.all([
      getArabicAyah(surah, ayah),
      getTranslations(surah, ayah, translationIds),
    ]);

    return {
      arabic,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      translations: (verseData as any)?.translations || [],
    };
  } catch {
    return null;
  }
}

// Audio API Functions

/**
 * Get all available reciters from Quran.com API
 */
export async function getReciters(): Promise<Reciter[]> {
  try {
    const res = await fetch(`${QURAN_COM_API}/resources/recitations`);
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.recitations || []).map((reciter: any) => ({
      id: reciter.id,
      name: reciter.name,
      englishName: reciter.english_name || reciter.name || `Reciter ${reciter.id}`,
      format: reciter.format || "mp3",
      style: reciter.style,
    }));
  } catch (error) {
    console.error("Error fetching reciters:", error);
    // Return default reciters in case of error
    return [
      {
        id: 4,
        name: "مشاري بن راشد العفاسي",
        englishName: "Al-Afasy",
        format: "mp3",
      },
    ];
  }
}

/**
 * Get chapter audio recitation for a specific reciter
 * Default reciter: Al-Afasy (reciterId: 4)
 */
export async function getChapterRecitation(
  chapterId: number,
  reciterId: number = 4
): Promise<ChapterRecitation | null> {
  try {
    const res = await fetch(
      `${QURAN_COM_API}/chapter_recitations/${chapterId}?recitation_id=${reciterId}`
    );
    const data = await res.json();
    if (data.chapter_recitation) {
      return {
        id: data.chapter_recitation.id,
        chapterId: data.chapter_recitation.chapter_id,
        fileSize: data.chapter_recitation.file_size,
        format: data.chapter_recitation.format,
        audioUrl: data.chapter_recitation.audio_url,
        duration: data.chapter_recitation.duration,
        reciterId,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching chapter recitation:", error);
    return null;
  }
}

/**
 * Get verse audio URL - uses direct audio URL from Quran.com
 * Default reciter: Al-Afasy (reciterId: 4)
 */
export async function getVerseAudioUrl(
  surah: number,
  ayah: number,
  reciterId: number = 4
): Promise<string | null> {
  try {
    // Format: https://audio.quran.com/[reciter]/[surah]_[ayah].mp3
    // Common reciters:
    // 4 = Al-Afasy
    // 1 = Abdullah al-Juhany
    // 5 = Abdul Basit Abdul Samad
    // 7 = Abdul Rahman As-Sudais
    const surahStr = String(surah).padStart(3, "0");
    const ayahStr = String(ayah).padStart(3, "0");
    
    // Map reciter IDs to audio names
    const reciterMap: { [key: number]: string } = {
      1: "abdul_basit_murattal",
      2: "abdul_basit_mujawwad",
      3: "abdul_wadud_hanif",
      4: "alafasy",
      5: "al_aydarous",
      6: "al_husary_mujawwad",
      7: "al_minshawi_murattal",
    };

    const reciterName = reciterMap[reciterId] || "alafasy";
    const audioUrl = `https://audio.quran.com/${reciterName}/${surahStr}_${ayahStr}.mp3`;

    return audioUrl;
  } catch (error) {
    console.error("Error constructing verse audio URL:", error);
    return null;
  }
}

/**
 * Get verse-by-verse audio recitations for a specific chapter
 * Default reciter: Al-Afasy (reciterId: 4)
 */
export async function getVerseRecitationsByChapter(
  chapterId: number,
  reciterId: number = 4
): Promise<VerseRecitationResponse> {
  try {
    const res = await fetch(
      `${QURAN_COM_API}/verse_recitations?chapter_number=${chapterId}&recitation_id=${reciterId}`
    );
    const data = await res.json();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioFiles: VerseRecitation[] = (data.verse_recitations || []).map((item: any) => ({
      verseKey: item.verse_key,
      url: item.url,
      id: item.id,
      chapterId: item.chapter_id,
      format: item.format,
      duration: item.duration,
      segments: item.segments,
    }));

    return {
      audioFiles,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching verse recitations by chapter:", error);
    return { audioFiles: [] };
  }
}

/**
 * Get verse audio recitation by verse key
 * Default reciter: Al-Afasy (reciterId: 4)
 */
export async function getVerseRecitationByKey(
  verseKey: string,
  reciterId: number = 4
): Promise<VerseRecitation | null> {
  try {
    const edition = reciterId === 4 ? "ar.alafasy" : "ar.alafasy";
    const res = await fetch(
      `${ALQURAN_API}/ayah/${verseKey}/${edition}`
    );
    const data = await res.json();

    if (data.code === 200 && data.data?.audio) {
      return {
        verseKey,
        url: data.data.audio,
        format: "mp3",
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching verse recitation by key:", error);
    return null;
  }
}
