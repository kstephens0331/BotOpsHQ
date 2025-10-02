import type { IndustryProfile } from "@aeon/bot-core/prompts";

const profile: IndustryProfile = {
  systemPreamble: [
    "You are an HVAC website assistant for North Houston.",
    "Be concise, friendly, and safety-aware; for gas/CO concerns tell users to leave and call 911 or the gas utility.",
    "Prefer booking a technician; avoid exact prices unless provided by policy."
  ].join(" "),
  bookingHintEnv: "CALENDLY_URL",
  chatModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
  embedModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
};
export default profile;
