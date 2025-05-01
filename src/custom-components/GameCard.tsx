import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogSelectIA } from "./DialogSelectIA";

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
                <DialogSelectIA
                    titleDialog="Escolha contra qual você vai jogar"
                    trigger={
                      <Button className="cursor-pointer p-6 mx-4 mb-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300">
                        JOGAR
                      </Button>
                    } />
            </Card>
        </>
    )
}