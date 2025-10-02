export function buildSystem(profile, kb, bookingUrl) {
    const bookLine = bookingUrl ? `If they want to book, provide: ${bookingUrl}` : "";
    return `${profile.systemPreamble}\n${bookLine}\n\nRelevant FAQ:\n${kb}`;
}
