
import { GoogleGenAI, Chat } from "@google/genai";
import type { JournalEntry, TestResult } from '../types';

// IMPORTANT: This key is a placeholder. In a real environment, it must be
// sourced from a secure environment variable.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using mock service. Please set process.env.API_KEY.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Mock chat implementation for when API key is not available
class MockChat {
    async sendMessageStream(params: { message: string }): Promise<AsyncIterable<any>> {
        const mockResponses = [
            { text: "Hello! " },
            { text: "I'm Serene, your friendly AI assistant. " },
            { text: "Since the Gemini API key is not configured, I'm providing this mock response. " },
            { text: "How can I help you today?" },
        ];
        
        async function* streamGenerator() {
            for (const response of mockResponses) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
                yield response;
            }
        }

        return streamGenerator();
    }
}

interface ChatbotDependencies {
    userName: string;
    isGuest: boolean;
    latestJournalEntry?: JournalEntry;
    latestTestResult?: TestResult;
}

export const createChatSession = (deps: ChatbotDependencies): Chat | MockChat => {
    if (!ai) {
        return new MockChat();
    }

    let systemInstruction = `You are 'Serene', a compassionate, empathetic, and supportive mental health chatbot. 
    Your goal is to provide a safe, non-judgmental space for users to express themselves.
    You must not provide medical advice, diagnosis, or treatment plans. Instead, encourage users to consult with a qualified healthcare professional for medical concerns.
    You can offer evidence-based coping strategies, mindfulness techniques, and general wellness information.
    Keep your responses gentle, encouraging, and supportive.
    
    The user you are speaking with is named ${deps.userName}.`;

    if (deps.isGuest) {
        systemInstruction += ` They are using the app as a guest.`;
    }

    if (deps.latestTestResult) {
        systemInstruction += `\nTheir most recent mental health assessment from ${deps.latestTestResult.date} resulted in a score of ${deps.latestTestResult.score}, which was interpreted as: "${deps.latestTestResult.interpretation}". Use this as context, but do not mention the score directly unless the user asks. Gently guide the conversation based on this insight.`;
    }
    
    if (deps.latestJournalEntry) {
        systemInstruction += `\nTheir latest journal entry from ${deps.latestJournalEntry.updatedAt}, titled "${deps.latestJournalEntry.title}", might provide some context. The content is: "${deps.latestJournalEntry.content.substring(0, 200)}...". Refer to this context subtly to show you remember them, but do not quote it directly.`;
    }

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
        },
    });

    return chat;
};
