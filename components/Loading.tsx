import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
      <p className="text-sm font-medium">Loading contents...</p>
    </div>
  );
};

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
             <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
                <p className="text-slate-200 font-medium animate-pulse">Connecting to MangaDex Proxy...</p>
            </div>
        </div>
    )
}