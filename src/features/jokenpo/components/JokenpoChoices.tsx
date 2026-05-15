import { Button } from "@/components/ui/button";
import { CHOICES, type JokenpoChoice } from "../jokenpo.constants";
import { cn } from "@/lib/utils";

interface JokenpoChoicesProps {
  onChoose: (c: JokenpoChoice) => void;
  disabled?: boolean;
  lastChoice?: JokenpoChoice;
}

export function JokenpoChoices({ onChoose, disabled, lastChoice }: JokenpoChoicesProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl mx-auto">
      {CHOICES.map((c) => (
        <Button
          key={c.value}
          variant="outline"
          disabled={disabled}
          onClick={() => onChoose(c.value)}
          className={cn(
            "flex flex-col items-center gap-1 h-auto py-4 sm:py-6 cursor-pointer transition",
            "hover:border-primary hover:bg-primary/10",
            lastChoice === c.value && "border-primary bg-primary/10",
          )}
        >
          <span className="text-4xl sm:text-5xl md:text-6xl">{c.emoji}</span>
          <span className="text-sm sm:text-base font-semibold">{c.label}</span>
        </Button>
      ))}
    </div>
  );
}
