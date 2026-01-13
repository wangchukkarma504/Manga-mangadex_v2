import React, { useEffect, useState, useRef } from 'react';
import { Manga, MangaListResponse } from '../types';
import { fetchMangaList, searchManga } from '../services/mangaService';
import { MangaCard } from './MangaCard';
import { Loading } from './Loading';
import { getFavorites } from '../services/storageService';
import { Search, RotateCcw, Filter, Heart } from 'lucide-react';
import { MangaDetailsModal } from './MangaDetailsModal';

interface MangaListProps {
  apiUrl: string;
  isSearch: boolean;
  isFavorites?: boolean;
  searchQuery: string;
  onSelectManga: (mangaId: string) => void;
}

const COMMON_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Isekai', 'Mystery', 'Psychological', 
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'
];

const RESULTS_PER_PAGE = 24;

export const MangaList: React.FC<MangaListProps> = ({ apiUrl, isSearch, isFavorites, searchQuery, onSelectManga }) => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal State
  const [selectedDetailManga, setSelectedDetailManga] = useState<Manga | null>(null);

  const loadManga = async (reset: boolean = false) => {
    if (loading) return;
    
    // Favorites Mode: Load from local storage
    if (isFavorites) {
        setLoading(true);
        // Simulate slight delay for UX
        setTimeout(() => {
            const favs = getFavorites();
            setMangaList(favs);
            setTotalResults(favs.length);
            setHasMore(false); // Favorites are all loaded at once usually
            setLoading(false);
        }, 300);
        return;
    }

    if (!reset && !hasMore) return;

    setLoading(true);
    setError(null);
    const currentOffset = reset ? 0 : offset;
    const limit = RESULTS_PER_PAGE;

    try {
      let response: MangaListResponse | any;
      if (isSearch) {
        if (!searchQuery.trim()) {
            setLoading(false);
            setMangaList([]);
            return;
        }
        response = await searchManga(apiUrl, searchQuery, currentOffset, limit);
      } else {
        response = await fetchMangaList(apiUrl, currentOffset, limit);
      }

      if (response.error) {
        setError(response.error);
        setHasMore(false);
      } else {
        const newData = response.data || [];
        setMangaList(prev => reset ? newData : [...prev, ...newData]);
        
        if (reset) {
            setTotalResults(response.total || 0);
        }
        
        if (newData.length < limit) {
          setHasMore(false);
        } else {
          setOffset(currentOffset + limit);
          setHasMore(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setMangaList([]);
    setTotalResults(0);
    loadManga(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearch, isFavorites, searchQuery, apiUrl]);

  // Filter Logic (Client-side)
  const filteredMangaList = mangaList.filter(manga => {
    const rawGenres = manga.genres || manga.genre || [];
    const genres = Array.isArray(rawGenres) ? rawGenres : [];
    
    // Genre Filter
    if (selectedGenre && !genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())) {
        return false;
    }
    
    return true;
  });

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {isFavorites ? (
            <>
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span className="text-rose-100">My Favorites</span>
            </>
          ) : isSearch ? (
            <>
              <Search className="w-6 h-6 text-indigo-500" />
              <span className="truncate">
                Results for "{searchQuery}"
                {!loading && totalResults > 0 && (
                    <span className="ml-2 text-sm text-slate-500 font-normal">({totalResults})</span>
                )}
              </span>
            </>
          ) : (
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Latest Updates</span>
          )}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${showFilters ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
            >
                <Filter className="w-4 h-4" /> Filters
            </button>
            {!loading && !isFavorites && (
                <button 
                    onClick={() => loadManga(true)} 
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                    title="Refresh"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <div className="max-w-xs">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Genre</label>
                <select 
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">All Genres</option>
                    {COMMON_GENRES.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg text-center mb-6">
          <p>{error}</p>
          <button 
            onClick={() => loadManga(true)}
            className="mt-2 text-sm underline hover:text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {filteredMangaList.length === 0 && !loading && !error && (
        <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
          <p className="text-lg">No manga found.</p>
          {selectedGenre && (
              <button 
                onClick={() => { setSelectedGenre(''); }}
                className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                Clear Filter
              </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredMangaList.map((manga, index) => (
          <MangaCard 
            key={`${manga.mangaId}-${index}`} 
            manga={manga} 
            onClick={onSelectManga} 
            onViewDetails={(m) => setSelectedDetailManga(m)}
          />
        ))}
      </div>

      {loading && <Loading />}

      {!loading && hasMore && !isFavorites && filteredMangaList.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => loadManga(false)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-full transition-all shadow-lg hover:shadow-xl border border-slate-700"
          >
            Load More
          </button>
        </div>
      )}

      {/* Details Modal */}
      {selectedDetailManga && (
        <MangaDetailsModal 
            manga={selectedDetailManga} 
            onClose={() => setSelectedDetailManga(null)} 
            onRead={onSelectManga}
        />
      )}
    </div>
  );
};