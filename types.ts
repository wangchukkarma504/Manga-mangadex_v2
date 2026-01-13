export interface Manga {
  mangaId: string;
  type?: string;
  title: string;
  description: string;
  genre?: string[];
  genres?: string[];
  coverImage: string;
  maxChapter?: number; // Added for compatibility with potential filters
}

export interface Chapter {
  chapter: string;
}

export interface MangaListResponse {
  offset: string | number;
  limit: string | number;
  total: number;
  count: number;
  data: Manga[];
}

export interface MangaDetailResponse {
  mangaId: string;
  images: string[];
  chapterList: Chapter[];
  currentChapter: string;
  maxChapter: number;
  error?: string;
}

export interface ApiError {
  error: string;
}

export type ViewState = 'list' | 'search' | 'detail' | 'favorites';

export interface AppState {
  view: ViewState;
  selectedMangaId: string | null;
  selectedChapter: string | null;
  searchQuery: string;
  apiUrl: string;
}