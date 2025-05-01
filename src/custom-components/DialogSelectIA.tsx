import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons";

interface DialogSelectIAProps {
  trigger: React.ReactNode
  titleDialog: string
}

export function DialogSelectIA({ trigger, titleDialog }: DialogSelectIAProps) {
  return (
    <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-4">{titleDialog}</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {[
              { icon: <OpenAI size={30} />, label: 'Chat GPT', sub: 'gpt-4o' },
              { icon: <DeepSeek size={30} />, label: 'Deepseek', sub: 'deepseek-chat' },
              { icon: <Gemini size={30} />, label: 'Gemini', sub: 'gemini-2.0-flash' },
              { icon: <Grok size={30} />, label: 'Grok', sub: 'grok-3-beta' },
            ].map((ia) => (
              <div key={ia.label} className="
                  flex 
                  items-center 
                  space-x-4 
                  rounded-lg 
                  mb-4 
                  border 
                  p-4 
                  hover:border-blue-600 
                  transition 
                  duration-300
                  select-none 
                  cursor-pointer 
              ">
                {ia.icon}
                <div className="flex-col space-x-2  hover:border-blue-700 transition duration-300">
                  <p className="text-sm font-medium leading-none text-left">{ia.label}</p>
                  <p className="text-sm text-muted-foreground text-left">{ia.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
    </Dialog>
  );
}
