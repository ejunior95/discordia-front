import { Card } from "@/components/ui/card";
import { GameCard } from "@/custom-components/GameCard";
import ThumbJokenpo from '../assets/thumb_jokenpo.png';
import ThumbForca from '../assets/thumb_forca.png';
import ThumbXadrez from '../assets/thumb-xadrez.jpg';

export default function Games() {
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
                Jogos com IA
            </h1>
            <Card className="
                tracking-tight 
                w-full 
                lg:w-[80%]
                2xl:w-[60%] 
                2xl:max-w-[1200px]
                p-5
                grid
                grid-cols-3
                gap-4
                ">
                <GameCard
                    titleCard="Xadrez"
                    description="Coloque suas habilidades à prova em uma partida estratégica contra a inteligência artificial."
                    imgCard={ThumbXadrez}
                />
                <GameCard
                    titleCard="Jokenpô"
                    description="Clássico Pedra, Papel e Tesoura. Escolha sua jogada e veja se consegue vencer a IA!"
                    imgCard={ThumbJokenpo}
                />
                <GameCard
                    titleCard="Forca"
                    description="Descubra a palavra secreta antes que a IA vença. Use lógica e intuição para ganhar."
                    imgCard={ThumbForca}
                />
            </Card>
        </section>
    )
}