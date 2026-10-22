import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

export type ChatCandidate = {
  id: string;
  label: string;
  model: LanguageModel;
  supportsTools: boolean;
};

function trimmed(name: string) {
  return process.env[name]?.trim();
}

const openrouter = createOpenRouter({
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://localhost:3000",
    "X-Title": "Ask AI - portfolio",
  },
});

const attempts: ChatCandidate[] = [
  {
    id: "google/gemini",
    label: "Google · Gemini Flash",
    model: google(trimmed("GEMINI_MODEL") ?? "gemini-3.5-flash"),
    supportsTools: true,
  },
  {
    id: "groq/gpt-oss-120b",
    label: "Groq · gpt-oss-120b",
    model: groq(trimmed("GROQ_MODEL") ?? "openai/gpt-oss-120b"),
    supportsTools: true,
  },
  {
    id: "groq/qwen3.8-27b",
    label: "Groq · Qwen 3.8 27B",
    model: groq(trimmed("GROQ_FALLBACK_MODEL") ?? "qwen/qwen3.8-27b"),
    supportsTools: true,
  },
  {
    id: "openrouter/nemotron-3-ultra",
    label: "OpenRouter · Nemotron 3 Ultra",
    model: openrouter.chat(trimmed("OPENROUTER_MODEL") ?? "nvidia/nemotron-3-ultra-550b-a55b:free"),
    supportsTools: true,
  },
  {
    id: "openrouter/nemotron-3-super",
    label: "OpenRouter · Nemotron 3 Super",
    model: openrouter.chat(
      trimmed("OPENROUTER_FALLBACK_MODEL") ?? "nvidia/nemotron-3-super-120b-a12b:free",
    ),
    supportsTools: true,
  },
];

const hasKey = {
  openrouter: Boolean(trimmed("OPENROUTER_API_KEY")),
  groq: Boolean(trimmed("GROQ_API_KEY")),
  google: Boolean(trimmed("GOOGLE_GENERATIVE_AI_API_KEY")),
};

export function chatChain({ requiresTools = false } = {}): ChatCandidate[] {
  return attempts.filter((attempt) => {
    const key = attempt.id.split("/")[0];
    if (!hasKey[key as keyof typeof hasKey]) return false;
    if (requiresTools && !attempt.supportsTools) return false;
    return true;
  });
}

export function chainSummary(): string {
  return chatChain().map((attempt) => attempt.label).join(" → ");
}