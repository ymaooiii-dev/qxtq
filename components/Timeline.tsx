import React, { useState } from 'react';
import { MoodEntry } from '../types';
import { MOOD_CONFIGS } from '../constants';
import { Clock, MessageSquare } from 'lucide-react';

interface TimelineProps {
  entries: MoodEntry[];
  label: string;
}

const Timeline: React.FC<TimelineProps> = ({ entries, label }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const handleEntryClick = (id: string, hasNote: boolean) => {
    if (hasNote) {
      setActiveNoteId(prev => prev === id ? null : id);
    }
  };

  return (
    <div className="bg-white/40 p-6 md:p-10 rounded-[2.5rem] border border-white/50 shadow-sm animate-in fade-in duration-700 backdrop-blur-sm">
      <div className="magazine-label text-slate-400 mb-4 flex items-center gap-2">
        <Clock size={12} className="text-slate-300" />
        {label} · 记录流
      </div>
      
      <div className="relative">
        {/* Timeline Line - adjusted top position to align with icons center (80px padding + 28px half-icon) */}
        <div className="absolute top-[107px] left-0 right-0 h-[2px] bg-slate-200/50 rounded-full w-full"></div>
        
        {/* Container with top padding for tooltips to prevent clipping */}
        <div className="flex items-start gap-8 overflow-x-auto pb-6 pt-20 hide-scrollbar relative z-10 px-4 -mx-4 md:mx-0">
          {entries.map((e) => {
            const hasNote = !!e.note;
            const isActive = activeNoteId === e.id;
            
            return (
              <div 
                key={e.id} 
                className="flex flex-col items-center flex-shrink-0 group relative"
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleEntryClick(e.id, hasNote);
                }}
              >
                {hasNote && (
                  <div className={`
                    absolute -top-20 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-xs p-3 rounded-xl 
                    transition-all duration-300 z-50 text-center shadow-xl cursor-auto
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                  `}>
                    <span className="font-serif italic leading-relaxed block select-text">"{e.note}"</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                )}
                
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md border-4 transition-all duration-300 relative z-10
                  ${hasNote ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  ${hasNote && isActive ? 'bg-indigo-600 scale-110 border-indigo-200 ring-4 ring-indigo-100' : 'bg-white border-white'}
                  ${hasNote && !isActive ? 'border-indigo-100' : ''}
                `}>
                  <span className={`inline-block ${MOOD_CONFIGS[e.mood].animationClass} ${isActive ? 'scale-90' : ''}`}>
                    {MOOD_CONFIGS[e.mood].icon}
                  </span>
                  
                  {hasNote && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm transition-colors ${isActive ? 'bg-white' : 'bg-indigo-500'}`}>
                      <MessageSquare size={8} className={isActive ? 'text-indigo-600 fill-current' : 'text-white fill-current'} />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-bold font-mono tracking-tighter transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="w-4 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;