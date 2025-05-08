import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CurrentUser } from "@/contexts/AuthContext"
import { formatFallbackAvatarStr } from "@/utils/globalFunctions"
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons"
import IconVersus from "../assets/icon-versus.svg"

export interface ITagCurrentIA {
    ia: 'gemini' | 'grok' | 'chat-gpt' | 'deepseek'
    user: CurrentUser
}

export function TagCurrentIA(props: ITagCurrentIA) {
    const objIA = {
        gemini: {
            title: 'Gemini',
            sub: 'gemini-2.0-flash',
            icon: <Gemini size={40} />,
        },
        grok: {
            title: 'Grok',
            sub: 'grok-3-beta',
            icon: <Grok size={40} />,
        },
        deepseek: {
            title: 'Deepseek',
            sub: 'deepseek-reasoner',
            icon: <DeepSeek size={50} />,
        },
        'chat-gpt': {
            title: 'Chat GPT',
            sub: 'gpt-4o',
            icon: <OpenAI size={40} />,
        },
    }
    return(
        <div className="absolute w-full left-0 top-20 flex justify-center items-center">
            <div className="px-6 bg-blue-500 flex justify-between items-center rounded-b-lg">
                
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-12 w-12 rounded-full">
                    <AvatarImage src={props.user?.avatar} alt={props.user?.name} className="object-cover object-center" />
                    <AvatarFallback>{formatFallbackAvatarStr(props.user!)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{props.user?.name}</span>
                    <span className="truncate text-xs">{props.user?.email}</span>
                  </div>
                </div>

                <img src={IconVersus} className="h-12 w-12" alt="VS" />

                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-right">{objIA[props.ia].title}</span>
                    <span className="truncate text-xs text-right">{ objIA[props.ia].sub }</span>
                  </div>
                    { objIA[props.ia].icon }
                </div>

            </div>
          </div>
    )
}