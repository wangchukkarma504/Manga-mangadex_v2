import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MangaList } from './components/MangaList';
import { Reader } from './components/Reader';
import { SettingsModal } from './components/SettingsModal';
import { AppState } from './types';

const STORAGE_KEY = 'mangadex_lite_api_url';
const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbw8cMWs0NCmrXa3GuNIOlvVznnf-v75KBvQA-Ikm7JNZvKuRrm08CViTSTCGuUa2rqE/exec';

function App() {
  const [state, setState] = useState<AppState>({
    view: 'list',
    selectedMangaId: null,
    selectedChapter: null,
    searchQuery: '',
    apiUrl: localStorage.getItem(STORAGE_KEY) || DEFAULT_API_URL,
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initial check for API Key
  useEffect(() => {
    if (!state.apiUrl) {
      setIsSettingsOpen(true);
    }
  }, [state.apiUrl]);

  const handleSaveSettings = (url: string) => {
    localStorage.setItem(STORAGE_KEY, url);
    setState(prev => ({ ...prev, apiUrl: url }));
    setIsSettingsOpen(false);
  };

  const handleSearch = (query: string) => {
    setState(prev => ({ 
      ...prev, 
      view: query ? 'search' : 'list', 
      searchQuery: query,
      selectedMangaId: null 
    }));
  };

  const handleSelectManga = (mangaId: string) => {
    setState(prev => ({
        ...prev,
        view: 'detail',
        selectedMangaId: mangaId,
        selectedChapter: '1' 
    }));
  };

  const handleBack = () => {
    setState(prev => ({
        ...prev,
        view: prev.searchQuery ? 'search' : (prev.view === 'favorites' ? 'favorites' : 'list'),
        selectedMangaId: null,
        selectedChapter: null
    }));
  };

  const needsConfig = !state.apiUrl;
  const isReaderView = state.view === 'detail' && state.selectedMangaId;

  return (
    <>
      {isReaderView ? (
        <Reader 
            apiUrl={state.apiUrl} 
            mangaId={state.selectedMangaId!} 
            initialChapter={state.selectedChapter || '1'} 
            onBack={handleBack} 
        />
      ) : (
        <div className="min-h-screen bg-black text-slate-100 font-sans flex items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md h-screen sm:h-[90vh] sm:max-h-[800px] bg-slate-950 sm:rounded-2xl shadow-2xl shadow-indigo-900/50 flex flex-col overflow-hidden sm:border sm:border-slate-800">
            <Header 
                onSearch={handleSearch} 
                onHome={() => setState(prev => ({ ...prev, view: 'list', searchQuery: '' }))} 
                onFavorites={() => setState(prev => ({ ...prev, view: 'favorites', searchQuery: '' }))}
                onOpenSettings={() => setIsSettingsOpen(true)}
                currentQuery={state.searchQuery}
            />

            <main className="flex-1 overflow-y-auto custom-scrollbar-main">
                {needsConfig ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Welcome to MangaDex Lite</h1>
                        <p className="text-slate-400 max-w-md mb-8">
                            Please configure your Google Apps Script Proxy URL to start reading.
                        </p>
                        <button 
                            onClick={() => setIsSettingsOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/25 transition"
                        >
                            Configure API
                        </button>
                    </div>
                ) : (
                    <>
                        {state.view === 'list' && (
                            <MangaList 
                                apiUrl={state.apiUrl} 
                                isSearch={false} 
                                searchQuery="" 
                                onSelectManga={handleSelectManga} 
                            />
                        )}

                        {state.view === 'search' && (
                            <MangaList 
                                apiUrl={state.apiUrl} 
                                isSearch={true} 
                                searchQuery={state.searchQuery} 
                                onSelectManga={handleSelectManga} 
                            />
                        )}
                        
                        {state.view === 'favorites' && (
                            <MangaList 
                                apiUrl={state.apiUrl} 
                                isSearch={false}
                                isFavorites={true}
                                searchQuery="" 
                                onSelectManga={handleSelectManga} 
                            />
                        )}
                    </>
                )}
            </main>
          </div>
        </div>
      )}

      <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => !needsConfig && setIsSettingsOpen(false)}
          forceOpen={needsConfig}
          currentUrl={state.apiUrl}
          onSave={handleSaveSettings}
      />
    </>
  );
}

export default App;