import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeepSeek, Gemini, Grok, OpenAI } from "@lobehub/icons";
import { Check } from "lucide-react";

interface DialogSelectIAProps {
  trigger: React.ReactNode;
  titleDialog: string;
}

export function DialogSelectIA({ trigger, titleDialog }: DialogSelectIAProps) {
  const [selectedIA, setSelectedIA] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const ias = [
    { icon: <OpenAI size={30} />, label: 'Chat GPT', sub: 'gpt-4o' },
    { icon: <DeepSeek size={30} />, label: 'Deepseek', sub: 'deepseek-chat' },
    { icon: <Gemini size={30} />, label: 'Gemini', sub: 'gemini-2.0-flash' },
    { icon: <Grok size={30} />, label: 'Grok', sub: 'grok-3-beta' },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSelectedIA(null);
        }
      }
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-4">{titleDialog}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          {ias.map((ia) => (
            <div
              key={ia.label}
              onClick={() => setSelectedIA(ia.label)}
              className={`
                flex 
                items-center 
                justify-between 
                space-x-4 
                rounded-lg 
                mb-4 
                border 
                p-4 
                transition duration-300 
                select-none 
                cursor-pointer 
                ${selectedIA === ia.label ? "border-blue-700 bg-accent-50" : "hover:border-blue-600"}
              `}
            >
              <div className="flex space-x-4 items-center">
                {ia.icon}
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">{ia.label}</p>
                  <p className="text-sm text-muted-foreground">{ia.sub}</p>
                </div>
              </div>
              {selectedIA === ia.label && <Check className="text-green-600" strokeWidth={5} />}
            </div>
          ))}
        </div>
        <Button
          disabled={!selectedIA}
          className="cursor-pointer p-6 mb-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Vamos lá!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
