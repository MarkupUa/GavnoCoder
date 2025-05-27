import OpenAI from "openai";
import { getOpenAIApiKey } from "../utils/env";
import { ChatMessage } from "../types/chat";

const openai = new OpenAI({ apiKey: getOpenAIApiKey() });

export async function askOpenAI(messages: ChatMessage[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 1024,
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content ?? "";
}
