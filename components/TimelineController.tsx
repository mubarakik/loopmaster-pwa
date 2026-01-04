
import React, { useRef } from 'react';
import { Scissors, RotateCcw, Clock, Play, Pause } from 'lucide-react';
import { LoopSettings } from '../types';

interface TimelineControllerProps {
  currentTime: number;
  duration: number;
  loop: LoopSettings;
  setLoop: (settings: LoopSettings) => void;
  onSeek: (time: number) => void;
}

const TimelineController: React.FC<TimelineControllerProps> = ({ 
  currentTime, 
  duration, 
  loop, 
  setLoop,
  onSeek
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percentage * duration);
  };

  const setPointA = () => {
    setLoop({ ...loop, startTime: currentTime });
  };

  const setPointB = () => {
    setLoop({ ...loop, endTime: currentTime });
  };

  const toggleLoop = () => {
    if (loop.endTime <= loop.startTime) {
      alert("End point must be after start point");
      return;
    }
    setLoop({ ...loop, isActive: !loop.isActive });
  };

  const resetLoop = () => {
    setLoop({ startTime: 0, endTime: 0, isActive: false, playbackRate: 1 });
  };

  const progressPercent = (currentTime / duration) * 100 || 0;
  const startPercent = (loop.startTime / duration) * 100 || 0;
  const endPercent = (loop.endTime / duration) * 100 || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Visual Timeline */}
      <div className="space-y-4">
        <div className="flex justify-between items-end text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">
          <span>0:00</span>
          <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700 font-bold">
            {formatTime(currentTime)}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div 
          ref={progressBarRef}
          className="relative h-4 bg-slate-800 rounded-full overflow-hidden group cursor-pointer hover:bg-slate-700/50 transition-colors"
          onClick={handleTimelineClick}
        >
          {/* Main Progress */}
          <div 
            className="absolute top-0 left-0 h-full bg-slate-600 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
          
          {/* Active Loop Range */}
          {loop.endTime > loop.startTime && (
            <div 
              className="absolute top-0 h-full bg-indigo-500/30 border-x-2 border-indigo-400 z-10"
              style={{ 
                left: `${startPercent}%`, 
                width: `${endPercent - startPercent}%` 
              }}
            />
          )}

          {/* Current Playhead */}
          <div 
            className="absolute top-0 h-full w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20 pointer-events-none"
            style={{ left: `${progressPercent}%`, transform: 'translateX(-50%)' }}
          />
        </div>
      </div>

      {/* Control Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="flex flex-col gap-2 md:gap-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Markers</label>
          <div className="flex gap-2">
            <button 
              onClick={setPointA}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 md:p-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="font-bold text-indigo-400">A</span>
              <span className="text-[10px] md:text-xs">Set Start</span>
            </button>
            <button 
              onClick={setPointB}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 md:p-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="font-bold text-indigo-400">B</span>
              <span className="text-[10px] md:text-xs">Set End</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Loop Settings</label>
          <div className="flex gap-2 h-full">
            <button 
              onClick={toggleLoop}
              className={`flex-1 rounded-xl flex items-center justify-center gap-2 transition-all py-2 md:py-3 px-4 ${
                loop.isActive 
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20' 
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <RotateCcw className={`w-3 h-3 md:w-4 h-4 ${loop.isActive ? 'animate-spin-slow' : ''}`} />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                {loop.isActive ? 'Looper On' : 'Start Loop'}
              </span>
            </button>
            <button 
              onClick={resetLoop}
              className="p-2 md:p-3 bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-500/50 rounded-xl transition-all"
              title="Clear Loop"
            >
              <Scissors className="w-3 h-3 md:w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Details</label>
          <div className="bg-slate-800/50 border border-slate-700 p-2 md:p-3 rounded-xl flex flex-col justify-center min-h-[44px] md:min-h-0">
            <div className="flex justify-between text-[9px] md:text-[10px] mb-1">
              <span className="text-slate-500">Duration:</span>
              <span className="text-slate-300">{(loop.endTime - loop.startTime).toFixed(2)}s</span>
            </div>
            <div className="flex justify-between text-[9px] md:text-[10px]">
              <span className="text-slate-500">Range:</span>
              <span className="text-slate-300 font-mono truncate ml-2">{formatTime(loop.startTime)} ➔ {formatTime(loop.endTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineController;
