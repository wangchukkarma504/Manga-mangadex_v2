import React, { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';

interface SettingsModalProps {
  currentUrl: string;
  onSave: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
  forceOpen?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentUrl, onSave, isOpen, onClose, forceOpen }) => {
  const [url, setUrl] = useState(currentUrl);

  if (!isOpen && !forceOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" /> 
                API Configuration
            </h3>
            {!forceOpen && (
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
        
        <div className="p-6">
            <p className="text-slate-400 text-sm mb-4">
                Enter the URL of your deployed Google Apps Script Web App. 
                This app acts as a proxy to MangaDex.
            </p>
            
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Web App URL</label>
                <input 
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
            </div>

            <div className="mt-6">
                <button 
                    onClick={() => onSave(url)}
                    disabled={!url.includes('script.google.com')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                    <Save className="w-4 h-4" />
                    Save Connection
                </button>
                {!url.includes('script.google.com') && url.length > 0 && (
                    <p className="text-red-400 text-xs mt-2 text-center">URL must match standard Google Script format.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};