
import React from 'react';
import { MoodWeatherType } from '../types';
import { MOOD_CONFIGS } from '../constants';

interface MoodSelectorProps {
  onSelect: (type: MoodWeatherType) => void;
  selected?: MoodWeatherType;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {Object.values(MOOD_CONFIGS).map((config) => {
        const isSelected = selected === config.type;
        return (
          <button
            key={config.type}
            onClick={() => onSelect(config.type)}
            className={`flex flex-col items-center group transition-all duration-500`}
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl transition-all duration-500 mb-3 ${
              isSelected 
                ? 'bg-white shadow-xl scale-110 ring-4 ring-slate-100' 
                : 'bg-white/40 hover:bg-white/80 hover:scale-105 shadow-sm'
            }`}>
              <span className={`inline-block ${isSelected ? 'animate-bounce' : config.animationClass}`}>
                {config.icon}
              </span>
            </div>
            <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
