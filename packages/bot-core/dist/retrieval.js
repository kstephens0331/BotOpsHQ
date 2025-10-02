import fs from "fs/promises";
import { embed } from "./together.js";
export async function buildStore(kbPath, outPath, embeddingModel) {
    const rows = JSON.parse(await fs.readFile(kbPath, "utf8"));
    const corpus = rows.map((r) => `${r.q}\n${r.a}`);
    const vecs = await embed(corpus, embeddingModel);
    const items = rows.map((r, i) => ({ ...r, vec: vecs[i] }));
    await fs.writeFile(outPath, JSON.stringify({ items }, null, 2), "utf8");
}
export async function retrieve(query, storePath, embedModel) {
    const { items } = JSON.parse(await fs.readFile(storePath, "utf8"));
    const [qVec] = await embed([query], embedModel);
    const cosine = (a, b) => {
        let d = 0, na = 0, nb = 0;
        for (let i = 0; i < a.length; i++) {
            d += a[i] * b[i];
            na += a[i] * a[i];
            nb += b[i] * b[i];
        }
        return d / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
    };
    return items
        .map((it) => ({ it, score: cosine(qVec, it.vec) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((r) => `Q: ${r.it.q}\nA: ${r.it.a}`)
        .join("\n---\n");
}
