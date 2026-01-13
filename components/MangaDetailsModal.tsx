import React, { useState } from 'react';
import { Manga } from '../types';
import { X, Book, Heart, Calendar } from 'lucide-react';
import { isFavorite, toggleFavorite } from '../services/storageService';

interface MangaDetailsModalProps {
  manga: Manga | null;
  onClose: () => void;
  onRead: (mangaId: string) => void;
}

export const MangaDetailsModal: React.FC<MangaDetailsModalProps> = ({ manga, onClose, onRead }) => {
  // Initialize state based on the current manga
  // We use key={manga.mangaId} in parent to force re-render/reset state when manga changes
  // or we can use useEffect, but simple initialization is often enough if unmounted.
  const [isFav, setIsFav] = useState(manga ? isFavorite(manga.mangaId) : false);

  if (!manga) return null;

  const rawGenres = manga.genres || manga.genre || [];
  const genres = Array.isArray(rawGenres) ? rawGenres : [];

  const handleToggleFav = () => {
    toggleFavorite(manga);
    setIsFav(!isFav);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
       <div 
         className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[85vh]"
         onClick={(e) => e.stopPropagation()}
       >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-slate-950/50 rounded-full text-slate-400 hover:text-white transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cover Image Section */}
          <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
             <img 
                src={manga.coverImage} 
                alt={manga.title}
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900/50" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 md:p-8 flex flex-col overflow-hidden bg-slate-900">
             <div className="mb-4">
                 <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{manga.title}</h2>
                 
                 <div className="flex flex-wrap gap-2 mb-3">
                    {genres.map(g => (
                        <span key={g} className="px-2 py-1 rounded-md bg-slate-800 text-xs font-medium text-indigo-300 border border-slate-700">
                            {g}
                        </span>
                    ))}
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar">
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {manga.description || "No description available."}
                </p>
             </div>

             <div className="flex gap-3 mt-auto pt-4 border-t border-slate-800">
                <button 
                    onClick={() => {
                        onRead(manga.mangaId);
                        onClose();
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20"
                >
                    <Book className="w-4 h-4" /> Read Now
                </button>
                <button 
                    onClick={handleToggleFav}
                    className={`px-4 py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition ${isFav ? 'bg-rose-500/10 text-rose-500 border-rose-500/50' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};