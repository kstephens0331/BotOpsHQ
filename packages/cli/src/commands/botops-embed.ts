// packages/cli/src/commands/botops-embed.ts
import fs from "fs/promises";
import path from "path";
import { readBots } from "../hub.js";
import { spawn } from "child_process";

export default async function botopsEmbed(slug:string, botId:string){
  const bots = await readBots();
  const bot = bots.find((b:any)=>b.id===botId);
  if(!bot) throw new Error(`Unknown bot: ${botId}`);

  const root = process.cwd();
  const apiDir = path.join(root, "packages", "bots", `${botId}-api`);
  const kbSrc = path.join(root, "hub", "tenants", slug, botId, "kb.json");
  const kbDst = path.join(apiDir, "src", "retrieval", "kb.json");

  await fs.rm(kbDst, { force: true });
  await fs.symlink(kbSrc, kbDst);

  const bin = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const p = spawn(bin, ["-C", apiDir, "embed:kb"], { stdio: "inherit", env: process.env });
  await new Promise((res, rej)=>p.on("close", c=>c===0?res(0):rej(new Error(`embed exit ${c}`))));
  console.log(`✓ Embedded KB for ${slug}/${botId}`);
}
