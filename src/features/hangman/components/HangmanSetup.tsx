import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { CATEGORIES, normalizeWord } from "../hangman.constants";
import type { HangmanMode } from "../types";
import { cn } from "@/lib/utils";

interface HangmanSetupProps {
  isBusy: boolean;
  onStart: (params: { mode: HangmanMode; category: string; word?: string }) => void;
}

export function HangmanSetup({ isBusy, onStart }: HangmanSetupProps) {
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState<HangmanMode | null>(null);
  const [word, setWord] = useState("");

  const wordNormalized = normalizeWord(word);
  const canStart =
    category !== "" &&
    mode !== null &&
    (mode === "guesser" || wordNormalized.length >= 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Categoria */}
      <div className="md:col-span-2">
        <Label htmlFor="categorySelect" className="mb-1.5 block text-sm font-medium">
          Categoria
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="categorySelect" className="text-base py-5 cursor-pointer w-full">
            <SelectValue placeholder="Escolha uma categoria..." />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value} className="text-base py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  {c.icon}
                  {c.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Modo */}
      <div className="md:col-span-2">
        <Label className="mb-1.5 block text-sm font-medium">Quem vai escolher a palavra?</Label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setMode("chooser")}
            className={cn(
              "py-3 px-3 rounded-md text-sm sm:text-base font-medium transition cursor-pointer",
              mode === "chooser"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:bg-background/60",
            )}
          >
            Você escolhe
          </button>
          <button
            type="button"
            onClick={() => setMode("guesser")}
            className={cn(
              "py-3 px-3 rounded-md text-sm sm:text-base font-medium transition cursor-pointer",
              mode === "guesser"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:bg-background/60",
            )}
          >
            IA escolhe
          </button>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {mode === "chooser" && "Você digita uma palavra e a IA tenta adivinhar letra por letra."}
          {mode === "guesser" && "A IA escolhe uma palavra da categoria e você tenta adivinhar."}
          {mode === null && "Escolha quem vai pensar na palavra."}
        </p>
      </div>

      {/* Palavra (somente chooser) */}
      {mode === "chooser" && (
        <div className="md:col-span-2">
          <Label htmlFor="wordInput" className="mb-1.5 block text-sm font-medium">
            Qual será a palavra?
          </Label>
          <Input
            id="wordInput"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="py-5 text-base tracking-wider uppercase"
            placeholder="Ex.: ELEFANTE"
            maxLength={32}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Sem acentos, números ou símbolos. Apenas letras de A a Z.
            {wordNormalized && (
              <>
                {" "}
                Será usada: <strong className="text-foreground">{wordNormalized}</strong>
              </>
            )}
          </p>
        </div>
      )}

      <Button
        disabled={!canStart || isBusy}
        onClick={() => onStart({ mode: mode!, category, word: wordNormalized })}
        className="md:col-span-2 py-6 text-base sm:text-lg font-semibold bg-green-600! text-white! hover:bg-green-700! cursor-pointer disabled:cursor-not-allowed"
      >
        {isBusy ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Preparando palavra...
          </>
        ) : (
          <>
            <Play className="mr-2 fill-current" size={18} />
            Começar
          </>
        )}
      </Button>
    </div>
  );
}
