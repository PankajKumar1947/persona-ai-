import OpenAI from "openai";

export function getOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: "https://api.mistral.ai/v1",
  });
}
