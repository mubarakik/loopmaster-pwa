
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Scissors, Settings2, Share2, 
  Trash2, Upload, Youtube, Zap, Music, Video, Info, X
} from 'lucide-react';
import { MediaType, MediaSource, LoopSettings } from './types';
import MediaSelector from './components/MediaSelector';
import UniversalPlayer from './components/UniversalPlayer';
import TimelineController from './components/TimelineController';
import AIAnalysis from './components/AIAnalysis';

const App: React.FC = () => {
  const [source, setSource] = useState<MediaSource | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTo, setSeekTo] = useState<{ time: number; timestamp: number } | null>(null);
  const [loop, setLoop] = useState<LoopSettings>({
    startTime: 0,
    endTime: 0,
    isActive: false,
    playbackRate: 1
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Desktop sidebar defaults to open
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const handleSourceSelect = (newSource: MediaSource) => {
    setSource(newSource);
    setDuration(0);
    setCurrentTime(0);
    setSeekTo(null);
    setLoop({
      startTime: 0,
      endTime: 0,
      isActive: false,
      playbackRate: 1
    });
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSeek = (time: number) => {
    setSeekTo({ time, timestamp: Date.now() });
  };

  const clearSource = () => {
    setSource(null);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                LoopMaster
              </h1>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!source ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <p className="text-sm text-slate-400 mb-6">Select a file or enter a YouTube URL to begin looping.</p>
              <MediaSelector onSelect={handleSourceSelect} />
            </div>
          ) : (
            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Current Media</span>
                  <button onClick={clearSource} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {source.type === MediaType.AUDIO ? <Music className="w-5 h-5 text-indigo-400" /> : source.type === MediaType.VIDEO ? <Video className="w-5 h-5 text-indigo-400" /> : <Youtube className="w-5 h-5 text-red-500" />}
                  <h2 className="text-sm font-medium truncate">{source.name}</h2>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">AI Insights</h3>
                <AIAnalysis 
                  source={source} 
                  startTime={loop.startTime} 
                  endTime={loop.endTime} 
                />
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>PWA Ready & Offline Friendly</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 md:gap-4">
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium">
               <span className={`w-2 h-2 rounded-full ${source ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
               {source ? 'Session Active' : 'Ready'}
             </div>
             <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
               <Share2 className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          {source ? (
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-800 relative group">
                <UniversalPlayer 
                  source={source}
                  loop={loop}
                  seekTo={seekTo}
                  onProgress={setCurrentTime}
                  onDuration={setDuration}
                />
              </div>

              <TimelineController 
                currentTime={currentTime}
                duration={duration}
                loop={loop}
                setLoop={setLoop}
                onSeek={handleSeek}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 md:p-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to LoopMaster</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm md:text-base">
                The ultimate tool for looping audio, video, and YouTube. Perfect for learning music, languages, or analyzing sports.
              </p>
              <div className="md:hidden w-full max-w-sm">
                 <MediaSelector onSelect={handleSourceSelect} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
