import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { formatFallbackAvatarStr } from "@/utils/sharedFunctions"
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons"
import { ThumbsUp } from "lucide-react"

export interface IChatMessage {
    type: 'ia' | 'user'
    agentIA?: 'grok' | 'gemini' | 'deepseek' | 'chat-gpt'
    message: string
}

export const ChatMessage = (props: IChatMessage) => {
    const { user } = useAuth();

    if (props.type === 'user') {
        return (
            <div className="w-full place-items-end place-content-between mb-6">
                <div className="flex justify-end">
                    <div className="p-4 bg-accent-foreground rounded-tl-xl rounded-b-xl">
                        <p className="text-background">{props.message}</p>
                    </div>
                    <Avatar className="w-12 h-12 ml-2 hidden sm:block">
                        <AvatarImage className="object-cover object-center" src={user?.avatar} />
                        <AvatarFallback>{formatFallbackAvatarStr(user)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        )
    }
    if (props.type === 'ia') {
        let iaContent;

        if (props.agentIA === 'gemini') {
            iaContent = <>
                <Gemini size={50} title="Gemini" className="bg-white text-blue-600 hidden sm:block mr-2 p-2 rounded-3xl border" />
                <div className="
                    pt-3 
                    pr-4 
                    pl-4 
                    pb-10 
                    2xl:w-[70%]
                    bg-accent-foreground 
                    rounded-tr-xl 
                    rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        } 
        if (props.agentIA === 'grok') {
            iaContent = <>
                <Grok size={50} title="Grok" className="bg-gray-600 text-white hidden sm:block mr-2 p-2 rounded-3xl border" />
                <div className="
                    pt-3 
                    pr-4 
                    pl-4 
                    pb-10 
                    2xl:w-[70%]
                    bg-accent-foreground 
                    rounded-tr-xl 
                    rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }
        if (props.agentIA === 'deepseek') {
            iaContent = <>
                <DeepSeek size={50} title="Deepseek" className="bg-blue-600 text-white hidden sm:block mr-2 p-2 rounded-3xl border" />
                <div className="
                    pt-3 
                    pr-4 
                    pl-4 
                    pb-10 
                    2xl:w-[70%]
                    bg-accent-foreground 
                    rounded-tr-xl 
                    rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }
        if (props.agentIA === 'chat-gpt') {
            iaContent = <>
                <OpenAI size={50} title="ChatGPT" className="bg-black text-white hidden sm:block mr-2 p-2 rounded-3xl border" />
                <div className="
                    pt-3 
                    pr-4 
                    pl-4 
                    pb-10 
                    2xl:w-[70%]
                    bg-accent-foreground 
                    rounded-tr-xl 
                    rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }

        return (
            <div className="w-full place-content-between mb-6 relative">
                <div className="flex w-full">{iaContent}</div>
                <div title="Essa foi a melhor resposta?">
                <ThumbsUp 
                    size={30} 
                    className="
                        absolute 
                        flex 
                        bottom-0 
                        right-2 
                        2xl:right-[23%]
                        text-background 
                        pb-2 
                        pr-2 
                        cursor-pointer" /> 
                </div>
            </div>
        )
    }
}