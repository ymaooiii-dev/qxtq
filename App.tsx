import React, { useState, useEffect, useRef } from 'react';
import { MoodWeatherType, MoodEntry, ClimateReport } from './types';
import { MOOD_CONFIGS } from './constants';
import { getMoodEntries, saveMoodEntry, getTodayEntries, clearTodayEntries } from './services/storage';
import { generateClimateReport, getDailyInsight } from './services/geminiService';
import MoodSelector from './components/MoodSelector';
import MoodNoteInput from './components/MoodNoteInput';
import TrendChart from './components/TrendChart';
import ClimateReportView from './components/ClimateReportView';
import Timeline from './components/Timeline';
import { Cloud, Calendar, TrendingUp, Sparkles, Clock, ArrowRight, AlertCircle, ChevronLeft, Minus, MessageSquare, Menu, ArrowRightCircle } from 'lucide-react';

// Helper to get consistent local date key YYYY-MM-DD
const getLocalDateKey = (d: string | number) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<MoodEntry[]>([]);
  const [selectedDayEntries, setSelectedDayEntries] = useState<MoodEntry[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('');
  const [dailyInsight, setDailyInsight] = useState<string>('');
  const [climateReport, setClimateReport] = useState<ClimateReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'trends' | 'report'>('today');
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

  // Note taking state
  const [pendingMood, setPendingMood] = useState<MoodWeatherType | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');

  useEffect(() => {
    setEntries(getMoodEntries());
    setTodayEntries(getTodayEntries());
  }, []);

  const latestMood = todayEntries.length > 0 ? todayEntries[todayEntries.length - 1].mood : undefined;

  // Sync Body Class for Dynamic Theming
  useEffect(() => {
    const bgMood = pendingMood || (activeTab === 'trends' && selectedDayEntries.length > 0 
      ? selectedDayEntries[selectedDayEntries.length - 1].mood 
      : latestMood);
    
    if (bgMood) {
      document.body.className = `weather-${bgMood.toLowerCase().replace('_', '-')}`;
    } else {
      document.body.className = '';
    }
    
    if (todayEntries.length > 0 && activeTab === 'today') {
      fetchInsight(todayEntries.map(e => e.mood));
    }
  }, [latestMood, todayEntries, activeTab, selectedDayEntries, pendingMood]);

  const fetchInsight = async (moods: MoodWeatherType[]) => {
    const insight = await getDailyInsight(moods);
    setDailyInsight(insight);
  };

  const handleMoodClick = (mood: MoodWeatherType) => {
    const now = Date.now();
    const lastEntry = todayEntries[todayEntries.length - 1];
    if (lastEntry && now - lastEntry.timestamp < 3600000) {
      const mins = Math.ceil((3600000 - (now - lastEntry.timestamp)) / 60000);
      setCooldownMessage(`${mins}m 后可再次记录记录`);
      setTimeout(() => setCooldownMessage(null), 3000);
      return;
    }
    setPendingMood(mood);
    setNoteContent('');
    setCooldownMessage(null);
  };

  const handleConfirmMood = () => {
    if (!pendingMood) return;
    const newEntry: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      mood: pendingMood,
      note: noteContent.trim() || undefined
    };
    saveMoodEntry(newEntry);
    setTodayEntries(getTodayEntries());
    setEntries(getMoodEntries());
    setPendingMood(null);
    setNoteContent('');
  };

  const handleCancelMood = () => {
    setPendingMood(null);
    setNoteContent('');
  };

  const handleDayClick = (dateKey: string) => {
    const dayEntries = entries.filter(e => 
      getLocalDateKey(e.date) === dateKey
    ).sort((a, b) => a.timestamp - b.timestamp);
    
    if (dayEntries.length > 0) {
      setSelectedDayEntries(dayEntries);
      setSelectedDateKey(dateKey);
      setSelectedDateLabel(new Date(dayEntries[0].date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }));
      
      // 平滑滚动到详情区域
      setTimeout(() => {
        if (detailsRef.current) {
          detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  };

  const handleGenerateReport = async () => {
    setActiveTab('report');
    if (entries.length < 3) return; 
    setIsReportLoading(true);
    try {
      const r = await generateClimateReport(entries);
      setClimateReport(r);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 md:pt-16 px-4 md:px-6 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="max-w-screen-md mx-auto mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000 relative">
        <div className="magazine-label text-slate-400 mb-4 inline-flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1 bg-white/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Mood Atmosphere
        </div>
        
        <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-6 tracking-tight">
          {pendingMood ? (
             <span className="flex items-center justify-center gap-4 animate-in fade-in zoom-in-95">
              <span className="font-serif">记录心情</span>
            </span>
          ) : latestMood ? (
            <span className="flex items-center justify-center gap-4 transition-all duration-700">
              <span className={`inline-block filter drop-shadow-sm ${MOOD_CONFIGS[latestMood].animationClass}`}>
                {MOOD_CONFIGS[latestMood].icon}
              </span>
              <span className="font-serif font-medium">{MOOD_CONFIGS[latestMood].label}</span>
            </span>
          ) : <span className="font-serif">此刻心情</span>}
        </h1>
        
        <p className="text-lg text-slate-500 font-normal max-w-sm mx-auto leading-relaxed">
          {pendingMood ? '这一刻的想法...' : latestMood ? MOOD_CONFIGS[latestMood].description : '如天气般变幻，如诗歌般记录。'}
        </p>
      </header>

      <main className="max-w-screen-md mx-auto">
        <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/50 transition-all duration-700">
          <nav className="flex items-center justify-around p-6 md:p-8 border-b border-white/40 bg-white/10">
            {[
              { id: 'today', label: '今日' },
              { id: 'trends', label: '趋势' },
              { id: 'report', label: '报告' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => tab.id === 'report' ? handleGenerateReport() : setActiveTab(tab.id as any)}
                disabled={!!pendingMood} 
                className={`relative px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-2xl ${
                  activeTab === tab.id ? 'text-slate-900 bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
                } ${pendingMood ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-8 md:p-12 min-h-[500px]">
            {activeTab === 'today' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                <div className="text-center relative">
                  {pendingMood ? (
                    <MoodNoteInput
                      selectedMood={pendingMood}
                      note={noteContent}
                      onNoteChange={setNoteContent}
                      onConfirm={handleConfirmMood}
                      onCancel={handleCancelMood}
                    />
                  ) : (
                    <>
                      <MoodSelector onSelect={handleMoodClick} selected={latestMood} />
                      {cooldownMessage && (
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-rose-400 text-[10px] font-black tracking-widest uppercase animate-in slide-in-from-top-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 shadow-sm">
                          <AlertCircle size={12} /> {cooldownMessage}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {!pendingMood && todayEntries.length > 0 && (
                  <Timeline entries={todayEntries} label="今日" />
                )}

                {!pendingMood && latestMood && dailyInsight && (
                  <div className="bg-gradient-to-br from-white/80 to-white/40 p-10 rounded-[2.5rem] border border-white shadow-sm text-center relative overflow-hidden group">
                    <Sparkles className="absolute top-6 left-6 text-yellow-400 opacity-50 group-hover:scale-125 transition-transform" size={20} />
                    <p className="text-xl md:text-2xl text-slate-700 font-serif leading-relaxed italic">
                      “{dailyInsight}”
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-end px-2">
                   <div className="space-y-1">
                      <div className="magazine-label text-slate-400">Atmospheric Trend</div>
                      <h2 className="text-2xl font-serif text-slate-800">14天心情气象图</h2>
                   </div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">点击节点查看详情</div>
                </div>
                
                <div className="bg-gradient-to-b from-white/60 to-white/30 p-8 rounded-[2.5rem] border border-white/60 shadow-inner">
                  <TrendChart 
                    entries={entries} 
                    onDayClick={handleDayClick} 
                    selectedDateKey={selectedDateKey}
                  />
                </div>

                <div ref={detailsRef} className="space-y-6">
                  {selectedDayEntries.length > 0 && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-6">
                      <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-slate-400" />
                          <h3 className="text-lg font-bold text-slate-800">
                            {selectedDateLabel}
                          </h3>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedDayEntries([]);
                            setSelectedDateKey('');
                          }} 
                          className="text-slate-400 p-2 hover:bg-white rounded-full transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
                        >
                          <ChevronLeft size={16} /> 收起
                        </button>
                      </div>

                      {selectedDayEntries.length > 1 && (
                        <div className="bg-slate-900/5 p-6 rounded-[2rem] border border-slate-200/50">
                          <div className="magazine-label text-slate-500 mb-4">当日气象演变路径</div>
                          <div className="flex flex-wrap items-center gap-4">
                            {selectedDayEntries.map((e, idx) => (
                              <React.Fragment key={e.id}>
                                <div className="flex flex-col items-center">
                                  <span className="text-2xl mb-1">{MOOD_CONFIGS[e.mood].icon}</span>
                                  <span className="text-[9px] font-mono font-bold text-slate-400">
                                    {new Date(e.timestamp).getHours()}:00
                                  </span>
                                </div>
                                {idx < selectedDayEntries.length - 1 && (
                                  <ArrowRightCircle size={16} className="text-slate-300" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      <Timeline entries={selectedDayEntries} label="回顾" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'report' && (
              <div className="animate-in zoom-in-95 duration-700">
                <ClimateReportView 
                   report={climateReport!} 
                   isLoading={isReportLoading} 
                   hasEnoughData={entries.length >= 3} 
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center pb-10">
        <div className="magazine-label text-slate-300 opacity-60">
          Precision Mood Meteorological Station · 2024
        </div>
      </footer>
    </div>
  );
};

export default App;