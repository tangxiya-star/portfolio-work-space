
import { GoogleGenAI } from "@google/genai";
import { PROJECTS } from "../constants";

// The API key is obtained exclusively from process.env.API_KEY
export const generateCuratorResponse = async (history: { role: 'user' | 'model', text: string }[]) => {
  if (!process.env.API_KEY) return "I'm sorry, I'm resting right now. (API Key missing)";

  // Initializing GoogleGenAI with the API key directly from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are "The Curator," an intelligent and thoughtful design strategist assistant for this portfolio.
    Your tone is: Calm, Intelligent, Approachable, and Slightly Playful.
    You help visitors navigate the portfolio of a senior product designer.
    
    The portfolio contains these projects:
    ${PROJECTS.map(p => `- ${p.title}: ${p.description} (Difficulty: ${p.difficulty})`).join('\n')}
    
    When asked about the designer's skills, mention they are "Strategic, Curious, and Warm."
    Keep your answers concise, as if you're a micro-copy tip in a game.
    Always be helpful and encourage users to "Play" (view) the projects.
  `;

  try {
    // Using ai.models.generateContent with model name and contents mapping to the expected structure
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      config: {
        systemInstruction,
        temperature: 0.7,
        // Removed maxOutputTokens to follow guidelines regarding thinkingBudget avoidance
      },
    });

    // Extracting text output directly from the .text property
    return response.text || "I'm pondering... ask me again in a moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The puzzle logic had a small hiccup. Feel free to try again!";
  }
};
