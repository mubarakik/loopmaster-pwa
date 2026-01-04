
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, ChevronRight } from 'lucide-react';
import { MediaSource } from '../types';
import { analyzeSegment } from '../services/geminiService';

interface AIAnalysisProps {
  source: MediaSource;
  startTime: number;
  endTime: number;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ source, startTime, endTime }) => {
  const [analysis, setAnalysis] = useState<{ summary: string, insights: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (endTime <= startTime) return;
    setLoading(true);
    const result = await analyzeSegment("Explain this segment", source.name, startTime, endTime);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {!analysis && !loading ? (
        <button 
          onClick={handleAnalyze}
          disabled={endTime <= startTime}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:grayscale"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:animate-pulse" />
          <div className="text-center">
            <span className="text-sm font-bold block">Analyze Segment</span>
            <span className="text-[10px] text-indigo-200">Get AI-driven insights with Gemini</span>
          </div>
        </button>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Analysis Results</span>
            </div>
            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 animate-pulse">Consulting Gemini...</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "{analysis?.summary}"
              </p>
              <div className="space-y-2">
                {analysis?.insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-2 group">
                    <ChevronRight className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    <p className="text-xs text-slate-300 leading-tight">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {endTime <= startTime && !analysis && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3 items-center">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-amber-200 leading-snug">
            Set an <strong className="text-white">A-B range</strong> on the timeline to unlock AI segment analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
