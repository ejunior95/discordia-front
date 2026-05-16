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
