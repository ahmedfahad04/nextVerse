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

// Audio API Types
export interface ChapterRecitation {
  id: number;
  chapterId: number;
  fileSize?: number;
  format: string;
  audioUrl: string;
  duration?: number;
  reciterId?: number;
}

export interface VerseRecitation {
  verseKey: string;
  url: string;
  id?: number;
  chapterId?: number;
  segments?: Array<{
    start: number;
    end: number;
    text?: string;
  }>;
  format?: string;
  duration?: number;
}

export interface VerseRecitationResponse {
  audioFiles: VerseRecitation[];
  pagination?: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface Reciter {
  id: number;
  name: string;
  englishName: string;
  format: string;
  style?: string;
}
