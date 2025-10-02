export type IndustryProfile = {
  systemPreamble: string;               // safety + tone
  bookingHintEnv?: string;              // env var name, e.g., CALENDLY_URL
  chatModel: string;                    // chat model id
  embedModel: string;                   // embedding model id
};

export function buildSystem(profile: IndustryProfile, kb: string, bookingUrl?: string){
  const bookLine = bookingUrl ? `If they want to book, provide: ${bookingUrl}` : "";
  return `${profile.systemPreamble}\n${bookLine}\n\nRelevant FAQ:\n${kb}`;
}
