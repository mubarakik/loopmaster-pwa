
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeSegment(
  prompt: string,
  mediaName: string,
  startTime: number,
  endTime: number
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am analyzing a segment of media called "${mediaName}". 
      The segment is from ${startTime.toFixed(2)}s to ${endTime.toFixed(2)}s.
      Based on the context (the user is looping this), please provide:
      1. A short description of what they might be focusing on.
      2. 3 educational tips or insights related to this duration.
      Keep it professional and concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            insights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "insights"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
}
