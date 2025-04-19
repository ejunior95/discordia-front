import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Paperclip, SendHorizontal } from "lucide-react"
import { DeepSeek, Gemini, Grok, OpenAI } from '@lobehub/icons';

export const ChatBody = () => {

    return(
        <section className="w-210 pb-32">
                <p className="text-4xl font-semibold tracking-tighter select-none">Boa tarde, Junior.</p>
                <p className="text-4xl font-semibold tracking-tighter select-none"> Faça sua pergunta e veja as IAs disputarem pelo seu voto!</p>
                <div className="w-210 h-38 bg-secondary rounded-md mt-6 px-2 py-3 relative">
                    <textarea 
                        name="textareaQuestion" 
                        id="text-question" 
                        rows={3}
                        placeholder="O que você quer saber?" 
                        autoFocus
                        className="px-2 w-full outline-0 text-lg text-foreground resize-none" 
                    />
                  <Button variant="outline" disabled className="cursor-pointer absolute left-2 bottom-2">
                    <Paperclip className="h-[1.5rem] w-[1.5rem]" />
                    <p>Anexar arquivo (em breve)</p>
                  </Button>
                  <BtnEnviarComTooltip />
                </div>
                <div className="w-210 h-12">
                  
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border py-6">
                    <span className="relative z-10 bg-background px-4 text-muted-foreground select-none">
                      IA's competidoras
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between">

                    <div className="flex items-center space-x-4 rounded-md border p-4 select-none w-48">
                      <OpenAI size={35} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Chat GPT</p>
                        <p className="text-sm text-muted-foreground">gpt-4o</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 rounded-md border p-4 select-none w-48">
                      <DeepSeek size={35} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Deepseek</p>
                        <p className="text-sm text-muted-foreground">deepseek-chat</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 rounded-md border p-4 select-none w-48">
                      <Gemini size={35} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Gemini</p>
                        <p className="text-sm text-muted-foreground">gemini-2.0-flash</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 rounded-md border p-4 select-none w-48">
                      <Grok size={35} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Grok</p>
                        <p className="text-sm text-muted-foreground">grok-3-beta</p>
                      </div>
                    </div>

                  </div>
                </div>
        </section>
    )
}

export function BtnEnviarComTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
            <Button variant="outline" size="icon" className="cursor-pointer absolute right-2 bottom-2">
                <SendHorizontal className="h-[1.5rem] w-[1.5rem]" />
            </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enviar mensagem</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
