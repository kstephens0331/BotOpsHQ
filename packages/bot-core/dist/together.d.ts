export type Msg = {
    role: "system" | "user" | "assistant";
    content: string;
};
export declare function chat(messages: Msg[], model: string, temperature?: number, max_tokens?: number): Promise<string>;
export declare function embed(texts: string[], model: string): Promise<number[][]>;
