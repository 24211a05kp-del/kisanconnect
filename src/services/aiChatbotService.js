import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_PROMPT = `You are KisanMitra, a helpful Indian farming assistant. 
- Goal: Provide concise, accurate advice on crops, soil, pests, and weather.
- Tone: Helpful, empathetic, and professional.
- Formatting Rules:
  1. Use ONLY plain text. DO NOT use stars (*), asterisks, or underscores for bolding or lists.
  2. Add a full empty line between each point or paragraph for better spacing.
  3. Keep the language extremely simple for farmers to understand.
  4. Maximum 5 points per response.`;

/**
 * Handles communication with Gemini AI
 * @param {string} message - User input
 * @param {string} uiLanguage - Current UI language (en, hi, te)
 */
export const sendChatMessage = async (message, uiLanguage) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "user", parts: [{ text: message }] }
            ]
        });

        const text = response.text;
        console.log("[AIChatbotService] Gemini Response:", text);

        const suggestionsDict = {
            en: ["🌾 How to prepare soil?", "🌱 Best seeds", "🛡️ Pest control", "☁️ Weather"],
            hi: ["🌾 मिट्टी कैसे तैयार करें?", "🌱 बेहतर बीज", "🛡️ कीट नियंत्रण", "☁️ मौसम"],
            te: ["🌾 మట్టిని ఎలా సిద్ధం చేయాలి?", "🌱 ఉత్తమ విత్తనాలు", "🛡️ తెగులు నివారణ", "☁️ మార్పులు"]
        };

        return {
            reply: text || "I'm sorry, I couldn't generate a response.",
            suggestions: suggestionsDict[uiLanguage] || suggestionsDict.en
        };
    } catch (error) {
        console.error('[AIChatbotService] Gemini API Error:', error);
        return {
            reply: "Sorry, the AI service is currently unavailable. " + (error.message || ""),
            suggestions: []
        };
    }
};

/**
 * Detects the language of a given text
 * @param {string} text 
 * @returns {string} - 'hi', 'te', or 'en'
 */
export const detectLanguage = (text) => {
    const hindiRegex = /[\u0900-\u097F]/;
    const teluguRegex = /[\u0C00-\u0C7F]/;
    if (hindiRegex.test(text)) return 'hi';
    if (teluguRegex.test(text)) return 'te';
    return 'en';
};
