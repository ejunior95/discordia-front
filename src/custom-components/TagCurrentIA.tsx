import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons"

export interface ITagCurrentIA {
    ia: 'gemini' | 'grok' | 'chat-gpt' | 'deepseek'
}

export function TagCurrentIA(props: ITagCurrentIA) {
    const objIA = {
        gemini: {
            title: 'Gemini',
            sub: 'gemini-2.0-flash',
            icon: <Gemini size={40} />,
            style: 'bg-white text-blue-600 border '
        },
        grok: {
            title: 'Grok',
            sub: 'grok-3-beta',
            icon: <Grok size={40} />,
            style: 'bg-gray-600 text-white '
        },
        deepseek: {
            title: 'Deepseek',
            sub: 'deepseek-reasoner',
            icon: <DeepSeek size={50} />,
            style: 'bg-blue-600 text-white '
        },
        'chat-gpt': {
            title: 'Chat GPT',
            sub: 'gpt-4o',
            icon: <OpenAI size={40} />,
            style: 'bg-black text-white-600 border-white'
        },
    }
    return(
        <div className={`${objIA[props.ia].style} md:space-x-2 md:p-4 md:w-[8dvw] md:justify-between flex justify-center items-center p-4 rounded-full`}>
            { objIA[props.ia].icon }
            <div className="hidden md:block md:space-y-1 md:w-[4dvw]">
                <p className="text-[12px] py-1 bg-red-600 w-[65%] flex justify-center rounded tracking-wide">CONTRA</p>
                <p className="text-lg font-medium leading-none">{objIA[props.ia].title}</p>
                <p className={`text-sm text-gray-300`}>{ objIA[props.ia].sub }</p>
            </div>
        </div>
    )
}