import { Button } from "@/components/ui/button";
import { 
    Command, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandItem, 
    CommandList 
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import HangmanNone from "../assets/hangman-none.jpg";
import HangmanNoneDark from "../assets/hangman-none-dark.jpg";

export default function Hangman() {
    const { theme } = useTheme()
    const [open, setOpen] = useState<boolean>(false);

    const [categoryValue, setCategoryValue] = useState<string>("");
    const [modeGame, setModeGame] = useState<string>('none');
    const [word, setWord] = useState<string>("");

    const [fieldsComplete, setFieldComplete] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState<boolean>(false);

    useEffect(() => {
      verifyFields();
    }, [categoryValue, modeGame, word]);

    const categories = [
        { label: "Animais", value: "animais" },
        { label: "Frutas", value: "frutas" },
        { label: "Países", value: "paises" },
        { label: "Cores", value: "cores" },
        { label: "Partes do corpo", value: "partes-do-corpo" },
        { label: "Profissões", value: "profissoes" },
        { label: "Filmes famosos", value: "filmes-famosos" },
        { label: "Desenhos animados", value: "desenhos-animados" },
        { label: "Esportes", value: "esportes" },
        { label: "Marcas famosas", value: "marcas-famosas" },
        { label: "Comidas", value: "comidas" },
        { label: "Objetos da casa", value: "objetos-da-casa" },
        { label: "Personagens históricos", value: "personagens-historicos" },
        { label: "Instrumentos musicais", value: "instrumentos-musicais" },
        { label: "Cidades brasileiras", value: "cidades-brasileiras" },
        { label: "Super-heróis", value: "super-herois" },
        { label: "Times de futebol", value: "times-de-futebol" },
        { label: "Estilos musicais", value: "estilos-musicais" },
        { label: "Plantas e flores", value: "plantas-e-flores" },
        { label: "Tecnologia", value: "tecnologia" }
    ];

    const letters = [
        { key: 1,label:"A" },
        { key: 2,label:"B" },
        { key: 3,label:"C" },
        { key: 4,label:"D" },
        { key: 5,label:"E" },
        { key: 6,label:"F" },
        { key: 7,label:"G" },
        { key: 8,label:"H" },
        { key: 9,label:"I" },
        { key: 10,label:"J" },
        { key: 11,label:"K" },
        { key: 12,label:"L" },
        { key: 13,label:"M" },
        { key: 14,label:"N" },
        { key: 15,label:"O" },
        { key: 16,label:"P" },
        { key: 17,label:"Q" },
        { key: 18,label:"R" },
        { key: 19,label:"S" },
        { key: 20,label:"T" },
        { key: 21,label:"U" },
        { key: 22,label:"V" },
        { key: 23,label:"X" },
        { key: 24,label:"W" },
        { key: 25,label:"Y" },
        { key: 26,label:"Z" },
    ]

    const testeStr = ""
    const teste = testeStr.split('')

    // console.log('LOOOOOOOOOOOOOOOOOOG TESTE', teste)

    const verifyFields = () => {
      if(categoryValue !== '') {
        if(modeGame === 'chooser' && word !== '') {
          setFieldComplete(true)
        } else {
          setFieldComplete(false)
        }
        if(modeGame === 'guesser') {
          setFieldComplete(true)
        }
      }
    }

    return (
        <section className="py-20 px-10 w-full flex flex-col items-center 2xl:h-[90dvh]">
            <h1 className="
                font-extrabold 
                tracking-tight 
                text-5xl 
                mb-5 
                md:text-6xl 
                md:mb-8 
                xl:text-7xl 
                xl:mb-8 
                2xl:mb-10
                w-full 
                lg:w-[80%]
                2xl:w-[60%]
                flex
                justify-between
            ">
                Jogo da forca
            </h1>
            <div className="flex justify-between items-center w-full lg:w-[80%] 2xl:w-[60%] pb-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={hasStarted}
                    aria-expanded={open}
                    className="
                      w-100 
                      text-2xl 
                      justify-between
                      cursor-pointer
                      p-8
                    "
                  >
                    <p className="ml-2">
                      { 
                        categoryValue
                          ? categories.find((framework) => framework.value === categoryValue)?.label
                          : "Escolha um tema..."
                      }
                    </p>
                    <ChevronsUpDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-1">
                  <Command>
                    <CommandInput placeholder="Filtrar categorias..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((framework) => (
                          <CommandItem
                            className="text-xl p-8 cursor-pointer"
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setCategoryValue(currentValue === categoryValue ? "" : currentValue);
                              setOpen(false);
                            }}
                          >
                            {framework.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                categoryValue === framework.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div>
                <Label className="mb-2">Quem vai escolher a palavra?</Label>
                <div className="flex bg-input rounded-md">
                  {
                    !hasStarted ? 
                      <>
                        <p 
                          className={`cursor-pointer ${modeGame === 'chooser' ? 'bg-background' : 'hover:bg-background'} m-1 py-1 px-2 rounded-sm select-none`}
                          onClick={() => setModeGame('chooser')}>
                          Você escolhe
                        </p>
                        <p 
                          className={`cursor-pointer ${modeGame === 'guesser' ? 'bg-background' : 'hover:bg-background'} m-1 py-1 px-2 rounded-sm select-none`}
                          onClick={() => setModeGame('guesser')}>
                          IA escolhe
                        </p>
                      </> :
                      <>
                        <p 
                          className={`${modeGame === 'chooser' && 'bg-background'} text-ring m-1 py-1 px-2 rounded-sm select-none`}>
                          Você escolhe
                        </p>
                        <p 
                          className={`${modeGame === 'guesser' && 'bg-background'} text-ring m-1 py-1 px-2 rounded-sm select-none`}>
                          IA escolhe
                        </p>
                      </> 
                  }
                </div>
              </div>
              <div>
                <Label className="mb-2">Qual será a palavra?</Label>
                <Input 
                  id="word" 
                  type="word" 
                  onChange={e => setWord(e.target.value)}
                  className="w-100 p-2 py-5" 
                  placeholder="Digite aqui a palavra..." 
                  disabled={modeGame !== 'chooser' || hasStarted}
                  required/>
            </div>
            </div>
                            
              {
                hasStarted &&
                  <div className="
                      bg-accent-foreground 
                      w-full
                      justify-items-center 
                      p-2
                      h-[60dvh]  
                      lg:w-[80%]
                      2xl:w-[60%]
                      lg:flex
                      lg: justify-center
                      lg: items-center
                      relative
                      ">
                        {
                          theme === 'light' ?
                          <img src={HangmanNoneDark} className="w-[60dvw] lg:w-1/3 -mt-2" /> :
                          <img src={HangmanNone} className="w-[60dvw] lg:w-1/3 -mt-2" />
                        }
                        <div className="grid grid-cols-10 place-content-center gap-x-4 w-full h-1/3 lg:w-1/2 lg:h-full">
                            {
                              teste.map((tst) => (
                                <h1 className="border-b-2 border-background text-background font-bold text-center text-2xl 2xl:text-3xl">{tst}</h1>
                              ))
                            }
                        </div>
                  </div>
              }

              <Button 
                className="
                  cursor-pointer 
                  w-full 
                  select-none 
                  p-8
                  my-4 
                  tracking-widest
                  lg:w-[80%] 
                  2xl:w-[60%]
                  text-2xl          
                  bg-green-600! 
                  text-white! 
                  font-semibold 
                  rounded-md 
                  shadow-md 
                  hover:bg-green-700! 
                  transition duration-300"
                onClick={() => setHasStarted(true)}
                disabled={!fieldsComplete}
              >
                JOGAR
              </Button>    

              {
                hasStarted && modeGame === 'guesser' &&
                  <div className="
                      grid
                      grid-cols-12
                      gap-y-4
                      w-full 
                      mt-4
                      place-items-center
                      lg:w-[80%]
                      2xl:w-[60%]
                  ">
                      <>
                          {
                            letters.map((letter) => (
                              <Button key={letter.key} disabled className="w-20 h-20 text-xl rounded-sm select-none cursor-pointer">
                                {letter.label}
                              </Button>
                            ))
                          }
                      </>
                  </div>
              }
            
        </section>
    );
}