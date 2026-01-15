import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText as aiGenerateText, CoreMessage } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const FREE_MODELS = [
  'anthropic/claude-3-haiku',
  'google/gemini-pro',
  'mistral/mistral-large',
] as const;

export type Model = typeof FREE_MODELS[number];

interface Usage {
  promptTokens: number;
  completionTokens: number;
}

export async function generateReview(
  messages: CoreMessage[],
  model: Model = 'anthropic/claude-3-haiku'
): Promise<{ text: string; usage: Usage }> {
  const result = await aiGenerateText({
    model: openrouter(model) as any,
    messages,
    maxTokens: 4000,
    temperature: 0.2,
  });

  return {
    text: result.text,
    usage: {
      promptTokens: (result.usage as any)?.promptTokens ?? 0,
      completionTokens: (result.usage as any)?.completionTokens ?? 0,
    },
  };
}

export async function generateAnswer(
  messages: CoreMessage[],
  model: Model = 'anthropic/claude-3-haiku'
): Promise<{ text: string; usage: Usage }> {
  const result = await aiGenerateText({
    model: openrouter(model) as any,
    messages,
    maxTokens: 2000,
    temperature: 0.3,
  });

  return {
    text: result.text,
    usage: {
      promptTokens: (result.usage as any)?.promptTokens ?? 0,
      completionTokens: (result.usage as any)?.completionTokens ?? 0,
    },
  };
}
