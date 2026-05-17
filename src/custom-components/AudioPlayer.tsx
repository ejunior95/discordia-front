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
}

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ status, audioUrl, error, label, className }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTime = () => setCurrentTime(audio.currentTime);
        const onLoaded = () => setDuration(audio.duration || 0);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);
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
        return (
            <div className={cn("flex items-center gap-2 text-xs text-muted-foreground py-2", className)}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{label ?? 'Gerando áudio...'}</span>
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
                    className="h-8 w-8 rounded-full shrink-0"
                    aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
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
