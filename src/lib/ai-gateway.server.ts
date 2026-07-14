import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  // Check if it's an OpenRouter key (typically starting with sk-or-) or if OPENROUTER_API_KEY is defined
  const isOpenRouter = apiKey.startsWith("sk-or-") || !!process.env.OPENROUTER_API_KEY;
  
  if (isOpenRouter) {
    return createOpenAICompatible({
      name: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      supportsStructuredOutputs: false,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://getmelodia.com", // Optional, for OpenRouter rankings
        "X-Title": "Melodia",
      },
    });
  }

  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    supportsStructuredOutputs: false,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}
