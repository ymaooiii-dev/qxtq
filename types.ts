
export enum MoodWeatherType {
  SUNNY = 'SUNNY',
  PARTLY_CLOUDY = 'PARTLY_CLOUDY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  STORM = 'STORM',
  HAZY = 'HAZY',
  WINDY = 'WINDY'
}

export interface MoodEntry {
  id: string;
  date: string; // ISO string for the day
  timestamp: number; // Exact time recorded
  mood: MoodWeatherType;
  note?: string;
}

export interface ClimateReport {
  summary: string;
  advice: string;
  musicSuggestion: {
    genre: string;
    description: string;
  };
  healingQuote: string;
}

export interface MoodConfig {
  type: MoodWeatherType;
  label: string;
  icon: string;
  color: string;
  description: string;
  animationClass: string;
}
