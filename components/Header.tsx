import React, { useState } from 'react';
import { Search, Settings, X, Heart } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onHome: () => void;
  onFavorites: () => void;
  onOpenSettings: () => void;
  currentQuery: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onHome, onFavorites, onOpenSettings, currentQuery }) => {
  const [localQuery, setLocalQuery] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-900/80 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
        
        {/* Left Section: Logo */}
        <div className="flex items-center justify-start">
          <button 
            onClick={onHome} 
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 bg-indigo-600/30 blur-xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <div className="flex gap-0.5 items-end h-4">
                  <div className="w-1.5 h-2.5 bg-white/40 rounded-full"></div>
                  <div className="w-1.5 h-4 bg-white rounded-full"></div>
                  <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Center Section: Search Bar (Flexible) */}
        <form 
          onSubmit={handleSubmit} 
          className="flex-1 w-full flex items-center pt-4"
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search titles..."
              className="w-full h-10 pl-11 pr-10 bg-slate-900/70 border border-slate-800 rounded-full text-sm text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:bg-slate-900 focus:border-indigo-500/40 shadow-inner"
            />
            {localQuery && (
              <button 
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  onSearch('');
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end">
          <button 
            onClick={onFavorites}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-900/80 transition-all active:scale-90"
            title="Favorites"
          >
            <Heart className="w-5 h-5" strokeWidth="1.5" />
          </button>

          <button 
            onClick={onOpenSettings}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-indigo-400 hover:bg-slate-900/80 transition-all active:scale-90"
            title="Settings"
          >
            <Settings className="w-5 h-5" strokeWidth="1.5" />
          </button>
        </div>

      </div>
    </header>
  );
};