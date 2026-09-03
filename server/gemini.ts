import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiInstance;
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}
