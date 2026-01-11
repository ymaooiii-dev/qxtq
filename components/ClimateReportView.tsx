import React from 'react';
import { ClimateReport } from '../types.ts';
import { Music, Quote, Sun, Disc, Sparkles, AlertCircle } from 'lucide-react';

interface ClimateReportViewProps {
  report: ClimateReport;
  isLoading: boolean;
  hasEnoughData: boolean;
}

const ClimateReportView: React.FC<ClimateReportViewProps> = ({ report, isLoading, hasEnoughData }) => {
  if (!hasEnoughData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center text-slate-300 shadow-xl border border-white">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-3">
          <div className="magazine-label text-slate-400">Data Insufficient</div>
          <h3 className="text-2xl font-light text-slate-800">气象数据收集中...</h3>
        </div>
        <p className="text-slate-500 max-w-xs leading-relaxed text-sm">
          为了生成精准的AI气候报告，请至少记录 3 天的心情数据。
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-pulse">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <Sparkles className="text-indigo-300" size={20} />
          </div>
        </div>
        <div className="magazine-label text-indigo-400">正在分析大气环流...</div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-6 pb-6 border-b border-dashed border-slate-200">
        <div className="magazine-label text-indigo-500 bg-indigo-50 inline-block px-4 py-1 rounded-full">每周气候洞察</div>
        <p className="text-2xl md:text-3xl font-serif text-slate-800 leading-relaxed text-balance">
          {report.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100/50 relative overflow-hidden group hover:bg-orange-50 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sun size={120} className="text-orange-400" />
          </div>
          <div className="relative z-10">
            <div className="magazine-label text-orange-400 mb-4 flex items-center gap-2">
               调节建议
            </div>
            <p className="text-lg text-slate-700 font-medium leading-loose font-serif">
              “{report.advice}”
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between group shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
               <Disc size={24} className="animate-spin-slow" />
            </div>
            <div className="magazine-label text-white/50">听觉处方</div>
          </div>
          <div className="relative z-10 space-y-2">
            <h4 className="text-3xl font-bold tracking-tight">{report.musicSuggestion.genre}</h4>
            <p className="text-indigo-200 text-sm font-medium line-clamp-3 leading-relaxed opacity-90">
              {report.musicSuggestion.description}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] text-center relative overflow-hidden shadow-sm border border-slate-100 group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
        <Quote size={32} className="mx-auto mb-6 text-slate-200 group-hover:text-indigo-300 transition-colors" />
        <p className="text-xl md:text-2xl font-serif text-slate-700 italic leading-loose">
          {report.healingQuote}
        </p>
      </div>
    </div>
  );
};

export default ClimateReportView;