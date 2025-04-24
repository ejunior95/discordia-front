import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loaderMessages = [
  "As IAs estão pensando...",
  "Consultando o oráculo digital...",
  "Aquecendo os motores inteligentes...",
  "Calculando respostas brilhantes...",
  "Comparando sinapses artificiais...",
  "Disputando sua atenção...",
  "Inteligência em ebulição...",
  "Decifrando padrões cósmicos...",
  "Trocando ideias entre chips...",
  "Recarregando neurônios sintéticos...",
  "Puxando sabedoria da nuvem...",
  "Sincronizando mentes artificiais...",
  "Esquentando os algoritmos...",
  "Colocando bits em ordem...",
  "Gerando genialidade em tempo real...",
  "Fazendo contas que humanos evitam...",
  "Discutindo quem responde melhor...",
  "Injetando criatividade nos circuitos...",
  "Coletando dados do multiverso...",
  "Destilando conhecimento puro...",
  "Digitando com dedos imaginários...",
  "Derrapando nos fios da sabedoria...",
  "Caçando insights nos dados...",
  "Raciocinando na velocidade da luz...",
  "Conectando com a mente universal...",
  "Misturando lógica com poesia...",
  "Pescando respostas no mar binário...",
  "Fazendo mágica com matemática...",
  "Consultando o mestre dos algoritmos...",
  "Reunindo conselhos intergalácticos...",
  "Traduzindo bits em sabedoria humana...",
  "Cozinhando ideias em alta voltagem...",
  "Buscando sentido na matrix...",
  "Ligando o modo gênio...",
  "A inteligência está quase pronta..."
];

const SecondaryLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loaderMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[80vh] flex-col place-content-center justify-items-center space-y-4">

        <div className="flex items-center justify-center h-40">
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <motion.div
              className="absolute w-16 h-16 rounded-full bg-foreground/30 blur-xl z-0"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            <Brain size={60} className="text-primary relative z-10" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={loaderMessages[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-xl text-muted-foreground text-center max-w-md"
          >
            {loaderMessages[index]}
          </motion.p>
        </AnimatePresence>
    </div>
  );
};

export default SecondaryLoader;
