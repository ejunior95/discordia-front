import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CurrentUser } from "@/contexts/AuthContext"
import { formatFallbackAvatarStr } from "@/utils/globalFunctions"
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons"
import IconVersus from "../assets/icon-versus.svg"

export interface ITagCurrentIA {
    ia: 'gemini' | 'grok' | 'deepseek' | 'chat-gpt'
    user: CurrentUser
}

export function TagCurrentIA(props: ITagCurrentIA) {
    const objIA = {
        gemini: {
            title: 'Gemini',
            sub: 'gemini-2.0-flash',
            icon: <Gemini size={35} />,
        },
        grok: {
            title: 'Grok',
            sub: 'grok-3-beta',
            icon: <Grok size={35} />,
        },
        deepseek: {
            title: 'Deepseek',
            sub: 'deepseek-reasoner',
            icon: <DeepSeek size={35} />,
        },
        'chat-gpt': {
            title: 'Chat GPT',
            sub: 'gpt-4o',
            icon: <OpenAI size={35} />,
        },
    }
    return(
        <div className="absolute w-full left-0 top-17 flex justify-center items-center">
            <div className="px-12 py-1 bg-gradient-to-t from-red-600 to-red-900 flex justify-between items-center text-white relative rounded-b-full">
                
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-right">{props.user?.name}</span>
                    <span className="truncate text-xs text-right">{props.user?.email}</span>
                  </div>
                  <Avatar className="h-9 w-9 rounded-full">
                    <AvatarImage src={props.user?.avatar} alt={props.user?.name} className="object-cover object-center" />
                    <AvatarFallback>{formatFallbackAvatarStr(props.user!)}</AvatarFallback>
                  </Avatar>
                </div>

                <img src={IconVersus} className="h-14 w-14" alt="VS" />

                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    { objIA[props.ia].icon }
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-left">{objIA[props.ia].title}</span>
                    <span className="truncate text-xs text-left">{ objIA[props.ia].sub }</span>
                  </div>
                </div>
                
                <div className="w-full flex justify-evenly items-center left-0 -bottom-3 absolute">
                  
                  <div className="flex space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-b from-gray-500 to-gray-800  border-zinc-100 border-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-gradient-to-b from-gray-500 to-gray-800  border-zinc-100 border-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-gradient-to-b from-gray-500 to-gray-800 border-zinc-100 border-1 rounded-full"></div>
                  </div>

                  <small className="py-1 px-2 bg-yellow-500 text-black rounded-xl text-sm font-medium leading-none">Round 1</small>

                  <div className="flex space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-b from-gray-500 to-gray-800 border-zinc-100 border-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-gradient-to-b from-gray-500 to-gray-800 border-zinc-100 border-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-gradient-to-b from-gray-500 to-gray-800 border-zinc-100 border-1 rounded-full"></div>
                  </div>
                  

                </div>

            </div>
          </div>
    )
}