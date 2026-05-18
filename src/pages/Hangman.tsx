import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameScoreboard, type ScoreboardAgent } from "@/custom-components/GameScoreboard";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentIA } from "@/contexts/CurrentIAContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { HangmanSetup } from "@/features/hangman/components/HangmanSetup";
import { HangmanStage } from "@/features/hangman/components/HangmanStage";
import { HangmanWord } from "@/features/hangman/components/HangmanWord";
import { HangmanKeyboard } from "@/features/hangman/components/HangmanKeyboard";
import { HangmanRoundResult } from "@/features/hangman/components/HangmanRoundResult";
import { useHangmanGame } from "@/features/hangman/hooks/useHangmanGame";
import {
  MAX_WRONG,
  TOTAL_WORDS,
  getCategoryLabel,
  normalizeWord,
} from "@/features/hangman/hangman.constants";
import { toast } from "sonner";
import { pageMotion } from "@/utils/pageMotion";

export default function Hangman() {
  const { user } = useAuth();
  const { currentIA } = useCurrentIA();
  const navigate = useNavigate();
  const { game, isBusy, currentRound, actions } = useHangmanGame();
  const [chooserDialogOpen, setChooserDialogOpen] = useState(false);
  const [nextWordInput, setNextWordInput] = useState("");
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);

  if (!currentIA) return <Navigate to="/games" replace />;
  if (!user) return null;

  const ia = currentIA as ScoreboardAgent;

  const handleStart = async ({
    mode,
    category,
    word,
  }: {
    mode: "chooser" | "guesser";
    category: string;
    word?: string;
  }) => {
    try {
      await actions.start({ ia, mode, category, word });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao iniciar jogo.");
    }
  };

  const handleNextWord = async () => {
    try {
      await actions.nextWord();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao obter nova palavra.");
    }
  };

  const handleConfirmChooserNextWord = async () => {
    const normalized = normalizeWord(nextWordInput);
    if (normalized.length < 3) {
      toast.error("Palavra muito curta.");
      return;
    }
    try {
      await actions.setChooserNextWord(normalized);
      setNextWordInput("");
      setChooserDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Palavra inválida para a categoria.");
    }
  };

  const handleReset = () => actions.reset();

  const handleQuit = () => {
    actions.reset();
    navigate("/games");
  };

  const renderGameContent = () => {
    if (!game || !currentRound) return null;
    const isFinishedRound = currentRound.status !== "playing";
    const isLastWord = game.currentRound >= TOTAL_WORDS;
    const isGameOver = game.status === "finished";

    return (
      <div className="flex flex-col gap-5">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-40 sm:w-48 md:w-56 lg:w-64 aspect-5/6 shrink-0">
              <HangmanStage wrongCount={currentRound.wrongLetters.length} />
            </div>

            <div className="flex-1 w-full flex flex-col gap-4 items-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Categoria
                </p>
                <p className="text-base sm:text-lg font-semibold">
                  {getCategoryLabel(game.category)}
                </p>
              </div>

              <HangmanWord
                word={currentRound.word}
                tried={currentRound.triedLetters}
                reveal={isFinishedRound}
              />

              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap justify-center">
                <span>
                  Erros:{" "}
                  <strong className="text-foreground">
                    {currentRound.wrongLetters.length}
                  </strong>
                  /{MAX_WRONG}
                </span>
                {currentRound.wrongLetters.length > 0 && (
                  <span className="flex flex-wrap gap-1">
                    {currentRound.wrongLetters.map((l) => (
                      <span
                        key={l}
                        className="px-1.5 py-0.5 rounded text-xs font-bold bg-destructive/15 text-destructive"
                      >
                        {l}
                      </span>
                    ))}
                  </span>
                )}
              </div>

              {game.mode === "chooser" && (
                <div className="w-full flex flex-col items-center gap-2 pt-2">
                  {currentRound.pendingAIGuess && (
                    <p className="text-sm text-muted-foreground">
                      Último chute da IA:{" "}
                      <strong className="text-foreground text-base">
                        {currentRound.pendingAIGuess}
                      </strong>
                      {currentRound.word.includes(currentRound.pendingAIGuess)
                        ? " — acertou!"
                        : " — errou."}
                    </p>
                  )}
                  {currentRound.aiError && (
                    <p className="text-sm text-destructive">{currentRound.aiError}</p>
                  )}
                  {!isFinishedRound && (
                    <Button
                      onClick={() => actions.requestIAGuess()}
                      disabled={isBusy}
                      className="gap-2 cursor-pointer"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="animate-spin" size={16} /> IA pensando...
                        </>
                      ) : (
                        <>
                          <Wand2 size={16} />
                          {currentRound.triedLetters.length === 0
                            ? "IA, chute a primeira letra"
                            : "IA, próxima tentativa"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {game.mode === "guesser" && !isFinishedRound && (
          <Card className="p-3 sm:p-4">
            <HangmanKeyboard
              word={currentRound.word}
              tried={currentRound.triedLetters}
              onGuess={actions.guessLetter}
              disabled={isBusy}
            />
          </Card>
        )}

        {isFinishedRound && !isGameOver && (
          <HangmanRoundResult
            game={game}
            round={currentRound}
            isLastWord={isLastWord}
            isBusy={isBusy}
            onNextWord={handleNextWord}
            onAskChooserNextWord={() => setChooserDialogOpen(true)}
          />
        )}

        {isGameOver && (
          <Card className="p-6 text-center border-2 border-primary/40">
            <Sparkles className="mx-auto mb-2 text-primary" size={32} />
            <h2 className="text-2xl font-bold">
              {game.userScore > game.iaScore
                ? "Você venceu a partida!"
                : game.userScore < game.iaScore
                  ? "A IA venceu a partida."
                  : "Empate na partida."}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Placar final: {game.userScore} × {game.iaScore}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Button onClick={handleReset} className="gap-2 cursor-pointer">
                <RotateCcw size={16} /> Jogar novamente
              </Button>
              <Button variant="outline" onClick={handleQuit} className="cursor-pointer">
                Voltar aos jogos
              </Button>
            </div>
          </Card>
        )}

        {!isGameOver && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmEndOpen(true)}
              className="cursor-pointer"
            >
              Encerrar partida
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 pt-4 pb-12">
      <motion.div {...pageMotion} className="max-w-4xl mx-auto flex flex-col gap-5">
        {game && (
          <GameScoreboard
            user={user}
            ia={ia}
            userScore={game.userScore}
            iaScore={game.iaScore}
            round={game.currentRound}
            totalRounds={TOTAL_WORDS}
            status={game.status === "finished" ? "finished" : "playing"}
            result={
              game.status === "finished"
                ? game.userScore > game.iaScore
                  ? "win"
                  : game.userScore < game.iaScore
                    ? "lose"
                    : "draw"
                : undefined
            }
            gameLabel={`Forca · Melhor de ${TOTAL_WORDS}`}
          />
        )}

        <header className="text-center sm:text-left">
          <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl">
            Jogo da Forca
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Descubra a palavra antes que o boneco seja enforcado.
          </p>
        </header>

        {!game ? (
          <Card className="p-5 sm:p-7">
            <HangmanSetup isBusy={isBusy} onStart={handleStart} />
          </Card>
        ) : (
          renderGameContent()
        )}

        <AlertDialog open={chooserDialogOpen} onOpenChange={setChooserDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Próxima palavra</AlertDialogTitle>
              <AlertDialogDescription>
                Digite a palavra que a IA tentará adivinhar no próximo round.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Label htmlFor="nextWord" className="mb-1.5 block">
                Palavra
              </Label>
              <Input
                id="nextWord"
                value={nextWordInput}
                onChange={(e) => setNextWordInput(e.target.value)}
                placeholder="Ex.: GIRASSOL"
                className="uppercase tracking-wider"
                autoFocus
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setNextWordInput("")}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmChooserNextWord}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={confirmEndOpen} onOpenChange={setConfirmEndOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar a partida?</AlertDialogTitle>
              <AlertDialogDescription>
                Seu progresso será perdido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Encerrar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </section>
  );
}
