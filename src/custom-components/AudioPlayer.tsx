import { Loader2, Music2, AlertCircle } from "lucide-react";

export type AudioPlayerStatus = 'pending' | 'ready' | 'failed';

interface AudioPlayerProps {
    status: AudioPlayerStatus;
    audioUrl?: string;
    error?: string;
    label?: string;
}

export function AudioPlayer({ status, audioUrl, error, label }: AudioPlayerProps) {
    if (status === 'pending') {
        return (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{label ?? 'Gerando áudio...'}</span>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex items-center gap-2 text-xs text-destructive py-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error ?? 'Falha ao gerar áudio.'}</span>
            </div>
        );
    }

    if (status === 'ready' && audioUrl) {
        return (
            <div className="flex items-center gap-2 py-2">
                <Music2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <audio controls src={audioUrl} className="h-8 w-full">
                    Seu navegador não suporta áudio.
                </audio>
            </div>
        );
    }

    return null;
}
