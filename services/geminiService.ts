
import { GoogleGenAI, Type } from "@google/genai";
import { MoodEntry, ClimateReport, MoodWeatherType } from "../types";
import { MOOD_CONFIGS } from "../constants";

export async function generateClimateReport(history: MoodEntry[]): Promise<ClimateReport> {
  // Always create a new GoogleGenAI instance right before making an API call to ensure current configuration.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Group by date to show intraday changes to AI
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
    你是一个专业的心情天气分析师。以下是用户过去一周的“心情天气”记录，包含了一天内的情绪演变（如“雨转晴”）：
    ${historyDesc}

    请生成一份深度的“情绪气候报告”：
    1. summary: 总结这一周的情感基调，特别关注一天之中的起伏模式。
    2. advice: 针对这种波动模式给出的调节建议。
    3. musicSuggestion: 包含音乐流派 (genre) 和具体推荐理由 (description)。
    4. healingQuote: 一句治愈金句。
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

    // Directly access the .text property from GenerateContentResponse
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(error);
    return {
      summary: "你的心情像变幻的风。不论转晴还是转雨，这都是最真实的你。",
      advice: "试着观察那些让你心情转晴的瞬间，把它们收藏起来。",
      musicSuggestion: { genre: "氛围音乐", description: "适合在心情流转时静静聆听。" },
      healingQuote: "每一阵风都有它的方向，每一朵云都有它的归宿。"
    };
  }
}

export async function getDailyInsight(moods: MoodWeatherType[]): Promise<string> {
  // Always create a new GoogleGenAI instance right before making an API call to ensure current configuration.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const labels = moods.map(m => MOOD_CONFIGS[m].label).join('转');
  const prompt = `用户今天的心情演变是“${labels}”。请写一句极具共情力的话。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Directly access the .text property
    return response.text || "心情的流转，是灵魂在呼吸。";
  } catch {
    return "感受当下的每一个变化，那都是生命的色彩。";
  }
}
