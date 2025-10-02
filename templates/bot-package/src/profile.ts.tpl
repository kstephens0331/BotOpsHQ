import type { IndustryProfile } from "@aeon/bot-core/prompts";
const profile: IndustryProfile = {
  systemPreamble: "You are an industry assistant. Be concise, helpful, and safety-aware where applicable.",
  bookingHintEnv: "CALENDLY_URL",
  chatModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
  embedModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
};
export default profile;
