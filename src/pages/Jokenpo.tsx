import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RotateCcw, Trophy } from "lucide-react";
import { GameScoreboard, type ScoreboardAgent } from "@/custom-components/GameScoreboard";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentIA } from "@/contexts/CurrentIAContext";
import { useJokenpoGame } from "@/features/jokenpo/hooks/useJokenpoGame";
import { JokenpoArena } from "@/features/jokenpo/components/JokenpoArena";
import { JokenpoChoices } from "@/features/jokenpo/components/JokenpoChoices";
import { JokenpoHistory } from "@/features/jokenpo/components/JokenpoHistory";
import { MAX_ROUNDS, WIN_SCORE } from "@/features/jokenpo/jokenpo.constants";
import { pageMotion } from "@/utils/pageMotion";

export default function Jokenpo() {
  const { user } = useAuth();
  const { currentIA } = useCurrentIA();
  const navigate = useNavigate();
  const { game, start, reset, playRound } = useJokenpoGame();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  if (!currentIA) return <Navigate to="/games" replace />;
  if (!user) return null;
  const ia = currentIA as ScoreboardAgent;

  const isFinished = game?.status === "finished";
  const isRevealing = game?.status === "revealing";
  const currentRound = Math.min(
    (game?.rounds.length ?? 0) + (isFinished ? 0 : 1),
    MAX_ROUNDS,
  );
  const result =
    isFinished && game
      ? game.userScore > game.iaScore
        ? "win"
        : game.userScore < game.iaScore
          ? "lose"
          : "draw"
      : undefined;

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 pt-4 pb-12">
      <motion.div {...pageMotion} className="max-w-5xl mx-auto flex flex-col gap-5">
        {game && (
          <GameScoreboard
            user={user}
            ia={ia}
            userScore={game.userScore}
            iaScore={game.iaScore}
            round={currentRound}
            totalRounds={MAX_ROUNDS}
            status={isFinished ? "finished" : "playing"}
            result={result}
            gameLabel={`Jokenpô · Primeiro a ${WIN_SCORE} pontos`}
          />
        )}

        <header className="text-center sm:text-left">
          <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl">
            Jokenpô
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Pedra, papel ou tesoura. O primeiro a {WIN_SCORE} vitórias leva a partida.
          </p>
        </header>

        {!game ? (
          <Card className="p-5 sm:p-7 max-w-xl mx-auto w-full flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Você enfrentará a IA escolhida em uma disputa de melhor de {MAX_ROUNDS} rounds.
              O primeiro a vencer {WIN_SCORE} ganha a partida.
            </p>
            <Button className="cursor-pointer" onClick={() => start(ia)}>
              Iniciar partida
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
            <Card className="p-4 sm:p-6 flex flex-col gap-5">
              <JokenpoArena game={game} />
              {!isFinished ? (
                <>
                  <JokenpoChoices
                    onChoose={playRound}
                    disabled={isRevealing}
                    lastChoice={game.lastUserChoice}
                  />
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmResetOpen(true)}
                      className="cursor-pointer text-muted-foreground"
                    >
                      Encerrar partida
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Trophy className="mx-auto mb-1 text-primary" size={28} />
                  <p className="font-bold text-lg">
                    {result === "win" && "Você venceu a partida!"}
                    {result === "lose" && "A IA venceu a partida."}
                    {result === "draw" && "A partida terminou empatada."}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Placar final: {game.userScore} × {game.iaScore}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => start(ia)} className="gap-2 cursor-pointer">
                      <RotateCcw size={16} /> Revanche
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        reset();
                        navigate("/games");
                      }}
                      className="cursor-pointer"
                    >
                      Voltar aos jogos
                    </Button>
                  </div>
                </div>
              )}
            </Card>
            <div className="flex flex-col gap-3">
              <JokenpoHistory game={game} />
            </div>
          </div>
        )}

        <AlertDialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar partida?</AlertDialogTitle>
              <AlertDialogDescription>
                Você perderá o progresso desta partida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={reset}>Encerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </section>
  );
}
