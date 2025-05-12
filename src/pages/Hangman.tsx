import { Button } from "@/components/ui/button";
import {
  BicepsFlexed,
  Bot,
  BriefcaseBusiness,
  Citrus,
  Clapperboard,
  Dog,
  Earth,
  Guitar,
  Leaf,
  Music4,
  Palette,
  PersonStanding,
  Sofa,
  Soup,
  Star,
  Tv,
  Volleyball,
} from "lucide-react";
import { useEffect, useState, ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import HangmanNone from "../assets/hangman-none.jpg";
import HangmanNoneDark from "../assets/hangman-none-dark.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  label: string;
  value: string;
  icon: ReactNode; 
}

const ICON_SIZE = 30;

const CATEGORIES: Category[] = [
  { label: "Animais", value: "animais", icon: <Dog size={ICON_SIZE} /> },
  { label: "Frutas", value: "frutas", icon: <Citrus size={ICON_SIZE} /> },
  { label: "Países", value: "paises", icon: <Earth size={ICON_SIZE} /> },
  { label: "Cores", value: "cores", icon: <Palette size={ICON_SIZE} /> },
  { label: "Partes do corpo", value: "partes-do-corpo", icon: <PersonStanding size={ICON_SIZE} /> },
  { label: "Profissões", value: "profissoes", icon: <BriefcaseBusiness size={ICON_SIZE} /> },
  { label: "Filmes famosos", value: "filmes-famosos", icon: <Clapperboard size={ICON_SIZE} /> },
  { label: "Desenhos animados", value: "desenhos-animados", icon: <Tv size={ICON_SIZE} /> },
  { label: "Esportes", value: "esportes", icon: <Volleyball size={ICON_SIZE} /> },
  { label: "Comidas", value: "comidas", icon: <Soup size={ICON_SIZE} /> },
  { label: "Objetos da casa", value: "objetos-da-casa", icon: <Sofa size={ICON_SIZE} /> },
  { label: "Personagens históricos", value: "personagens-historicos", icon: <Star size={ICON_SIZE} /> },
  { label: "Instrumentos musicais", value: "instrumentos-musicais", icon: <Guitar size={ICON_SIZE} /> },
  { label: "Super-heróis", value: "super-herois", icon: <BicepsFlexed size={ICON_SIZE} /> },
  { label: "Estilos musicais", value: "estilos-musicais", icon: <Music4 size={ICON_SIZE} /> },
  { label: "Plantas e flores", value: "plantas-e-flores", icon: <Leaf size={ICON_SIZE} /> },
  { label: "Tecnologia", value: "tecnologia", icon: <Bot size={ICON_SIZE} /> }
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((label, index) => ({
  key: index + 1,
  label,
}));

type GameMode = 'none' | 'chooser' | 'guesser';

export default function Hangman() {
  const { theme } = useTheme();

  const [categoryValue, setCategoryValue] = useState<string>("");
  const [modeGame, setModeGame] = useState<GameMode>('none');
  const [word, setWord] = useState<string>("");

  const [areFieldsComplete, setAreFieldsComplete] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    // Lógica para verificar se os campos estão completos
    if (categoryValue !== '') {
      if (modeGame === 'chooser') {
        setAreFieldsComplete(word !== '');
      } else if (modeGame === 'guesser') {
        setAreFieldsComplete(true);
      } else {
        setAreFieldsComplete(false);
      }
    } else {
      setAreFieldsComplete(false);
    }
  }, [categoryValue, modeGame, word]);

  // Palavra a ser exibida (ainda precisa da lógica de adivinhação)
  const displayWordArr = word.split(''); // Placeholder, vai precisar de lógica real

  const handleStartGame = () => {
    if (areFieldsComplete) {
      setHasStarted(true);
      // Aqui você pode adicionar lógica para buscar uma palavra se modeGame === 'guesser'
      // Por exemplo: fetchWordForCategory(categoryValue).then(setWord);
    }
  };

  const renderModeSelection = () => {
    const commonClasses = "m-1 py-1 px-2 rounded-sm select-none w-full text-center";
    const activeClasses = "bg-background";
    const inactiveHoverClasses = "hover:bg-background";
    const disabledClasses = "text-ring";

    return (
      <div className="flex bg-input rounded-md justify-center md:w-sm">
        <p
          className={`${commonClasses} ${modeGame === 'chooser' ? activeClasses : (hasStarted ? disabledClasses : inactiveHoverClasses)} ${!hasStarted ? 'cursor-pointer' : ''}`}
          onClick={!hasStarted ? () => setModeGame('chooser') : undefined}
        >
          Você escolhe
        </p>
        <p
          className={`${commonClasses} ${modeGame === 'guesser' ? activeClasses : (hasStarted ? disabledClasses : inactiveHoverClasses)} ${!hasStarted ? 'cursor-pointer' : ''}`}
          onClick={!hasStarted ? () => setModeGame('guesser') : undefined}
        >
          IA escolhe
        </p>
      </div>
    );
  };


  return (
    <section className="py-30 px-4 sm:px-10 w-full flex flex-col items-center min-h-[90dvh]">
      <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl mb-5 md:text-6xl md:mb-8 xl:text-7xl xl:mb-8 2xl:mb-10 w-full lg:w-[80%] 2xl:w-[60%]">
        Jogo da Forca
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full lg:w-[80%] 2xl:w-[60%] pb-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="categorySelect" className="mb-1 block text-sm font-medium">Categoria</Label>
          <Select
            onValueChange={(value) => setCategoryValue(value)}
            value={categoryValue}
            disabled={hasStarted}
          >
            <SelectTrigger id="categorySelect" className="text-lg py-3 sm:py-5 cursor-pointer w-full sm:w-[20dvw] min-w-[200px]">
              <SelectValue placeholder="Escolha uma categoria..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem
                  className="text-lg py-3 px-2 cursor-pointer"
                  key={category.value}
                  value={category.value}
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto">
          <Label className="mb-1 block text-sm font-medium">Quem vai escolher a palavra?</Label>
          {renderModeSelection()}
        </div>

        <div className="w-full sm:w-auto">
          <Label htmlFor="wordInput" className="mb-1 block text-sm font-medium">Qual será a palavra?</Label>
          <Input
            id="wordInput"
            type="text" // 'word' não é um tipo HTML padrão
            value={word}
            onChange={e => setWord(e.target.value.toUpperCase())} // Converter para maiúsculas pode ser útil
            className="p-2 py-3 sm:py-5"
            placeholder="Digite a palavra..."
            disabled={modeGame !== 'chooser' || hasStarted}
            required={modeGame === 'chooser'}
          />
        </div>
      </div>

      {hasStarted && (
        <div className="bg-accent-foreground w-full lg:w-[80%] 2xl:w-[60%] p-2 h-[50vh] sm:h-[60dvh] flex flex-col lg:flex-row justify-center items-center relative rounded-md shadow-md">
          <img
            src={theme === 'light' ? HangmanNoneDark : HangmanNone}
            alt="Imagem da forca"
            className="w-[50vw] max-w-[200px] sm:max-w-[250px] lg:w-1/3 lg:max-w-[300px] object-contain mb-4 lg:mb-0 lg:mr-4"
          />
          <div className="grid grid-cols-7 sm:grid-cols-10 place-content-center gap-1 sm:gap-x-2 w-full lg:w-1/2">
            {/* Lógica para exibir as letras da palavra (descobertas ou underscores) */}
            {displayWordArr.map((char, index) => (
              <div
                key={index}
                className="border-b-2 border-background text-background font-bold text-center text-xl sm:text-2xl 2xl:text-3xl h-10 sm:h-12 flex items-center justify-center"
              >
                {char} {/* Substituir por lógica de letra descoberta ou '_' */}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        className="cursor-pointer w-full lg:w-[80%] 2xl:w-[60%] select-none p-6 sm:p-8 my-4 tracking-widest text-xl sm:text-2xl bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleStartGame}
        disabled={!areFieldsComplete || hasStarted}
      >
        {hasStarted ? "PRÓXIMA TENTATIVA" : "JOGAR"}
      </Button>

      {hasStarted && ( // Removido modeGame === 'guesser' para que o teclado apareça em ambos os modos após iniciar
        <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-1 sm:gap-2 w-full lg:w-[80%] 2xl:w-[60%] mt-4 place-items-center">
          {LETTERS.map((letter) => (
            <Button
              key={letter.key}
              // disabled={ lógica para desabilitar letras já tentadas }
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-lg sm:text-xl rounded-sm select-none cursor-pointer"
              variant="outline" // Para um estilo diferente dos botões principais
              // onClick={() => handleLetterGuess(letter.label)}
            >
              {letter.label}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}