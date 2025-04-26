import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Gamepad2, MicVocal, Swords } from 'lucide-react';
import Discordia3dLogo from '../assets/discordia-logo-3D.png'

const features = [
  {
    id: 'questions',
    title: 'Batalha de Perguntas',
    desc: 'Veja ChatGPT, Gemini, DeepSeek e Grok disputarem para te dar a melhor resposta',
    icon: <MessageSquare size={100} className="text-indigo-500" />,
    bgImage: '/src/assets/questions-bg.jpg',
  },
  {
    id: 'games',
    title: 'Jogos de IA',
    desc: 'Xadrez, Jokenpô e Jogo da Velha: IA vs IA ou Você vs IA',
    icon: <Gamepad2 size={100} className="text-red-500" />,
    bgImage: '/src/assets/games-bg.jpg',
  },
  {
    id: 'rhyme',
    title: 'Batalha de Rima',
    desc: 'Competição de rimas entre IAs e você decide quem ganhou!',
    icon: <MicVocal size={100} className="text-green-500" />,
    bgImage: '/src/assets/rhyme-bg.jpg',
  },
  {
    id: 'rpg',
    title: 'RPG',
    desc: 'Uma aventura incrível e surpreendente',
    icon: <Swords size={100} className="text-amber-500" />,
    bgImage: '/src/assets/rpg-bg.jpg',
  },
];

const prices = [
  {
    name: 'Basic',
    price: 'R$9,99/mês',
    perks: ['100 perguntas/mês', 'Suporte Email'],
  },
  {
    name: 'Premium',
    price: 'R$19,99/mês',
    perks: ['Perguntas ilimitadas', 'Suporte 24/7', 'Acesso Beta'],
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="space-y-0">
      <section className="h-[100dvh] flex flex-col justify-center items-center bg-gradient-to-tr from-black to-gray-900 px-6 text-center">
        <motion.img 
          src={Discordia3dLogo} 
          alt='discordia-logo3d' 
          className='
            w-[50vw] 
            sm:w-[400px] 
            md:w-[500px] 
            lg:w-[500px] 
            xl:w-[350px] 
            2xl:w-[650px]'
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.h1
          className='flex text-5xl 2xl:-mt-10 sm:text-6xl md:text-7xl lg:text-8xl xl:text-6xl 2xl:text-8xl font-extrabold tracking-tight'
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            Discord
            <h1 className='text-blue-500 ml-1'>I</h1>
            <h1 className='text-amber-600 ml-1'>A</h1>
        </motion.h1>
        <motion.p
          className="max-w-2xl text-lg md:text-xl text-slate-300 mb-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Uma plataforma única onde as principais IA's do mercado competem, e VOCÊ escolhe a vencedora!
        </motion.p>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link to="/register">
            <Button className="2xl:py-8 2xl:w-[25vw] 2xl:rounded-4xl 2xl:text-2xl cursor-pointer">Começar agora</Button>
          </Link>
        </motion.div>
      </section>

      <section className="h-[100dvh] flex flex-col justify-center items-center text-black bg-white px-4">
        <h2 className="text-4xl font-semibold mb-6">O que você pode fazer com o DiscordIA?</h2>
        <div className="relative w-full max-w-4xl overflow-hidden">
          <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${active * 100}%)` }}>
            {features.map((feat) => (
              <motion.div
                key={feat.id}
                className="flex-shrink-0 w-full flex flex-col items-center p-8"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-6 bg-gray-100 rounded-full mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center w-full">{feat.title}</h3>
                <p className="text-center max-w-lg text-gray-600">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {features.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`h-3 w-3 rounded-full transition-colors ${idx === active ? 'bg-amber-500' : 'bg-gray-300'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <section className="h-[100dvh] flex flex-col justify-center items-center bg-gradient-to-bl from-black to-gray-900  bg-gray-50 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-8">Assine para aproveitar todos os serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
          {prices.map((plan) => (
            <motion.div
              key={plan.name}
              className="bg-white text-black rounded-xl shadow-lg p-8 flex flex-col"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-5xl font-extrabold mb-6">{plan.price}</p>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center">
                    <span className="mr-2 text-green-500">✔️</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Button variant='secondary' className='cursor-pointer'>Assinar agora</Button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
