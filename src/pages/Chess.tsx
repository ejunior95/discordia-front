import { Navigate, useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { GameScoreboard, type ScoreboardAgent } from "@/custom-components/GameScoreboard";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentIA } from "@/contexts/CurrentIAContext";
import { useChessGame } from "@/features/chess/hooks/useChessGame";
import { ChessSetup } from "@/features/chess/components/ChessSetup";
import { ChessBoardView } from "@/features/chess/components/ChessBoardView";
import { ChessSidePanel } from "@/features/chess/components/ChessSidePanel";
import { CHESS_LEVELS } from "@/features/chess/chess.constants";

export default function Chess() {
  const { user } = useAuth();
  const { currentIA } = useCurrentIA();
  const navigate = useNavigate();
  const { game, tryUserMove, reset, start, resign } = useChessGame();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  if (!currentIA) return <Navigate to="/games" replace />;
  if (!user) return null;
  const ia = currentIA as ScoreboardAgent;

  const isFinished =
    game?.status === "won" || game?.status === "lost" || game?.status === "draw";

  const userScore = game?.status === "won" ? 1 : 0;
  const iaScore = game?.status === "lost" ? 1 : 0;
  const result =
    game?.status === "won" ? "win" : game?.status === "lost" ? "lose" : "draw";

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        {game && (
          <GameScoreboard
            user={user}
            ia={ia}
            userScore={userScore}
            iaScore={iaScore}
            round={1}
            totalRounds={1}
            status={isFinished ? "finished" : "playing"}
            result={isFinished ? result : undefined}
            gameLabel={`Xadrez · ${CHESS_LEVELS[game.level].label}`}
          />
        )}

        <header className="text-center sm:text-left">
          <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl">
            Xadrez
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Estratégia e cálculo. Veja se você consegue derrotar a IA escolhida.
          </p>
        </header>

        {!game ? (
          <Card className="p-5 sm:p-7 max-w-2xl mx-auto w-full">
            <ChessSetup onStart={({ userSide, level }) => start({ ia, userSide, level })} />
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <Card className="p-3 sm:p-4 w-full flex flex-col gap-3">
              <ChessBoardView game={game} onUserMove={tryUserMove} />
              {isFinished && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Trophy className="mx-auto mb-1 text-primary" size={28} />
                  <p className="font-bold text-lg">
                    {game.status === "won" && "Vitória!"}
                    {game.status === "lost" && "Derrota"}
                    {game.status === "draw" && "Empate"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    <Button onClick={() => reset()} className="gap-2 cursor-pointer">
                      <RotateCcw size={16} /> Nova partida
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
            <ChessSidePanel game={game} onResign={() => setConfirmResetOpen(true)} />
          </div>
        )}

        <AlertDialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Desistir da partida?</AlertDialogTitle>
              <AlertDialogDescription>
                A IA receberá o ponto desta partida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar jogando</AlertDialogCancel>
              <AlertDialogAction onClick={resign}>Desistir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
