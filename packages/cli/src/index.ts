// packages/cli/src/index.ts
import { Command } from "commander";
import assign from "./commands/botops-assign.js";
import embed from "./commands/botops-embed.js";
import dev from "./commands/botops-dev.js";
import list from "./commands/botops-list.js";
import newTenant from "./commands/botops-new.js";
import scaffold from "./commands/botops-scaffold-bot.js";
import snippet from "./commands/botops-snippet.js";

const prog = new Command("aeon");
prog.command("botops:new <slug>").option("--company <name>").option("--port <port>").action(newTenant);
prog.command("botops:assign <slug> <botId>").option("--port <port>").action(assign);
prog.command("botops:embed <slug> <botId>").action(embed);
prog.command("botops:dev <slug> <botId>").action(dev);
prog.command("botops:list").action(list);
prog.command("botops:snippet <slug> <botId> [apiBase]").action(snippet);
prog.command("botops:scaffold-bot <botId>").option("--name <name>").option("--port <port>").action(scaffold);
prog.parseAsync();
