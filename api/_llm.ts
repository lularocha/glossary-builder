import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

interface OpenAICompatProvider {
  type: "openai-compat";
  baseURL: string;
  model: string;
  apiKeyEnv: string;
}

interface AnthropicProvider {
  type: "anthropic";
  model: string;
  apiKeyEnv: string;
}

type ProviderConfig = OpenAICompatProvider | AnthropicProvider;

// Switch providers by setting LLM_PROVIDER in .env (and in Vercel env vars):
// "deepseek" (active), "gemini", or "anthropic" (Claude Sonnet fallback).
const PROVIDERS: Record<string, ProviderConfig> = {
  deepseek: {
    type: "openai-compat",
    baseURL: "https://api.deepseek.com",
    model: "deepseek-chat",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
  gemini: {
    type: "openai-compat",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    model: "gemini-2.5-flash",
    apiKeyEnv: "GEMINI_API_KEY",
  },
  anthropic: {
    type: "anthropic",
    model: "claude-sonnet-4-6",
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
};

interface GenerateTextOptions {
  prompt: string;
  maxTokens: number;
  temperature?: number;
}

function getConfig(): ProviderConfig {
  const name = process.env.LLM_PROVIDER ?? "deepseek";
  const config = PROVIDERS[name];
  if (!config) {
    throw new Error(
      `Unknown LLM_PROVIDER "${name}". Valid options: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }

  if (!process.env[config.apiKeyEnv]) {
    throw new Error(`Missing ${config.apiKeyEnv} environment variable`);
  }

  return config;
}

/**
 * Sends a single-prompt request to the configured provider and returns the
 * raw text response (expected to be JSON per the prompts in generate/expand).
 */
export async function generateText({
  prompt,
  maxTokens,
  temperature = 0.7,
}: GenerateTextOptions): Promise<string> {
  const config = getConfig();
  const apiKey = process.env[config.apiKeyEnv];

  if (config.type === "anthropic") {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: config.model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: "user", content: prompt }],
    });
    const block = message.content[0];
    return block && block.type === "text" ? block.text : "";
  }

  const client = new OpenAI({ baseURL: config.baseURL, apiKey });
  const completion = await client.chat.completions.create({
    model: config.model,
    max_tokens: maxTokens,
    temperature,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices[0]?.message?.content ?? "";
}

export function isLLMApiError(error: unknown): error is Error {
  return (
    error instanceof OpenAI.APIError || error instanceof Anthropic.APIError
  );
}
