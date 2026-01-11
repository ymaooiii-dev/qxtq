import React from 'react';
import { MoodWeatherType } from '../types.ts';
import { MOOD_CONFIGS } from '../constants.tsx';
import { X, Check } from 'lucide-react';

interface MoodNoteInputProps {
  selectedMood: MoodWeatherType;
  note: string;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const MoodNoteInput: React.FC<MoodNoteInputProps> = ({
  selectedMood,
  note,
  onNoteChange,
  onConfirm,
  onCancel
}) => {
  const config = MOOD_CONFIGS[selectedMood];

  return (
    <div className="flex flex-col items-center animate-in zoom-in-95 duration-500 py-2">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 bg-white shadow-xl ring-8 ring-white/30 backdrop-blur-sm`}>
        <span className={`inline-block ${config.animationClass}`}>
          {config.icon}
        </span>
      </div>
      <h3 className="text-2xl font-serif text-slate-800 mb-2">{config.label}</h3>
      <p className="text-slate-400 text-sm mb-8 font-medium">{config.description}</p>

      <div className="w-full max-w-sm relative group">
        <div className="absolute inset-0 bg-white/40 rounded-3xl blur-md -z-10 group-focus-within:bg-indigo-100/40 transition-colors duration-500"></div>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="写下此刻的想法... (可选)"
          maxLength={140}
          className="w-full h-36 bg-white/70 border-2 border-white rounded-3xl p-6 resize-none focus:outline-none focus:border-indigo-200 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 text-lg font-serif leading-relaxed shadow-sm"
          autoFocus
        />
      </div>

      <div className="flex gap-4 mt-10">
        <button
          onClick={onCancel}
          className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-slate-600 transition-colors shadow-sm"
        >
          <X size={24} />
        </button>
        <button
          onClick={onConfirm}
          className="h-14 px-10 rounded-full bg-slate-900 text-white font-bold tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200/50"
        >
          <Check size={20} /> 记录
        </button>
      </div>
    </div>
  );
};

export default MoodNoteInput;