import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { SendHorizontal } from "lucide-react";
import { DeepSeek, Gemini, Grok, OpenAI } from '@lobehub/icons';
import MainService, { IResponseApiAllIa } from '@/services/main.service';
import { ChatMessage, IChatMessage } from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import SecondaryLoader from './SecondaryLoader';
import { useAuth } from '@/hooks/useAuth';

export const ChatBody = () => {
  const [firstAccess, setFirstAccess] = useState<boolean>(true);
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  const { user } = useAuth();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);
  

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const mainService = new MainService();
      const responses = await mainService.askToAll(question);
      console.log('Respostas: ', responses?.data);
      insertMessagesChat(responses?.data, question)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setQuestion("");
      setFirstAccess(false);
      setLoading(false);
    }
  };

  const insertMessagesChat = (data: IResponseApiAllIa, userQuestion: string) => {
    const novasMensagens: IChatMessage[] = [
      { message: userQuestion, type: 'user' },
      { message: data['chat-gpt']?.response, type: 'ia', agentIA: 'chat-gpt' },
      { message: data.deepseek?.response, type: 'ia', agentIA: 'deepseek' },
      { message: data.gemini?.response, type: 'ia', agentIA: 'gemini' },
      { message: data.grok?.response, type: 'ia', agentIA: 'grok' }
    ];
    
    setMessages([...messages, ...novasMensagens]);
  }

  const verifyDayOrNight = () => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      return 'Bom dia'
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde'
    } else {
      return 'Boa noite'
    }
  }

  return (
    loading ? ( <> <SecondaryLoader /> </> ) :
    <section className="w-220 flex-col ">
      {
        firstAccess ?
        <div className='mt-[5%]'>
          <p className="text-4xl font-semibold tracking-tighter select-none">
            {`${verifyDayOrNight()}, ${user?.name.split(' ')[0]}.`}
          </p>
          <p className="text-4xl font-semibold tracking-tighter select-none">
            Faça sua pergunta e veja as IAs disputarem pelo seu voto!
          </p>
        </div> :
        <ScrollArea className="h-150 w-full rounded-md border p-5" ref={scrollAreaRef}>
          {messages.map((message) => (
            !message.agentIA ?
              <ChatMessage
                message={message.message}
                type={message.type}
              /> :
              <ChatMessage
                message={message.message}
                type={message.type}
                agentIA={message.agentIA}
              />
            ))}
        </ScrollArea>
      }

      <div className="w-220 h-40 bg-input rounded-md mt-6 px-2 py-3 relative">
        <textarea
          name="textareaQuestion"
          id="text-question"
          rows={3}
          placeholder="O que você quer saber?"
          autoFocus
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="px-2 w-full outline-none text-lg text-foreground resize-none"
        />

        <Button variant="outline" disabled className="cursor-pointer absolute left-2 bottom-2">
          <Paperclip className="h-[1.5rem] w-[1.5rem]" />
          <p>Anexar arquivo (em breve)</p>
        </Button>
        <Button
          variant="default"
          className="cursor-pointer absolute right-2 bottom-2"
          onClick={handleSend}
          disabled={loading || !question.trim()}
        >
          Enviar mensagem
          <SendHorizontal className="h-[1.5rem] w-[1.5rem]" />
        </Button>
      </div>
      {
        firstAccess && (
        <div className="w-220">
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border py-6">
            <span className="relative z-10 bg-background px-4 text-muted-foreground select-none">
              IA's competidoras
            </span>
          </div>

          <div className="w-full flex items-center justify-between">
            {[
              { icon: <OpenAI size={35} />, label: 'Chat GPT', sub: 'gpt-4o' },
              { icon: <DeepSeek size={35} />, label: 'Deepseek', sub: 'deepseek-reasoner' },
              { icon: <Gemini size={35} />, label: 'Gemini', sub: 'gemini-2.0-flash' },
              { icon: <Grok size={35} />, label: 'Grok', sub: 'grok-3-beta' },
            ].map((ia) => (
              <div key={ia.label} className="flex items-center space-x-4 rounded-md border p-4 select-none w-52">
                {ia.icon}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{ia.label}</p>
                  <p className="text-sm text-muted-foreground">{ia.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )
        
      }

    </section>
  );
};
