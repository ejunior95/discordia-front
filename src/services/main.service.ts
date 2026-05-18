import type { AxiosResponse } from "axios";
import { api } from "@/server/api";

export interface IResponseApiAllIa {
    roundId: string;
    responses: {
        'chat-gpt': { response: string };
        gemini: { response: string };
        deepseek: { response: string };
        grok: { response: string };
    };
}

export interface IResponseApiOneIa {
    response: string
    audio_url?: string
    musicTaskId?: string
    musicStatus?: 'pending' | 'failed' | 'ready'
    creditsCharged?: number
    musicError?: string
}

export type GameActionContext =
    | 'chess'
    | 'hangman-chooser'
    | 'hangman-guesser'
    | 'jokenpo'
    | 'rpg'
    | 'rap-battle';

export type OrchestratorTargetKind =
    | 'chat'
    | 'rap-battle-theme'
    | 'rpg-campaign-theme'
    | 'rpg-master-narration'
    | 'rpg-player-action'
    | 'hangman-word'
    | 'hangman-category';

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function readResponse(value: unknown): string | undefined {
    const record = asRecord(value);
    const response = record?.response;
    return typeof response === 'string' ? response : undefined;
}

function readAudioFields(value: unknown): Omit<IResponseApiOneIa, 'response'> {
    const record = asRecord(value);
    if (!record) return {};
    const result: Omit<IResponseApiOneIa, 'response'> = {};
    if (typeof record.audio_url === 'string') result.audio_url = record.audio_url;
    if (typeof record.musicTaskId === 'string') result.musicTaskId = record.musicTaskId;
    if (typeof record.musicStatus === 'string') {
        const s = record.musicStatus;
        if (s === 'pending' || s === 'failed' || s === 'ready') result.musicStatus = s;
    }
    if (typeof record.creditsCharged === 'number') result.creditsCharged = record.creditsCharged;
    if (typeof record.musicError === 'string') result.musicError = record.musicError;
    return result;
}

function normalizeOneIaResponse(data: unknown, agent: string): IResponseApiOneIa {
    const directResponse = readResponse(data);
    if (directResponse !== undefined) {
        return { response: directResponse, ...readAudioFields(data) };
    }

    const record = asRecord(data);
    const agentValue = record ? record[agent] : undefined;
    const agentResponse = readResponse(agentValue);
    if (agentResponse !== undefined) {
        return { response: agentResponse, ...readAudioFields(agentValue) };
    }

    const firstEntry = record
        ? Object.values(record).find((value) => readResponse(value) !== undefined)
        : undefined;
    if (firstEntry !== undefined) {
        return { response: readResponse(firstEntry) ?? '', ...readAudioFields(firstEntry) };
    }

    return { response: '' };
}

export async function askToAll(question: string, signal?: AbortSignal) {
    return api.request<IResponseApiAllIa>({
        method: 'POST',
        url: 'ask-to-all',
        data: { question },
        signal,
    });
}

export async function voteOnRound(roundId: string, agent: string, signal?: AbortSignal) {
    return api.request<{ roundId: string; winner: string; votedAt: string }>({
        method: 'POST',
        url: `rounds/${roundId}/vote`,
        data: { agent },
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

export async function askGameAction(
    context: GameActionContext,
    agent: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
): Promise<AxiosResponse<IResponseApiOneIa>> {
    const response = await api.request<unknown>({
        method: 'POST',
        url: 'ai/game-action',
        data: { context, agent, payload },
        signal,
    });

    return {
        ...response,
        data: normalizeOneIaResponse(response.data, agent),
    };
}

export async function validateOrchestratorInput(
    kind: OrchestratorTargetKind,
    text: string,
    metadata?: Record<string, unknown>,
    signal?: AbortSignal,
) {
    return api.request<{ severity: 'ok' | 'warn' | 'block'; reason?: string }>({
        method: 'POST',
        url: 'orchestrator/validate',
        data: { kind, text, metadata },
        signal,
    });
}
