// packages/cli/src/commands/botops-dev.ts
import { readBots } from "../hub.js";
import path from "path";
import { spawn } from "child_process";

export default async function botopsDev(slug:string, botId:string){
  const bots = await readBots();
  const bot = bots.find((b:any)=>b.id===botId);
  if(!bot) throw new Error(`Unknown bot: ${botId}`);

  const root = process.cwd();
  const apiDir = path.join(root, "packages", "bots", `${botId}-api`);
  const widDir = path.join(root, "packages", "bot-widget");

  const bin = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const api = spawn(bin, ["-C", apiDir, "dev"], { stdio: "inherit", env: process.env });
  const wid = spawn(bin, ["-C", widDir, "dev"], { stdio: "inherit", env: process.env });

  process.on("SIGINT", ()=>{ api.kill(); wid.kill(); });
}
