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
import { useState } from "react";

export default function Hangman() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

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

    return (
        <section className="
            p-10
            w-full 
            flex 
            flex-col 
            items-center
            2xl:h-[90dvh] 
        ">
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
            ">
                Jogo da forca
            </h1>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="
                    w-full 
                    text-2xl
                    lg:w-[80%]
                    2xl:w-[60%] 
                    justify-between
                    cursor-pointer
                    p-8
                    mb-4
                  "
                >
                  <p className="ml-2">
                    { 
                      value
                        ? categories.find((framework) => framework.value === value)?.label
                        : "Escolha um tema..."
                    }
                  </p>
                  <ChevronsUpDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="start"
                className="
                  p-0 
                  w-[100dvh]!
                  lg:w-[74dvw]!
                  2xl:w-[58.2dvw]!
                  mx-auto
                  
                "
              >
                <Command className="w-full!">
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
                            setValue(currentValue === value ? "" : currentValue);
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === framework.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="
                bg-accent-foreground 
                w-full 
                h-[50dvh]  
                lg:w-[80%]
                2xl:w-[60%]
            ">
            </div>
            <div className="
                flex
                justify-between
                w-full 
                mt-4
                lg:w-[80%]
                2xl:w-[60%]
            ">
                <>
                    {
                      letters.slice(0,12).map((letter) => (
                        <Button key={letter.key} className="px-5 text-xl rounded-sm select-none cursor-pointer">
                          {letter.label}
                        </Button>
                      ))
                    }
                </>
            </div>
            <div className="
                flex
                justify-between
                w-full 
                mt-4
                lg:w-[80%]
                2xl:w-[60%]
            ">
                <>
                    {
                      letters.slice(12,26).map((letter) => (
                        <Button key={letter.key} className="px-5 text-xl rounded-sm select-none cursor-pointer">
                          {letter.label}
                        </Button>
                      ))
                    }
                </>
            </div>
        </section>
    );
}