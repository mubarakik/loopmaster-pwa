
import React, { useState } from 'react';
import { Upload, Youtube, Link as LinkIcon } from 'lucide-react';
import { MediaType, MediaSource } from '../types';

interface MediaSelectorProps {
  onSelect: (source: MediaSource) => void;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({ onSelect }) => {
  const [ytUrl, setYtUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('audio/') ? MediaType.AUDIO : MediaType.VIDEO;
    const url = URL.createObjectURL(file);
    
    onSelect({
      type,
      url,
      name: file.name,
      file
    });
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytUrl) return;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = ytUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      onSelect({
        type: MediaType.YOUTUBE,
        url: ytUrl,
        name: `YouTube: ${videoId}`,
        youtubeId: videoId
      });
      setYtUrl('');
    } else {
      alert("Invalid YouTube URL");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-400 block">Local Media</label>
        <div className="relative group">
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5">
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-500 mb-3" />
            <p className="text-sm text-slate-400 text-center font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-600 mt-1">MP3, MP4, MOV, WAV</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-400 block">Streaming</label>
        <form onSubmit={handleYoutubeSubmit} className="relative">
          <input
            type="text"
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />
          <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MediaSelector;
