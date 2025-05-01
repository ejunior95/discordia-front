import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface IGameCard {
    titleCard: string
    description: string
    imgCard: string
    link: string
}

export function GameCard(props: IGameCard) {
    return(
        <>
            <Card className="py-0 w-full xl:w-90 rounded-xl">
                <img src={props.imgCard} alt={props.titleCard} className="rounded-t-xl w-full h-70 object-cover" />
                <CardHeader className="-mt-4 mb-4">
                    <CardTitle className="text-xl">{props.titleCard}</CardTitle>
                    <CardDescription>{props.description}</CardDescription>
                </CardHeader>
                <Button className="cursor-pointer inline-flex items-center justify-center p-6 -mt-4 mx-4 mb-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-900 transition duration-300">
                    JOGAR
                </Button>
            </Card>
        </>
    )
}