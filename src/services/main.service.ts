import { api } from "@/server/api";

export interface IResponseApiAllIa {
    'chat-gpt': {
        response: string
    },
    gemini: {
        response: string
    },
    deepseek: {
        response: string
    },
    grok: {
        response: string
    }
}

export interface IResponseApiOneIa {
    response: string
}

export async function askToAll(question: string, signal?: AbortSignal) {
    return api.request<IResponseApiAllIa>({
        method: 'POST',
        url: 'ask-to-all',
        data: { question },
        signal,
    });
}

export async function askToOne(question: string, agent: string, signal?: AbortSignal) {
    return api.request<IResponseApiOneIa>({
        method: 'POST',
        url: 'ask-to-one',
        data: { question, agent },
        signal,
    });
}