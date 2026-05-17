import { motion } from 'framer-motion';
import { GameCard } from "@/custom-components/GameCard";
import ThumbJokenpo from '../assets/thumb_jokenpo.png';
import ThumbForca from '../assets/thumb_forca.png';
import ThumbXadrez from '../assets/thumb-xadrez.jpg';
import { pageMotion } from '@/utils/pageMotion';

interface Game {
    title: string;
    description: string;
    img: string;
    link: string;
    tag?: string;
}

const GAMES: Game[] = [
    {
        title: "Xadrez",
        description: "Coloque suas habilidades à prova em uma partida estratégica contra a IA.",
        img: ThumbXadrez,
        link: "chess",
        tag: "Estratégia",
    },
    {
        title: "Jokenpô",
        description: "Pedra, Papel e Tesoura clássico. Escolha sua jogada e vença a IA!",
        img: ThumbJokenpo,
        link: "jokenpo",
        tag: "Casual",
    },
    {
        title: "Forca",
        description: "Descubra a palavra secreta antes que a IA vença. Use lógica e intuição.",
        img: ThumbForca,
        link: "hangman",
        tag: "Palavras",
    },
];

export default function Games() {
    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <motion.div {...pageMotion} className="max-w-6xl mx-auto">
                <header className="mb-8 md:mb-12">
                    <h1 className="font-extrabold tracking-tight text-4xl md:text-5xl xl:text-6xl">
                        Jogos com IA
                    </h1>
                    <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-2xl">
                        Desafie diferentes inteligências artificiais em jogos clássicos.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {GAMES.map((game) => (
                        <GameCard
                            key={game.title}
                            titleCard={game.title}
                            description={game.description}
                            imgCard={game.img}
                            link={game.link}
                            tag={game.tag}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
