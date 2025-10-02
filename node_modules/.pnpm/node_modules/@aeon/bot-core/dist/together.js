// packages/bot-core/src/together.ts
import fetch from "node-fetch";
const BASE = "https://api.together.xyz/v1";
export async function chat(messages, model, temperature = 0.3, max_tokens = 512) {
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
    const j = (await r.json());
    const content = j?.choices?.[0]?.message?.content ??
        ""; // graceful fallback to empty string
    return content;
}
export async function embed(texts, model) {
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
    const j = (await r.json());
    // Defensive: ensure embeddings exist and are numeric arrays
    if (!Array.isArray(j.data)) {
        throw new Error("Malformed embeddings response: missing data[]");
    }
    return j.data.map((d) => d.embedding);
}
