export const CHESS_STORAGE_KEY = "discordia-chess-game";

export type ChessLevel = "beginner" | "casual" | "hard";

export const CHESS_LEVELS: Record<
  ChessLevel,
  { label: string; description: string; promptHint: string }
> = {
  beginner: {
    label: "Iniciante",
    description: "A IA joga lances simples e às vezes comete erros.",
    promptHint:
      "Jogue como um iniciante (~800 de Elo): faça lances razoáveis mas evite cálculos profundos; aceite trocas iguais; cometa pequenos erros táticos ocasionais.",
  },
  casual: {
    label: "Casual",
    description: "Equilibrado — bom para uma partida descontraída.",
    promptHint:
      "Jogue como um jogador de clube (~1400 de Elo): desenvolva peças, jogue solidamente, evite blunders, calcule táticas óbvias.",
  },
  hard: {
    label: "Difícil",
    description: "A IA tenta jogar com precisão máxima.",
    promptHint:
      "Jogue de forma agressiva e precisa (~2000+ de Elo): calcule táticas, ataque o rei, busque a melhor jogada possível em cada lance.",
  },
};

export function buildChessMovePrompt(input: {
  fen: string;
  pgn: string;
  side: "w" | "b";
  level: ChessLevel;
  lastInvalid?: string;
}): string {
  const sideName = input.side === "w" ? "Brancas" : "Pretas";
  const invalidNote = input.lastInvalid
    ? `\nO seu último lance "${input.lastInvalid}" foi inválido nesta posição. Escolha outro lance legal.`
    : "";

  return [
    `Você é um motor de xadrez controlando as ${sideName}.`,
    CHESS_LEVELS[input.level].promptHint,
    "",
    `FEN atual: ${input.fen}`,
    `Histórico (PGN): ${input.pgn || "(início)"}`,
    "",
    "É a sua vez de jogar.",
    "Responda APENAS com o próximo lance em notação SAN (ex.: e4, Nf3, O-O, exd5, Qxh7+, e8=Q).",
    "Não inclua o número do lance, comentários, asteriscos ou qualquer outro texto. Apenas o lance.",
    invalidNote,
  ].join("\n");
}
