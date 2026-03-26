import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateContent(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
}

export async function formatContent(content: string, instructions: string) {
  const prompt = `
    Content to format:
    ${content}

    Formatting Instructions:
    ${instructions}

    Please return the formatted content only.
  `;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
}
