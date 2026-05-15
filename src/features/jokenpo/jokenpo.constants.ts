export const JOKENPO_STORAGE_KEY = "discordia-jokenpo-game";
export const WIN_SCORE = 3;
export const MAX_ROUNDS = 5;

export type JokenpoChoice = "rock" | "paper" | "scissors";

export const CHOICES: { value: JokenpoChoice; label: string; emoji: string }[] = [
  { value: "rock", label: "Pedra", emoji: "✊" },
  { value: "paper", label: "Papel", emoji: "✋" },
  { value: "scissors", label: "Tesoura", emoji: "✌️" },
];

export function getChoiceMeta(c: JokenpoChoice) {
  return CHOICES.find((x) => x.value === c)!;
}

export function decideWinner(user: JokenpoChoice, ai: JokenpoChoice): "user" | "ai" | "draw" {
  if (user === ai) return "draw";
  if (
    (user === "rock" && ai === "scissors") ||
    (user === "paper" && ai === "rock") ||
    (user === "scissors" && ai === "paper")
  ) {
    return "user";
  }
  return "ai";
}

export function buildJokenpoPrompt(history: { user: JokenpoChoice; ai: JokenpoChoice }[]): string {
  const historyLine = history.length
    ? `\nHistórico desta partida (você é a IA):\n${history
        .map(
          (h, i) =>
            `  Round ${i + 1}: usuário=${h.user} | você=${h.ai} | ${
              decideWinner(h.user, h.ai) === "user"
                ? "usuário venceu"
                : decideWinner(h.user, h.ai) === "ai"
                  ? "você venceu"
                  : "empate"
            }`,
        )
        .join("\n")}`
    : "";

  return [
    `Você está jogando Pedra, Papel e Tesoura contra um usuário humano.`,
    `Escolha uma jogada: rock, paper ou scissors.`,
    `Tente vencer; varie suas jogadas de forma imprevisível.`,
    historyLine,
    `Responda APENAS com uma destas palavras em minúsculas: rock, paper, scissors. Sem mais nada.`,
  ].join("\n");
}

export function parseAIChoice(raw: string): JokenpoChoice | null {
  const txt = raw.toLowerCase();
  if (txt.includes("rock") || txt.includes("pedra")) return "rock";
  if (txt.includes("paper") || txt.includes("papel")) return "paper";
  if (txt.includes("scissor") || txt.includes("tesoura")) return "scissors";
  return null;
}

export function randomChoice(): JokenpoChoice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)].value;
}
