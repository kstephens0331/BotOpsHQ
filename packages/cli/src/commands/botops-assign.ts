// packages/cli/src/commands/botops-assign.ts
import fs from "fs/promises";
import path from "path";
import { readBots, readTenants, writeTenants, ensureTenant } from "../hub.js";

export default async function botopsAssign(slug:string, botId:string, opts:{port?:string}={}){
  const bots = await readBots();
  const tenants = await readTenants();
  const bot = bots.find((b:any)=>b.id===botId);
  if(!bot) throw new Error(`Unknown bot: ${botId}`);

  await ensureTenant(slug);
  const tdir = path.join("hub","tenants",slug,botId);
  await fs.mkdir(tdir, { recursive: true });

  // seed per-bot env and kb if missing
  try{ await fs.access(path.join(tdir,".env")); } catch {
    await fs.writeFile(path.join(tdir,".env"), `PORT=${opts.port ?? bot.defaultPort}
TOGETHER_API_KEY=
CALENDLY_URL=
`, "utf8");
  }
  try{ await fs.access(path.join(tdir,"kb.json")); } catch {
    await fs.copyFile(bot.kbTemplate, path.join(tdir,"kb.json"));
  }

  // registry update
  const port = Number(opts.port ?? bot.defaultPort);
  let t = tenants.find((x:any)=>x.slug===slug);
  if(!t){ t = { slug, businessName: slug, bots: [] }; tenants.push(t); }
  const row = t.bots.find((b:any)=>b.botId===botId);
  if(row){ row.apiPort = port; }
  else t.bots.push({ botId, apiPort: port, envFile: `hub/tenants/${slug}/${botId}/.env`, kbFile: `hub/tenants/${slug}/${botId}/kb.json` });

  await writeTenants(tenants);
  console.log(`✓ Assigned ${botId} to ${slug} on port ${port}`);
}
