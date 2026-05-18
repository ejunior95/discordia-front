import { useEffect, useRef, useState } from "react";
import { Loader2, Music2, AlertCircle, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AudioPlayerStatus = 'pending' | 'ready' | 'failed';

interface AudioPlayerProps {
    status: AudioPlayerStatus;
    audioUrl?: string;
    error?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    onPlayingChange?: (isPlaying: boolean) => void;
    onTimeUpdate?: (currentTime: number) => void;
}

const PENDING_MESSAGES = [
    'Procurando a batida perfeita…',
    'Afinando o autotune…',
    'Sincronizando rimas com o BPM…',
    'Trocando ideia com o produtor…',
    'Ajustando os graves no estúdio…',
    'Aquecendo o microfone…',
    'Mixando vocais e instrumentais…',
    'Polindo a faixa final…',
    'Negociando com as musas do hip hop…',
    'Quase lá, mantenha o flow…',
];

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ status, audioUrl, error, label, className, disabled, onPlayingChange, onTimeUpdate }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [pendingMsgIndex, setPendingMsgIndex] = useState(0);
    const onPlayingChangeRef = useRef(onPlayingChange);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    useEffect(() => {
        onPlayingChangeRef.current = onPlayingChange;
    }, [onPlayingChange]);
    useEffect(() => {
        onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);

    useEffect(() => {
        if (status !== 'pending') return;
        setPendingMsgIndex(Math.floor(Math.random() * PENDING_MESSAGES.length));
        const id = setInterval(() => {
            setPendingMsgIndex((i) => (i + 1) % PENDING_MESSAGES.length);
        }, 3500);
        return () => clearInterval(id);
    }, [status]);

    useEffect(() => {
        if (!disabled) return;
        const audio = audioRef.current;
        if (audio && !audio.paused) {
            audio.pause();
        }
    }, [disabled]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTime = () => {
            setCurrentTime(audio.currentTime);
            onTimeUpdateRef.current?.(audio.currentTime);
        };
        const onLoaded = () => setDuration(audio.duration || 0);
        const onPlay = () => {
            setIsPlaying(true);
            onPlayingChangeRef.current?.(true);
        };
        const onPause = () => {
            setIsPlaying(false);
            onPlayingChangeRef.current?.(false);
        };
        const onEnded = () => {
            setIsPlaying(false);
            onPlayingChangeRef.current?.(false);
        };
        const onVolume = () => {
            setVolume(audio.volume);
            setIsMuted(audio.muted);
        };

        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('durationchange', onLoaded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('volumechange', onVolume);

        return () => {
            audio.removeEventListener('timeupdate', onTime);
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('durationchange', onLoaded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('volumechange', onVolume);
        };
    }, [audioUrl]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            if (disabled) return;
            void audio.play();
        } else {
            audio.pause();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const next = Number(e.target.value);
        audio.currentTime = next;
        setCurrentTime(next);
        onTimeUpdateRef.current?.(next);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const next = Number(e.target.value);
        audio.volume = next;
        if (audio.muted && next > 0) audio.muted = false;
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !audio.muted;
    };

    if (status === 'pending') {
        const message = label ?? PENDING_MESSAGES[pendingMsgIndex];
        return (
            <div
                className={cn(
                    "flex flex-col gap-2 rounded-lg border border-dashed bg-card/40 px-3 py-2.5",
                    className,
                )}
                role="status"
                aria-live="polite"
            >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0 text-primary" />
                    <Music2 className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                    <span
                        key={message}
                        className="min-w-0 truncate animate-[audioPendingFade_0.5s_ease-out]"
                    >
                        {message}
                    </span>
                </div>
                <div className="relative h-1 overflow-hidden rounded-full bg-muted">
                    <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-linear-to-r from-fuchsia-500 via-primary to-cyan-500 animate-[audioPendingShimmer_1.6s_ease-in-out_infinite]" />
                </div>
                <style>{`
                    @keyframes audioPendingFade {
                        from { opacity: 0; transform: translateY(-2px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes audioPendingShimmer {
                        0%   { transform: translateX(-100%); }
                        100% { transform: translateX(400%); }
                    }
                `}</style>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className={cn("flex items-center gap-2 text-xs text-destructive py-2", className)}>
                <AlertCircle className="h-4 w-4" />
                <span>{error ?? 'Falha ao gerar áudio.'}</span>
            </div>
        );
    }

    if (status === 'ready' && audioUrl) {
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        const volumePct = (isMuted ? 0 : volume) * 100;

        return (
            <div
                className={cn(
                    "flex items-center gap-3 rounded-lg border bg-card/50 px-3 py-2 shadow-xs",
                    className,
                )}
            >
                <Music2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />

                <Button
                    type="button"
                    size="icon"
                    variant="default"
                    onClick={togglePlay}
                    disabled={disabled && !isPlaying}
                    className="h-8 w-8 rounded-full shrink-0"
                    aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    title={disabled && !isPlaying ? 'Pause o outro player para reproduzir' : undefined}
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
                </Button>

                <div className="flex flex-1 items-center gap-2 min-w-0">
                    <span className="text-[10px] tabular-nums text-muted-foreground w-10 text-right">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.01}
                        value={currentTime}
                        onChange={handleSeek}
                        aria-label="Progresso"
                        className="audio-range flex-1"
                        style={{ ['--progress' as string]: `${progress}%` }}
                    />
                    <span className="text-[10px] tabular-nums text-muted-foreground w-10">
                        {formatTime(duration)}
                    </span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleMute}
                        className="h-7 w-7"
                        aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </Button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolume}
                        aria-label="Volume"
                        className="audio-range w-16"
                        style={{ ['--progress' as string]: `${volumePct}%` }}
                    />
                </div>

                <audio
                    ref={audioRef}
                    src={audioUrl}
                    preload="metadata"
                    controlsList="nodownload noplaybackrate noremoteplayback"
                    className="hidden"
                >
                    Seu navegador não suporta áudio.
                </audio>
            </div>
        );
    }

    return null;
}
