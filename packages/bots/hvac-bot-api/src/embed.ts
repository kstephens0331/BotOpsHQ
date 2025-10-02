import { buildStore } from "@aeon/bot-core/retrieval";
import profile from "./profile";

(async () => {
  const kbPath = new URL("./retrieval/kb.json", import.meta.url).pathname;
  const outPath = new URL("./retrieval/store.json", import.meta.url).pathname;
  await buildStore(kbPath, outPath, profile.embedModel);
  console.log("Embedded KB -> store.json");
})().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Embed failed:", msg);
  process.exit(1);
});
