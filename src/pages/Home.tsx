import { useAuth } from "@/hooks/useAuth";
import { verifyDayOrNight } from "@/utils/globalFunctions";

export default function Home() {
    const { user } = useAuth();
    const greetings = [
        "Pronto para ver as IAs duelarem hoje?",
        "Bem-vindo ao ringue da inteligência artificial!",
        "Quem vai vencer essa batalha de cérebros artificiais?",
        "Seu desafio, múltiplas respostas. Escolha a melhor!",
        "A arena está montada. As melhores IAs do mercado estão preparadas!",
        "IAs em guerra, e aqui você é o juiz.",
        "Prepare-se para um duelo de mentes sintéticas.",
        "Hora do combate: que a melhor IA vença!",
        "Chegou a hora do confronto de titãs digitais!",
        "Mais de uma mente, um só objetivo: te impressionar!",
        "Sente-se, pergunte e assista ao show das máquinas.",
        "Desafie a lógica e compare as inteligências.",
        "Você pergunta e elas lutam por sua aprovação.",
      ];

    return(
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
                2xl:max-w-[1200px]">
                {`${verifyDayOrNight()}, ${user?.name.split(' ')[0]}!`}
            </h1>
            <p className="
                tracking-tight 
                mb-5 
                w-full 
                lg:w-[80%]
                2xl:w-[60%] 
                2xl:max-w-[1200px]
                text-3xl 
                font-semibold 
                text-left">
              {greetings[Math.floor(Math.random() * greetings.length)]}
            </p>
        </section>
    )
}