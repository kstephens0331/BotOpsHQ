// packages/bot-core/src/together.ts
import fetch from "node-fetch";

const BASE = "https://api.together.xyz/v1";

export type Msg = { role: "system" | "user" | "assistant"; content: string };

type ChatCompletionResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
};

type EmbeddingsResponse = {
  data: Array<{ embedding: number[] }>;
};

export async function chat(
  messages: Msg[],
  model: string,
  temperature = 0.3,
  max_tokens = 512
): Promise<string> {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens }),
  });

  if (!r.ok) {
    throw new Error(`Together ${r.status}: ${await r.text()}`);
  }

  // TS 5.6+: json() returns unknown — assert to our interface
  const j = (await r.json()) as ChatCompletionResponse;

  const content =
    j?.choices?.[0]?.message?.content ??
    ""; // graceful fallback to empty string

  return content;
}

export async function embed(
  texts: string[],
  model: string
): Promise<number[][]> {
  const r = await fetch(`${BASE}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: texts }),
  });

  if (!r.ok) {
    throw new Error(await r.text());
  }

  const j = (await r.json()) as EmbeddingsResponse;

  // Defensive: ensure embeddings exist and are numeric arrays
  if (!Array.isArray(j.data)) {
    throw new Error("Malformed embeddings response: missing data[]");
  }

  return j.data.map((d) => d.embedding);
}
