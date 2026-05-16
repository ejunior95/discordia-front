import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogSelectIA } from "./DialogSelectIA";

export interface IGameCard {
    titleCard: string;
    description: string;
    imgCard: string;
    /** rota relativa a /games (ex.: "chess"). Vazio = "Em breve". */
    link: string;
    /** rótulo opcional ex.: "Estratégia", "Casual" */
    tag?: string;
}

export function GameCard({ titleCard, description, imgCard, link, tag }: IGameCard) {
    const comingSoon = !link;

    return (
        <Card className="group p-0 overflow-hidden rounded-xl flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                    src={imgCard}
                    alt={titleCard}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                {tag && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 font-medium border">
                        <Sparkles className="h-4 w-4" /> {tag}
                    </span>
                )}
                {comingSoon && (
                    <span className="absolute top-3 right-3 rounded-full bg-amber-500/95 text-white px-2.5 py-1 text-xs font-semibold">
                        Em breve
                    </span>
                )}
            </div>

            <CardHeader className="pt-4">
                <CardTitle className="text-xl">{titleCard}</CardTitle>
                <CardDescription className="line-clamp-3">{description}</CardDescription>
            </CardHeader>

            <CardContent className="mt-auto pb-4 pt-2">
                {comingSoon ? (
                    <Button
                        disabled
                        className="w-full p-5 font-semibold cursor-not-allowed"
                        variant="secondary"
                    >
                        Em breve
                    </Button>
                ) : (
                    <DialogSelectIA
                        titleDialog="Escolha contra qual IA você vai jogar"
                        link={link}
                        trigger={
                            <Button className="w-full p-5 gap-2 bg-green-600! text-white! font-semibold shadow-md hover:bg-green-700! transition duration-300 cursor-pointer">
                                <Play className="h-4 w-4 fill-current" /> Jogar
                            </Button>
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
}