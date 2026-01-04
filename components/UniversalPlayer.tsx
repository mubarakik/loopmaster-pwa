
import React, { useRef, useEffect, useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { MediaType, MediaSource, LoopSettings } from '../types';

interface UniversalPlayerProps {
  source: MediaSource;
  loop: LoopSettings;
  seekTo: { time: number; timestamp: number } | null;
  onProgress: (time: number) => void;
  onDuration: (duration: number) => void;
}

const UniversalPlayer: React.FC<UniversalPlayerProps> = ({ source, loop, seekTo, onProgress, onDuration }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ytPlayerRef = useRef<any>(null);
  
  const [ytReady, setYtReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load YouTube API
  useEffect(() => {
    if (source.type === MediaType.YOUTUBE) {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      (window as any).onYouTubeIframeAPIReady = () => {
        initYoutube();
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initYoutube();
      }
    }
  }, [source]);

  const initYoutube = () => {
    if (ytPlayerRef.current) ytPlayerRef.current.destroy();
    
    ytPlayerRef.current = new (window as any).YT.Player('yt-player', {
      videoId: source.youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          onDuration(event.target.getDuration());
          setYtReady(true);
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === (window as any).YT.PlayerState.PLAYING);
        }
      }
    });
  };

  useEffect(() => {
    if (!seekTo) return;
    if (source.type === MediaType.AUDIO && audioRef.current) {
      audioRef.current.currentTime = seekTo.time;
    } else if (source.type === MediaType.VIDEO && videoRef.current) {
      videoRef.current.currentTime = seekTo.time;
    } else if (source.type === MediaType.YOUTUBE && ytReady) {
      ytPlayerRef.current.seekTo(seekTo.time);
    }
  }, [seekTo, source.type, ytReady]);

  const togglePlay = () => {
    if (source.type === MediaType.AUDIO && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
    } else if (source.type === MediaType.VIDEO && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (source.type === MediaType.YOUTUBE && ytReady) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
      } else {
        ytPlayerRef.current.playVideo();
      }
    }
  };

  useEffect(() => {
    const media = source.type === MediaType.AUDIO ? audioRef.current : videoRef.current;
    if (!media || !loop.isActive) return;

    const interval = setInterval(() => {
      if (media.currentTime >= loop.endTime && loop.endTime > loop.startTime) {
        media.currentTime = loop.startTime;
      }
      onProgress(media.currentTime);
    }, 50);

    return () => clearInterval(interval);
  }, [source, loop]);

  useEffect(() => {
    if (source.type !== MediaType.YOUTUBE || !ytReady || !loop.isActive) return;

    const interval = setInterval(() => {
      const currentTime = ytPlayerRef.current.getCurrentTime();
      onProgress(currentTime);
      if (currentTime >= loop.endTime && loop.endTime > loop.startTime) {
        ytPlayerRef.current.seekTo(loop.startTime);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [source, loop, ytReady]);

  if (source.type === MediaType.YOUTUBE) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div id="yt-player" className="w-full h-full"></div>
      </div>
    );
  }

  if (source.type === MediaType.VIDEO) {
    return (
      <div className="relative w-full h-full bg-black group">
        <video
          ref={videoRef}
          src={source.url}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => onProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => onDuration(e.currentTarget.duration)}
        />
        <button 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-full border border-white/20">
            {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1" />}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black relative overflow-hidden p-6">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-black pointer-events-none"></div>

      {/* Main Content: Strictly Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-2xl">
        <button 
          onClick={togglePlay}
          className={`
            relative rounded-full flex items-center justify-center
            bg-slate-900 border-4 border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.8)]
            transition-all duration-700 hover:scale-105 active:scale-95
            w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72
            ${isPlaying ? 'rotate-[360deg]' : 'scale-100 shadow-[0_0_30px_rgba(0,0,0,0.4)]'}
          `}
          style={{ 
            transitionDuration: isPlaying ? '25s' : '0.5s', 
            transitionTimingFunction: isPlaying ? 'linear' : 'ease-out' 
          }}
        >
          {/* Vinyl Aesthetic Rings */}
          <div className="absolute inset-2 border border-slate-800/40 rounded-full pointer-events-none"></div>
          <div className="absolute inset-8 sm:inset-10 border border-slate-800/20 rounded-full pointer-events-none"></div>
          <div className="absolute inset-16 sm:inset-20 border border-slate-800/10 rounded-full pointer-events-none"></div>
          
          {/* Label Area */}
          <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 bg-gradient-to-br from-red-600 to-slate-950 rounded-full flex items-center justify-center overflow-hidden shadow-inner group relative">
             <Music className={`w-12 h-12 sm:w-20 sm:h-20 text-white/10 transition-opacity ${isPlaying ? 'opacity-5' : 'opacity-20'}`} />
             <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                {isPlaying ? <Pause className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" /> : <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white/80 ml-1.5" />}
             </div>
          </div>
          
          {/* Center Spindle Hole */}
          <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)] z-20"></div>
        </button>

        {/* Text Metadata */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12 px-4 w-full">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-2 truncate drop-shadow-lg">
            {source.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
             <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.4em] font-black opacity-80">
               {isPlaying ? 'NOW PLAYING' : 'IDLE'}
             </p>
          </div>
        </div>
      </div>

      {/* Discrete Audio Transport Bar */}
      <div className="absolute bottom-6 w-full max-w-xs md:max-w-md px-6 z-20">
        <audio
          ref={audioRef}
          src={source.url}
          className="w-full opacity-10 hover:opacity-100 transition-opacity h-8 rounded-lg overflow-hidden grayscale invert"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => onProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => onDuration(e.currentTarget.duration)}
        />
      </div>
    </div>
  );
};

export default UniversalPlayer;
