// packages/cli/src/commands/botops-scaffold-bot.ts
import fs from "fs/promises";
import path from "path";

export default async function scaffoldBot(botId:string, opts:{name?:string, port?:string}={}){
  const name = opts.name ?? botId.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
  const pkgDir = path.join("packages","bots",`${botId}-api`);
  await fs.mkdir(path.join(pkgDir,"src","retrieval"), { recursive: true });

  // write from templates
  const tplRoot = path.join("templates","bot-package");
  const files = [
    { src:"package.json.tpl", dst:path.join(pkgDir,"package.json") },
    { src:"src/server.ts.tpl", dst:path.join(pkgDir,"src","server.ts") },
    { src:"src/profile.ts.tpl", dst:path.join(pkgDir,"src","profile.ts") }
  ];
  for(const f of files){
    let txt = await fs.readFile(path.join(tplRoot,f.src), "utf8");
    txt = txt.replaceAll("__BOT_PKG__", `@aeon/${botId}-bot-api`)
             .replaceAll("__BOT_NAME__", name);
    await fs.writeFile(f.dst, txt, "utf8");
  }
  // empty kb.json placeholder
  await fs.writeFile(path.join(pkgDir,"src","retrieval","kb.json"), "[]", "utf8");

  console.log(`✓ Scaffoled bot package: ${botId}-api`);
  console.log(`Next: add to hub/registry/bots.json with defaultPort & kbTemplate.`);
}
