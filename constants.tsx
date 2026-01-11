
import React from 'react';
import { MoodWeatherType, MoodConfig } from './types';

export const MOOD_CONFIGS: Record<MoodWeatherType, MoodConfig> = {
  [MoodWeatherType.SUNNY]: {
    type: MoodWeatherType.SUNNY,
    label: '晴朗',
    icon: '☀️',
    color: 'bg-yellow-400',
    description: '心情大好，充满活力和阳光。',
    animationClass: 'animate-w-spin'
  },
  [MoodWeatherType.PARTLY_CLOUDY]: {
    type: MoodWeatherType.PARTLY_CLOUDY,
    label: '多云',
    icon: '🌤️',
    color: 'bg-blue-300',
    description: '总体不错，但偶尔有些小思绪。',
    animationClass: 'animate-w-float'
  },
  [MoodWeatherType.CLOUDY]: {
    type: MoodWeatherType.CLOUDY,
    label: '阴天',
    icon: '☁️',
    color: 'bg-gray-400',
    description: '情绪平平，感觉有点压抑或没精神。',
    animationClass: 'animate-w-float'
  },
  [MoodWeatherType.RAINY]: {
    type: MoodWeatherType.RAINY,
    label: '细雨',
    icon: '🌧️',
    color: 'bg-blue-500',
    description: '有些忧伤或疲惫，想一个人静静。',
    animationClass: 'animate-w-rain'
  },
  [MoodWeatherType.STORM]: {
    type: MoodWeatherType.STORM,
    label: '雷阵雨',
    icon: '⛈️',
    color: 'bg-indigo-700',
    description: '压力山大，情绪爆发或焦虑不安。',
    animationClass: 'animate-w-shake'
  },
  [MoodWeatherType.HAZY]: {
    type: MoodWeatherType.HAZY,
    label: '雾霾',
    icon: '🌫️',
    color: 'bg-stone-500',
    description: '迷茫混沌，看不清方向，心神不宁。',
    animationClass: 'animate-w-pulse'
  },
  [MoodWeatherType.WINDY]: {
    type: MoodWeatherType.WINDY,
    label: '大风',
    icon: '💨',
    color: 'bg-teal-400',
    description: '心绪波动，思绪万千，难以平静。',
    animationClass: 'animate-w-wind'
  }
};

export const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
