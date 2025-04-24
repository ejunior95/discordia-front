import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons"
import { ThumbsUp } from "lucide-react"

export interface IChatMessage {
    type: 'ia' | 'user'
    agentIA?: 'grok' | 'gemini' | 'deepseek' | 'chat-gpt'
    message: string
}

export const ChatMessage = (props: IChatMessage) => {
    const { user } = useAuth();

    const formatFallbackAvatarStr = () => {
        const names = user?.name.split(' ')
        if(names) {
            if(names?.length === 1) {
                return names[0].slice(0,1)
            }
            return `${names[0].slice(0,1)}${names[names.length - 1].slice(0,1)}`
        }
        return '?'
    }

    if (props.type === 'user') {
        return (
            <div className="w-full place-items-end place-content-between mb-6">
                <div className="flex w-1/2 justify-end">
                    <div className="p-4 bg-accent-foreground rounded-tl-xl rounded-b-xl">
                        <p className="text-background">{props.message}</p>
                    </div>
                    <Avatar className="w-12 h-12 ml-2">
                        <AvatarImage className="object-cover object-center" src={user?.avatar} />
                        <AvatarFallback>{formatFallbackAvatarStr()}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        )
    }
    if (props.type === 'ia') {
        let iaContent;

        if (props.agentIA === 'gemini') {
            iaContent = <>
                <Gemini size={50} title="Gemini" className="bg-white text-blue-600 mr-2 p-2 rounded-3xl border" />
                <div className="pt-3 pr-4 pl-4 pb-10 bg-accent-foreground rounded-tr-xl rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        } 
        if (props.agentIA === 'grok') {
            iaContent = <>
                <Grok size={50} title="Grok" className="bg-gray-600 text-white mr-2 p-2 rounded-3xl border" />
                <div className="pt-3 pr-4 pl-4 pb-10 bg-accent-foreground rounded-tr-xl rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }
        if (props.agentIA === 'deepseek') {
            iaContent = <>
                <DeepSeek size={50} title="Deepseek" className="bg-blue-600 text-white mr-2 p-2 rounded-3xl border" />
                <div className="pt-3 pr-4 pl-4 pb-10 bg-accent-foreground rounded-tr-xl rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }
        if (props.agentIA === 'chat-gpt') {
            iaContent = <>
                <OpenAI size={50} title="ChatGPT" className="bg-black text-white mr-2 p-2 rounded-3xl border" />
                <div className="pt-3 pr-4 pl-4 pb-10 bg-accent-foreground rounded-tr-xl rounded-b-xl">
                    <p className="text-muted-foreground select-none italic capitalize pb-2">
                        {`${props.agentIA }:`}
                    </p>
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }

        return (
            <div className="w-full place-content-between mb-6 relative">
                <div className="flex w-1/2">{iaContent}</div>
                <div title="Essa foi a melhor resposta?">
                <ThumbsUp 
                    size={30} 
                    className="absolute flex bottom-0 right-1/2 text-background pb-2 pr-2 cursor-pointer" /> 
                </div>
            </div>
        )
    }
}