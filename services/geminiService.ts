import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey });

export const generateSubtasks = async (goal: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key is missing, skipping AI generation.");
    // Return the original goal as a single task if AI is unavailable
    return [goal];
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Break down the following goal into 3-5 actionable, concise to-do list items: "${goal}". Return only the list of tasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          },
          required: ["tasks"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(responseText);
    
    // Validate that we received an array
    if (Array.isArray(data.tasks) && data.tasks.length > 0) {
      return data.tasks;
    }
    
    return [goal];

  } catch (error) {
    console.error("Error generating subtasks:", error);
    // Fallback: just return the original text as a single task
    return [goal];
  }
};