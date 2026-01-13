import { Manga } from '../types';

const FAVORITES_KEY = 'mangadex_lite_favorites';

export const getFavorites = (): Manga[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load favorites', e);
    return [];
  }
};

export const isFavorite = (mangaId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(m => m.mangaId === mangaId);
};

export const toggleFavorite = (manga: Manga): boolean => {
  const favorites = getFavorites();
  const index = favorites.findIndex(m => m.mangaId === manga.mangaId);
  
  let newFavorites;
  let isAdded = false;

  if (index >= 0) {
    // Remove
    newFavorites = favorites.filter(m => m.mangaId !== manga.mangaId);
  } else {
    // Add
    newFavorites = [...favorites, manga];
    isAdded = true;
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  return isAdded;
};