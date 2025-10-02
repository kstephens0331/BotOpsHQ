import fs from "fs/promises";
import { embed } from "./together.js";

export async function buildStore(kbPath: string, outPath: string, embeddingModel: string){
  const rows = JSON.parse(await fs.readFile(kbPath, "utf8"));
  const corpus = rows.map((r:any)=>`${r.q}\n${r.a}`);
  const vecs = await embed(corpus, embeddingModel);
  const items = rows.map((r:any,i:number)=>({ ...r, vec: vecs[i] }));
  await fs.writeFile(outPath, JSON.stringify({ items }, null, 2), "utf8");
}

export async function retrieve(query: string, storePath: string, embedModel: string){
  const { items } = JSON.parse(await fs.readFile(storePath, "utf8"));
  const [qVec] = await embed([query], embedModel);
  const cosine = (a:number[],b:number[])=>{
    let d=0,na=0,nb=0; for(let i=0;i<a.length;i++){ d+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
    return d/(Math.sqrt(na)*Math.sqrt(nb)+1e-8);
  };
  return items
    .map((it:any)=>({ it, score: cosine(qVec, it.vec) }))
    .sort((a:any,b:any)=>b.score-a.score)
    .slice(0,3)
    .map((r:any)=>`Q: ${r.it.q}\nA: ${r.it.a}`)
    .join("\n---\n");
}
