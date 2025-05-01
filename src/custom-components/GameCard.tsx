import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface IGameCard {
    titleCard: string
    description: string
    imgCard: string
}

export function GameCard(props: IGameCard) {
    return(
        <>
            <Card className="py-0 w-90">
                <img src={props.imgCard} alt="Jokenpo" className="rounded-t-xl w-90 h-70" />
                <CardHeader className="-mt-4 mb-4">
                    <CardTitle className="text-xl">{props.titleCard}</CardTitle>
                    <CardDescription>{props.description}</CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}