import { Chessboard } from "react-chessboard";
import { useTheme } from "@/components/theme-provider";
import type { ChessGame } from "../types";

interface ChessBoardViewProps {
  game: ChessGame;
  onUserMove: (from: string, to: string) => boolean;
}

export function ChessBoardView({ game, onUserMove }: ChessBoardViewProps) {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const canMove = game.status === "user-turn";

  return (
    <div className="w-full max-w-[560px] mx-auto aspect-square">
      <Chessboard
        options={{
          position: game.fen,
          boardOrientation: game.userSide === "w" ? "white" : "black",
          allowDragging: canMove,
          animationDurationInMs: 200,
          showNotation: true,
          lightSquareStyle: { backgroundColor: isDark ? "#3a3f4b" : "#eeeed2" },
          darkSquareStyle: { backgroundColor: isDark ? "#1f232b" : "#769656" },
          boardStyle: {
            borderRadius: "12px",
            overflow: "hidden",
          },
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            if (!targetSquare || !sourceSquare) return false;
            return onUserMove(sourceSquare, targetSquare);
          },
        }}
      />
    </div>
  );
}
