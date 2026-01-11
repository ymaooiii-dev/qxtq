import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry, MoodWeatherType } from '../types';
import { MOOD_CONFIGS } from '../constants';

interface TrendChartProps {
  entries: MoodEntry[];
  onDayClick?: (dateKey: string) => void;
  selectedDateKey?: string;
}

const MOOD_VALUES: Record<MoodWeatherType, number> = {
  [MoodWeatherType.SUNNY]: 7,
  [MoodWeatherType.PARTLY_CLOUDY]: 6,
  [MoodWeatherType.WINDY]: 5,
  [MoodWeatherType.CLOUDY]: 4,
  [MoodWeatherType.HAZY]: 3,
  [MoodWeatherType.RAINY]: 2,
  [MoodWeatherType.STORM]: 1,
};

const getLocalDateKey = (d: string | number) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const TrendChart: React.FC<TrendChartProps> = ({ entries, onDayClick, selectedDateKey }) => {
  // 获取最近 14 天的有记录日期
  const sortedDates = Array.from(new Set<string>(entries.map(e => getLocalDateKey(e.date))))
    .sort()
    .slice(-14);

  const chartData = sortedDates.map((dateKey: string) => {
    const dayEntries = entries.filter(e => getLocalDateKey(e.date) === dateKey).sort((a,b) => a.timestamp - b.timestamp);
    const lastEntry = dayEntries[dayEntries.length - 1];
    return {
      rawDate: dateKey, // 作为 XAxis 的真正 DataKey
      displayDate: new Date(lastEntry.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
      value: MOOD_VALUES[lastEntry.mood],
      label: MOOD_CONFIGS[lastEntry.mood].label,
      icon: MOOD_CONFIGS[lastEntry.mood].icon,
      allMoods: dayEntries.map(e => ({
        icon: MOOD_CONFIGS[e.mood].icon,
        time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    };
  });

  const handleChartClick = (data: any) => {
    // Recharts 在 AreaChart 上的 onClick 会返回 activeLabel (即 XAxis 的 dataKey)
    const dateKey = data?.activeLabel;
    if (dateKey && onDayClick) {
      onDayClick(dateKey);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl rounded-2xl border border-white/10 text-white min-w-[160px] animate-in zoom-in-95 duration-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">{entry.displayDate} 气象概览</p>
          
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-lg">{entry.icon}</span>
                <span className="font-bold text-lg">{entry.label}</span>
             </div>
             
             {entry.allMoods.length > 1 && (
               <div className="pt-2 border-t border-white/5">
                 <p className="text-[9px] text-slate-500 mb-2 uppercase font-black">当日演变</p>
                 <div className="flex flex-wrap items-center gap-1">
                   {entry.allMoods.map((m: any, idx: number) => (
                     <React.Fragment key={idx}>
                       <span title={m.time} className="text-lg hover:scale-125 transition-transform">{m.icon}</span>
                       {idx < entry.allMoods.length - 1 && <span className="text-[8px] text-slate-600">➔</span>}
                     </React.Fragment>
                   ))}
                 </div>
               </div>
             )}
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">
             <span>点击查看详细记录</span>
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 cursor-pointer relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          onClick={handleChartClick}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#818cf8" floodOpacity={0.2}/>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
          <XAxis 
            dataKey="rawDate" // 关键：使用 rawDate 作为唯一标识
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(val) => {
               const d = new Date(val);
               return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}
            dy={10}
          />
          <YAxis domain={[0, 9]} hide />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '6 6' }}
            allowEscapeViewBox={{ x: true, y: true }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorGradient)"
            animationDuration={1000}
            filter="url(#shadow)"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const isSelected = selectedDateKey === payload.rawDate;
              return (
                <circle 
                  key={payload.rawDate}
                  cx={cx} cy={cy} r={isSelected ? 6 : 4} 
                  fill={isSelected ? '#4f46e5' : '#fff'} 
                  stroke="#6366f1" 
                  strokeWidth={isSelected ? 4 : 2} 
                  className="transition-all duration-300"
                />
              );
            }}
            activeDot={{ 
                r: 10, 
                fill: '#4f46e5', 
                stroke: '#fff', 
                strokeWidth: 4
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;