import {
  OPENROUTER_BASE_URL,
  OPENROUTER_GENERATION_CONFIG,
  OPENROUTER_MODEL,
  getOpenRouterApiKey,
} from "./config.js";

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
    code?: number | string;
  };
}

/**
 * Sends a prompt to OpenRouter and returns the raw text response.
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenRouterApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "AI Git Assistant",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      ...OPENROUTER_GENERATION_CONFIG,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `OpenRouter API request failed (${response.status} ${response.statusText})${errorBody ? `: ${errorBody}` : ""}`,
    );
  }

  const data = (await response.json()) as OpenRouterResponse;

  if (data.error) {
    throw new Error(
      `OpenRouter API error: ${data.error.message ?? JSON.stringify(data.error)}`,
    );
  }

  return data.choices?.[0]?.message?.content ?? "";
}
