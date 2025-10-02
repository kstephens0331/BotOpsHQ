export type IndustryProfile = {
    systemPreamble: string;
    bookingHintEnv?: string;
    chatModel: string;
    embedModel: string;
};
export declare function buildSystem(profile: IndustryProfile, kb: string, bookingUrl?: string): string;
