
export enum MediaType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  YOUTUBE = 'YOUTUBE'
}

export interface MediaSource {
  type: MediaType;
  url: string;
  name: string;
  file?: File;
  youtubeId?: string;
}

export interface LoopSettings {
  startTime: number;
  endTime: number;
  isActive: boolean;
  playbackRate: number;
}

export interface GeminiAnalysis {
  summary: string;
  keyMoments: string[];
}
