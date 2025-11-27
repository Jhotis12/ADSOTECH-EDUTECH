import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the API only if the key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getGeminiResponse = async (prompt: string): Promise<string> => {
    if (!genAI) {
        return "Error: La API Key de Gemini no está configurada. Por favor revisa el archivo .env.";
    }

    try {
        const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-pro";
        const systemInstruction = import.meta.env.VITE_SYSTEM_PROMPT;

        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        return "Lo siento, tuve un problema al procesar tu solicitud. Intenta de nuevo más tarde.";
    }
};
