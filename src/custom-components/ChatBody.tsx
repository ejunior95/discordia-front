import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { SendHorizontal } from "lucide-react";
import { DeepSeek, Gemini, Grok, OpenAI } from '@lobehub/icons';
import MainService, { IResponseApiAllIa } from '@/services/main.service';
import { ChatMessage, IChatMessage } from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import SecondaryLoader from './SecondaryLoader';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatBody = () => {
  const [firstAccess, setFirstAccess] = useState<boolean>(true);
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IChatMessage[]>([]);

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

  return (
    loading ? ( <> <SecondaryLoader /> </> ) :
    <section className="
      flex 
      flex-col 
      items-center 
      w-full 
      max-w-4xl 
      mx-auto 
      lg:h-[80vh] 
      px-4 
      md:px-8">
      <AnimatePresence mode="wait">
        {firstAccess ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col justify-center text-center space-y-4"
          >
            <p className="text-2xl sm:text-3xl font-semibold w-full text-left">
              Faça sua pergunta e veja as IAs disputarem pelo seu voto!
            </p>
            <div className="w-full h-[30vh] 2xl:h-[20vh] bg-input rounded-lg p-3 relative flex flex-col">
              <textarea
                rows={2}
                placeholder="O que você quer saber?"
                autoFocus
                maxLength={150}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="flex-1 w-full resize-none px-2 py-1 text-lg outline-none"
              />
              {
                question.length !== 150 ?
                <p className="
                  text-sm 
                  text-muted-foreground 
                  opacity-60 
                  absolute 
                  right-3 
                  select-none
                  bottom-[6dvh]
                  xl:bottom-[10dvh] 
                  2xl:bottom-[6dvh]
                  "
                >
                  Limite de caracteres ({150 - question.length})
                </p> :
                <p className="
                  text-sm
                  text-red-600 
                   absolute 
                   right-3 
                   bottom-[6.2dvh] 
                   select-none"
                >
                  Limite de caracteres atingido!
                </p>
              }              
              <div className="mt-2 flex justify-between">
                <Button variant="outline" disabled className='cursor-pointer select-none'>
                  <Paperclip className="h-6 w-6" />
                  <p className='hidden sm:block '>
                    Anexar arquivo (em breve)
                  </p>
                </Button>
                <Button
                  variant="default"
                  onClick={handleSend}
                  disabled={loading || !question.trim()}
                  className='cursor-pointer select-none'
                >
                  <p className='hidden sm:block '>
                    Enviar mensagem
                  </p>
                  <SendHorizontal className="h-6 w-6 ml-2" />
                </Button>
              </div>
            </div>
            <div className="w-full">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mb-4">
                <span className="relative z-10 bg-background px-4 text-muted-foreground select-none">
                  IA's competidoras
                </span>
              </div>

              <div className="w-full flex items-center justify-between">
                {[
                  { icon: <OpenAI size={30} />, label: 'Chat GPT', sub: 'gpt-4o' },
                  { icon: <DeepSeek size={30} />, label: 'Deepseek', sub: 'deepseek-reasoner' },
                  { icon: <Gemini size={30} />, label: 'Gemini', sub: 'gemini-2.0-flash' },
                  { icon: <Grok size={30} />, label: 'Grok', sub: 'grok-3-beta' },
                ].map((ia) => (
                  <div key={ia.label} className="flex items-center space-x-4 rounded-md border p-4 select-none ">
                    {ia.icon}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-left">{ia.label}</p>
                      <p className="text-sm text-muted-foreground text-left">{ia.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full"
          >
            <h1 className="
                font-extrabold 
                tracking-tight 
                text-5xl 
                mb-5 
                md:text-6xl 
                md:mb-8 
                xl:text-7xl 
                w-full 
                lg:w-[80%]
                2xl:max-w-[1200px]">
                Chat com as IAs
            </h1>
            <ScrollArea
              ref={scrollAreaRef}
              className="
                w-full 
                h-[60vh]
                md:h-[55vh] 
                border 
                rounded-md 
                p-4 
                mb-4"
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} {...msg} />
              ))}
              <p className='absolute -bottom-3 text-sm md:-top-8 right-0'>Interações restantes 10</p>
            </ScrollArea>
              
            <div className="w-full h-[20vh] bg-input rounded-lg p-3 relative flex flex-col">
              <textarea
                rows={2}
                placeholder="O que você quer saber?"
                autoFocus
                value={question}
                maxLength={150}
                onChange={e => setQuestion(e.target.value)}
                className="flex-1 w-full resize-none px-2 py-1 text-lg outline-none"
              />
              {
                question.length !== 150 ?
                <p className="
                  text-sm 
                  text-muted-foreground 
                  opacity-60 
                  absolute 
                  right-3 
                  bottom-[6.2dvh] 
                  select-none"
                >
                  Limite de caracteres ({150 - question.length})
                </p> :
                <p className="
                  text-sm
                  text-red-600 
                   absolute 
                   right-3 
                   bottom-[6.2dvh] 
                   select-none"
                >
                  Limite de caracteres atingido!
                </p>
              }        

              <div className="mt-2 flex justify-between">
                <Button variant="outline" disabled>
                  <Paperclip className="h-6 w-6" />
                  <p className='hidden sm:block '>
                    Anexar arquivo (em breve)
                  </p>
                </Button>
                <Button
                  variant="default"
                  onClick={handleSend}
                  disabled={loading || !question.trim()}
                >
                  <p className='hidden sm:block '>
                    Enviar mensagem
                  </p>
                  <SendHorizontal className="h-6 w-6 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
