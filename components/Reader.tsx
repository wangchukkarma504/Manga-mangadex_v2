import React, { useEffect, useState, useRef } from 'react';
import { fetchMangaDetail } from '../services/mangaService';
import { MangaDetailResponse } from '../types';
import { Loading } from './Loading';
import { ChevronLeft, ChevronRight, List, AlertCircle, ArrowLeft } from 'lucide-react';

interface ReaderProps {
  apiUrl: string;
  mangaId: string;
  initialChapter: string;
  onBack: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ apiUrl, mangaId, initialChapter, onBack }) => {
  const [detail, setDetail] = useState<MangaDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState(initialChapter);
  const [showControls, setShowControls] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  let controlsTimeout: NodeJS.Timeout;

  const loadChapter = async (chapter: string) => {
    setLoading(true);
    setError(null);
    try {
      // Scroll to top when changing chapter
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);

      const response = await fetchMangaDetail(apiUrl, mangaId, chapter);
      if (response.error) {
        setError(response.error);
      } else {
        setDetail(response as MangaDetailResponse);
      }
    } catch (err) {
      setError('Failed to load chapter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapter(currentChapterId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapterId, mangaId, apiUrl]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => setShowControls(false), 3000);
  };

  // Find prev/next chapters
  const getNeighborChapters = () => {
    if (!detail || !detail.chapterList) return { prev: null, next: null };
    
    // Sort chapters just in case, though API says they are sorted
    const sorted = [...detail.chapterList].sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));
    const currentIndex = sorted.findIndex(c => c.chapter === currentChapterId);
    
    return {
      prev: currentIndex > 0 ? sorted[currentIndex - 1].chapter : null,
      next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1].chapter : null
    };
  };

  const { prev, next } = getNeighborChapters();

  return (
    <div 
        className="min-h-screen bg-black text-white relative flex flex-col items-center"
        onMouseMove={handleMouseMove}
        onClick={handleMouseMove}
    >
      {/* Sticky Header / Controls */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Back to List</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
             <button 
                disabled={!prev}
                onClick={() => prev && setCurrentChapterId(prev)}
                className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                title="Previous Chapter"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>

             <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-full text-sm font-medium transition">
                    <List className="w-4 h-4 text-indigo-400" />
                    Chapter {currentChapterId}
                </button>
                
                {/* Chapter Dropdown */}
                {detail && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 max-h-60 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl hidden group-hover:block">
                        {detail.chapterList.map(c => (
                            <button
                                key={c.chapter}
                                onClick={() => setCurrentChapterId(c.chapter)}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${c.chapter === currentChapterId ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
                            >
                                Chapter {c.chapter}
                            </button>
                        ))}
                    </div>
                )}
             </div>

             <button 
                disabled={!next}
                onClick={() => next && setCurrentChapterId(next)}
                className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                title="Next Chapter"
             >
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl pt-20 pb-32 min-h-screen" ref={scrollContainerRef}>
        {loading ? (
            <div className="h-[60vh] flex items-center justify-center">
                <Loading />
            </div>
        ) : error ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-red-400 p-8 text-center">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-semibold">{error}</p>
                <button 
                    onClick={() => loadChapter(currentChapterId)}
                    className="mt-4 px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 text-white text-sm"
                >
                    Retry
                </button>
            </div>
        ) : (
            <div className="flex flex-col gap-0 select-none">
                {detail?.images.map((img, idx) => (
                    <img 
                        key={idx}
                        src={img}
                        alt={`Page ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-auto block"
                        onError={(e) => {
                            // Fallback for broken images if needed
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ))}
            </div>
        )}
      </div>

       {/* Bottom Navigation (Visible when scrolling ends or mouse move) */}
       <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/90 to-transparent p-6 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-center items-center gap-6">
            <button 
                disabled={!prev}
                onClick={() => prev && setCurrentChapterId(prev)}
                className="px-6 py-3 bg-slate-800 rounded-full font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 border border-slate-700"
             >
                <ChevronLeft className="w-4 h-4" /> Previous
             </button>
             <button 
                disabled={!next}
                onClick={() => next && setCurrentChapterId(next)}
                className="px-6 py-3 bg-indigo-600 rounded-full font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
             >
                Next Chapter <ChevronRight className="w-4 h-4" />
             </button>
        </div>
      </div>

    </div>
  );
};