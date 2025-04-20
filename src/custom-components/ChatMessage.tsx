import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons"

export interface IChatMessage {
    type: 'ia' | 'user'
    agentIA?: 'grok' | 'gemini' | 'deepseek' | 'chat-gpt'
    message: string
}

export const ChatMessage = (props: IChatMessage) => {
    if (props.type === 'user') {
        return (
            <div className="w-full place-items-end place-content-between mb-6">
                <div className="flex w-1/2">
                    <div className="p-4 bg-accent-foreground rounded-tl-md rounded-b-md">
                        <p className="text-background">{props.message}</p>
                    </div>
                    <Avatar className="w-12 h-12 ml-2">
                        <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                </div>
            </div>
        )
    }
    if (props.type === 'ia') {
        let iaContent;

        if (props.agentIA === 'gemini') {
            iaContent = <>
                <Gemini size={50} className="bg-white text-blue-600 mr-2 p-2 rounded-3xl border" />
                <div className="p-4 bg-accent-foreground rounded-tr-md rounded-b-md">
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        } 
        if (props.agentIA === 'grok') {
            iaContent = <>
                <Grok size={50} className="bg-gray-600 text-white mr-2 p-2 rounded-3xl border" />
                <div className="p-4 bg-accent-foreground rounded-tr-md rounded-b-md">
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }
        if (props.agentIA === 'deepseek') {
            iaContent = <>
                <DeepSeek size={50} className="bg-blue-600 text-white mr-2 p-2 rounded-3xl border" />
                <div className="p-4 bg-accent-foreground rounded-tr-md rounded-b-md">
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }
        if (props.agentIA === 'chat-gpt') {
            iaContent = <>
                <OpenAI size={50} className="bg-black text-white mr-2 p-2 rounded-3xl border" />
                <div className="p-4 bg-accent-foreground rounded-tr-md rounded-b-md">
                    <p className="text-background">{props.message}</p>
                </div>
            </>
        }

        return (
            <div className="w-full place-content-between mb-6">
                <div className="flex w-1/2">{iaContent}</div>
            </div>
        )
    }
}