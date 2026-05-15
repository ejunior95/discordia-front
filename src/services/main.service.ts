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

export default class MainService {

    async askToAll(question: string, signal?: AbortSignal) {
        if (!question?.trim()) return;
        const response = await api.request<IResponseApiAllIa>({
            method: 'POST',
            url: 'ask-to-all',
            data: { question },
            signal,
        });
        return response;
    }

    async askToOne(question: string, agent: string, signal?: AbortSignal) {
        if (!question?.trim()) return;
        const response = await api.request<IResponseApiOneIa>({
            method: 'POST',
            url: 'ask-to-one',
            data: { question, agent },
            signal,
        });
        return response;
    }
}