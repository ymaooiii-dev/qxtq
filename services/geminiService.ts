import { GoogleGenAI, Type } from "@google/genai";
import { MoodEntry, ClimateReport, MoodWeatherType } from "../types.ts";
import { MOOD_CONFIGS } from "../constants.tsx";

export async function generateClimateReport(history: MoodEntry[]): Promise<ClimateReport> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const groupedByDate: Record<string, string[]> = {};
  history.forEach(entry => {
    const d = new Date(entry.date).toLocaleDateString();
    if (!groupedByDate[d]) groupedByDate[d] = [];
    groupedByDate[d].push(MOOD_CONFIGS[entry.mood].label);
  });

  const historyDesc = Object.entries(groupedByDate)
    .slice(-7)
    .map(([date, moods]) => `${date}: ${moods.join(' 转 ')}`)
    .join("\n");

  const prompt = `
    你是一个专业的心情天气分析师。以下是用户过去一周的“心情天气”记录：
    ${historyDesc}

    请生成一份深度的“情绪气候报告”，结果必须是 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            advice: { type: Type.STRING },
            musicSuggestion: {
              type: Type.OBJECT,
              properties: {
                genre: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["genre", "description"],
            },
            healingQuote: { type: Type.STRING },
          },
          required: ["summary", "advice", "musicSuggestion", "healingQuote"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "心情如云烟，变幻是常态。",
      advice: "试着深呼吸，感受当下的宁静。",
      musicSuggestion: { genre: "Lofi", description: "适合放松心情。" },
      healingQuote: "每一朵乌云都镶着金边。"
    };
  }
}

export async function getDailyInsight(moods: MoodWeatherType[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const labels = moods.map(m => MOOD_CONFIGS[m].label).join('转');
  const prompt = `用户今天的心情演变是“${labels}”。请写一句极具共情力的话（15字以内）。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "心情的流转，是灵魂在呼吸。";
  } catch {
    return "感受当下的每一个变化。";
  }
}