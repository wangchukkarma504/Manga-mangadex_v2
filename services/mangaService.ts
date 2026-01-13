import { MangaListResponse, MangaDetailResponse, ApiError } from '../types';

async function fetchWithTimeout(resource: string, options: RequestInit = {}) {
  const { timeout = 15000 } = options as any;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

export const fetchMangaList = async (baseUrl: string, offset: number = 0, limit: number = 10): Promise<MangaListResponse | ApiError> => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.append('action', 'list');
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetch manga list failed:', error);
    return { error: 'Failed to fetch manga list' };
  }
};

export const searchManga = async (baseUrl: string, query: string, offset: number = 0, limit: number = 10): Promise<MangaListResponse | ApiError> => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.append('action', 'search');
    url.searchParams.append('title', query);
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Search manga failed:', error);
    return { error: 'Failed to search manga' };
  }
};

export const fetchMangaDetail = async (baseUrl: string, mangaId: string, chapter: string): Promise<MangaDetailResponse | ApiError> => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.append('action', 'detail');
    url.searchParams.append('mangaId', mangaId);
    url.searchParams.append('chapter', chapter);

    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetch manga detail failed:', error);
    return { error: 'Failed to fetch chapter' };
  }
};
