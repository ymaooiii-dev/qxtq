
import { MoodEntry } from "../types";

const STORAGE_KEY = 'mood_weather_entries_v2';

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  // We keep all entries now to track intraday changes
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getMoodEntries(): MoodEntry[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getTodayEntries(): MoodEntry[] {
  const entries = getMoodEntries();
  const today = new Date().toDateString();
  return entries
    .filter(e => new Date(e.date).toDateString() === today)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function clearTodayEntries(): void {
  const today = new Date().toDateString();
  const allEntries = getMoodEntries();
  const filtered = allEntries.filter(e => new Date(e.date).toDateString() !== today);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
