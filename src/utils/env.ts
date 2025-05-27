export function getOpenAIApiKey(): string {
  return process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";
}
