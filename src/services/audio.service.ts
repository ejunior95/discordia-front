import type { AxiosResponse } from "axios";
import { api } from "@/server/api";

export interface RapVerseStatusResponse {
    status: 'ready' | 'processing' | 'failed';
    audio_url?: string;
    error?: string;
}

export async function getRapVerseStatus(
    taskId: string,
    signal?: AbortSignal,
): Promise<AxiosResponse<RapVerseStatusResponse>> {
    return api.request<RapVerseStatusResponse>({
        method: 'GET',
        url: `music/rap-verse/${taskId}/status`,
        signal,
    });
}

interface PollOptions {
    onReady: (audioUrl: string) => void;
    onError: (message: string) => void;
    signal?: AbortSignal;
    intervalMs?: number;
    timeoutMs?: number;
}

export function pollRapMusic(taskId: string, opts: PollOptions): () => void {
    const intervalMs = opts.intervalMs ?? 5000;
    const timeoutMs = opts.timeoutMs ?? 360000; // 6 min
    const start = Date.now();
    let stopped = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const stop = () => {
        stopped = true;
        if (timeoutId) clearTimeout(timeoutId);
    };

    opts.signal?.addEventListener('abort', stop);

    const tick = async () => {
        if (stopped) return;
        if (Date.now() - start > timeoutMs) {
            opts.onError('Tempo esgotado aguardando geração da música.');
            stop();
            return;
        }
        try {
            const res = await getRapVerseStatus(taskId, opts.signal);
            const data = res.data;
            if (stopped) return;
            if (data.status === 'ready' && data.audio_url) {
                opts.onReady(data.audio_url);
                stop();
                return;
            }
            if (data.status === 'failed') {
                opts.onError(data.error ?? 'Falha ao gerar música.');
                stop();
                return;
            }
        } catch (err) {
            if (opts.signal?.aborted) {
                stop();
                return;
            }
            // erros de rede: continuar tentando
        }
        timeoutId = setTimeout(tick, intervalMs);
    };

    timeoutId = setTimeout(tick, intervalMs);
    return stop;
}
