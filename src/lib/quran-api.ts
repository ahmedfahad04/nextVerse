import { Surah, ArabicAyah, VerseWithTranslation, Translation } from "@/types/quran";

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
      translations: (verseData as any)?.translations || [],
    };
  } catch {
    return null;
  }
}
