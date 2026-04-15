export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ArabicAyah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  edition: {
    identifier: string;
    language: string;
    name: string;
  };
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
}

export interface VerseWithTranslation {
  verse: {
    id: number;
    verse_number: number;
    verse_key: string;
    translations: Translation[];
  };
}
