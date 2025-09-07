
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { ReactionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

export const generateReaction = async (
    reactant1: File,
    reactant2: File,
    prompt: string
): Promise<ReactionResult> => {

    const fullPrompt = `As a creative chemist and AI, your task is to visualize and explain a fictional chemical reaction between the two provided images.

User's request: "${prompt}"

Based on the user's request and the images, generate two things:
1. A photorealistic image of the resulting product or reaction.
2. A detailed, educational explanation of the reaction formatted exactly like this (use markdown for bolding and lists):

**Reaction Name:** [Come up with a creative name for the reaction or product]
**Chemical Equation:** [A plausible-looking, fictional chemical equation for this reaction. e.g., 2Ab + C -> Ab2C]
**Description:** [Explain what is happening during the reaction, step-by-step, in an engaging way.]
**Properties:** 
- [List a key property]
- [List another key property]
- [List a third key property]
**Fun Fact:** [Provide an interesting, made-up fact or potential real-world application for this new substance.]
`;
    
    const reactant1Part = await fileToGenerativePart(reactant1);
    const reactant2Part = await fileToGenerativePart(reactant2);
    const textPart = { text: fullPrompt };

    const model = 'gemini-2.5-flash-image-preview';

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    reactant1Part,
                    reactant2Part,
                    textPart
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: ReactionResult = { image: null, text: null };

        if (response.candidates && response.candidates.length > 0) {
            const parts = response.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    result.image = `data:${mimeType};base64,${base64ImageBytes}`;
                } else if (part.text) {
                    result.text = part.text;
                }
            }
        }
        
        if (!result.image && !result.text) {
            throw new Error("Model did not return any image or text content.");
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API request failed: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while communicating with the Gemini API.");
    }
};
