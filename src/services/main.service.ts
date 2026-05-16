import type { AxiosResponse } from "axios";
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

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function readResponse(value: unknown): string | undefined {
    const record = asRecord(value);
    const response = record?.response;
    return typeof response === 'string' ? response : undefined;
}

function normalizeOneIaResponse(data: unknown, agent: string): IResponseApiOneIa {
    const directResponse = readResponse(data);
    if (directResponse !== undefined) return { response: directResponse };

    const record = asRecord(data);
    const agentResponse = record ? readResponse(record[agent]) : undefined;
    if (agentResponse !== undefined) return { response: agentResponse };

    const firstResponse = record
        ? Object.values(record).map(readResponse).find((response) => response !== undefined)
        : undefined;

    return { response: firstResponse ?? '' };
}

export async function askToAll(question: string, signal?: AbortSignal) {
    return api.request<IResponseApiAllIa>({
        method: 'POST',
        url: 'ask-to-all',
        data: { question },
        signal,
    });
}

export async function askToOne(
    question: string,
    agent: string,
    signal?: AbortSignal,
): Promise<AxiosResponse<IResponseApiOneIa>> {
    const response = await api.request<unknown>({
        method: 'POST',
        url: 'ask-to-one',
        data: { question, agent },
        signal,
    });

    return {
        ...response,
        data: normalizeOneIaResponse(response.data, agent),
    };
}
