// Fix: Restore missing type definitions and ensure file is treated as a module by adding exports.

/**
 * Enumeration of available mood-weather types used throughout the application.
 */
export enum MoodWeatherType {
  SUNNY = 'SUNNY',
  PARTLY_CLOUDY = 'PARTLY_CLOUDY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  STORM = 'STORM',
  HAZY = 'HAZY',
  WINDY = 'WINDY'
}

/**
 * Configuration object for each mood type, including UI metadata.
 */
export interface MoodConfig {
  type: MoodWeatherType;
  label: string;
  icon: string;
  color: string;
  description: string;
  animationClass: string;
}

/**
 * Represents a single mood entry recorded by the user.
 */
export interface MoodEntry {
  id: string;
  date: string; // ISO format
  timestamp: number;
  mood: MoodWeatherType;
  note?: string;
}

/**
 * Structure of the AI-generated weekly climate report.
 */
export interface ClimateReport {
  summary: string;
  advice: string;
  musicSuggestion: {
    genre: string;
    description: string;
  };
  healingQuote: string;
}
