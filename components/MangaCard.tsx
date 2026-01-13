import React, { useState, useEffect } from 'react';
import { Manga } from '../types';
import { Book, Heart, Info } from 'lucide-react';
import { isFavorite, toggleFavorite } from '../services/storageService';

interface MangaCardProps {
  manga: Manga;
  onClick: (mangaId: string) => void;
  onViewDetails: (manga: Manga) => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, onClick, onViewDetails }) => {
  const [isFav, setIsFav] = useState(false);
  const rawGenres = manga.genres || manga.genre;
  const genres = Array.isArray(rawGenres) ? rawGenres : [];

  useEffect(() => {
    setIsFav(isFavorite(manga.mangaId));
  }, [manga.mangaId]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleFavorite(manga);
    setIsFav(newState);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(manga);
  };

  return (
    <div 
      className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(manga.mangaId)}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="aspect-[2/3] w-full relative overflow-hidden bg-slate-800">
        <img 
          src={manga.coverImage} 
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/300/450?grayscale';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Info Button (Top Left) */}
        <button 
            onClick={handleViewDetails}
            className="absolute top-2 left-2 z-10 p-2 rounded-full bg-slate-950/50 backdrop-blur-sm text-white hover:bg-indigo-500/80 transition-colors md:hidden"
            title="View Details"
        >
            <Info className="w-4 h-4" />
        </button>

        {/* Favorite Button (Top Right) */}
        <button 
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-slate-950/50 backdrop-blur-sm text-white hover:bg-rose-500/80 transition-colors"
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {/* Hover Actions (Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 hidden md:flex gap-2">
            <button 
                onClick={handleViewDetails}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg shadow-lg flex items-center justify-center"
                title="View Description"
            >
                <Info className="w-4 h-4" />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onClick(manga.mangaId); }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg shadow-lg flex items-center justify-center gap-2"
            >
                <Book className="w-3 h-3" /> Read
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-bold text-slate-100 text-sm md:text-base line-clamp-1 mb-1" title={manga.title}>
          {manga.title || 'Untitled'}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {g}
            </span>
          ))}
          {genres.length > 2 && (
             <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">+{genres.length - 2}</span>
          )}
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {manga.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
};