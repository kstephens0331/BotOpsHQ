import express from "express";
import cors from "cors";
import "dotenv/config";
import { z } from "zod";
import { buildSystem } from "@aeon/bot-core/prompts";
import { chat } from "@aeon/bot-core/together";
import { retrieve } from "@aeon/bot-core/retrieval";
import profile from "./profile.js";
import path from "path";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const ChatSchema = z.object({
  history: z.array(z.object({ role: z.enum(["user","assistant"]), content: z.string() })).default([]),
  userMessage: z.string(),
  wantBookingLink: z.boolean().optional()
});

const storePath = path.join(process.cwd(), "src", "retrieval", "store.json");

app.post("/api/chat", async (req, res) => {
  try {
    const body = ChatSchema.parse(req.body);
    const kb = await retrieve(body.userMessage, storePath, profile.embedModel);
    const bookingUrl = process.env[profile.bookingHintEnv || ""] || undefined;
    const system = buildSystem(profile, kb, bookingUrl);
    const messages = [
      { role: "system", content: system },
      ...body.history,
      { role: "user", content: body.userMessage }
    ] as any[];
    const answer = await chat(messages, profile.chatModel, 0.3, 512);
    res.json({ answer, bookingUrl: bookingUrl ?? null });
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/lead", async (req, res) => { console.log("Lead:", req.body); res.json({ ok: true }); });

const port = process.env.PORT || 8787;
app.listen(port, ()=>console.log("__BOT_NAME__ API http://localhost:"+port));
