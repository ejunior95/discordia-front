import { useState, useRef, useEffect, cloneElement } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Gamepad2, MicVocal, Swords } from 'lucide-react';
import Discordia3dLogo from '../assets/discordia-logo-3D.png'
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    id: 'questions',
    title: 'Chat conflituoso',
    desc: "Desafie as maiores IAs do mundo! ChatGPT, Gemini, DeepSeek e Grok competem pra te dar a melhor resposta, e você decide quem manda bem!",
    icon: <MessageSquare size={100} className="text-white" />,
    color: 'bg-indigo-500',
    bgImage: '/src/assets/questions-bg.jpeg',
    link: '/chat'
  },
  {
    id: 'games',
    title: 'Jogue com IA',
    desc: "Diversão sem limites! Jogue xadrez, jokenpô ou jogo da velha contra IAs ou veja elas se enfrentarem, quem vai ganhar essa?",
    icon: <Gamepad2 size={100} className="text-white" />,
    color: 'bg-red-500',
    bgImage: '/src/assets/games-bg.jpeg',
    link: '/games'
  },
  {
    id: 'rhyme',
    title: 'Batalha de Rima',
    desc: "Coloque as IAs pra rimar como nunca! Vote nas rimas mais pesadas e veja quem leva a melhor nesse duelo de criatividade!",
    icon: <MicVocal size={100} className="text-white" />,
    color: 'bg-green-500',
    bgImage: '/src/assets/rhyme-bg.jpg',
    link: '/rap-battle'
  },
  {
    id: 'rpg',
    title: 'RPG',
    desc: "Mergulhe em uma aventura épica! Enfrente desafios, crie a sua história ou viva momentos incríveis criados pelas IAs que te surpreendem a cada escolha!",
    icon: <Swords size={100} className="text-white" />,
    color: 'bg-amber-500',
    bgImage: '/src/assets/rpg-bg.png',
    link: '/rpg'
  },
];

const prices = [
  {
    name: 'Grátis',
    price: 'R$0,00/mês',
    perks: ['10 créditos/mês'],
  },
  {
    name: 'Basic',
    price: 'R$9,99/mês',
    perks: ['200 créditos/mês'],
  },
  {
    name: 'Premium',
    price: 'R$19,99/mês',
    perks: ['Créditos ilimitados', 'Acesso Beta'],
  },
];

export default function LandingPage() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<number>(0);
  const { user } = useAuth();

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
          <Link to={user ? '/home' : '/register'}>
            <Button className="2xl:py-8 2xl:w-[25vw] 2xl:rounded-4xl 2xl:text-2xl cursor-pointer">Começar agora</Button>
          </Link>
        </motion.div>
      </section>

      <section className="h-[100dvh] flex flex-col justify-center items-center text-black relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${features[active].bgImage})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={features[active].id}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </motion.div>
        
        <div className=" z-10 flex flex-col items-center max-w-4xl h-full w-full">
          <h2 className="text-4xl xl:text-4xl font-extrabold tracking-tight lg:text-5xl text-white w-full text-center mt-8">
            O que você pode fazer com o DiscordIA?
          </h2>
          <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {features.map((feat) => (
                <motion.div
                  key={feat.id}
                  className="flex-shrink-0 w-full 2xl:h-[90vh] xl:h-[82vh] h-dvh flex flex-col justify-evenly items-center p-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex flex-col items-center">
                    <div className={`p-8 ${feat.color} rounded-full mb-10 flex items-center justify-center`}>
                      {cloneElement(feat.icon, {
                        size: 100,
                        style: { width: '100px', height: '100px' },
                      })}
                    </div>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl text-white font-semibold tracking-tight first:mt-0">
                      {feat.title}
                    </h2>
                    <Link to={user ? feat.link : '/register'}>
                      <Button variant='outline' className="cursor-pointer 2xl:text-xl 2xl:p-8 2xl:mt-8 text-white p-4">Começar agora</Button>
                    </Link>
                  </div>
                    
                  <p className="text-xl text-center max-w-lg text-gray-200">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
              
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`h-3 w-3 rounded-full transition-colors cursor-pointer ${
                    idx === active ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:h-dvh justify-center items-center bg-gradient-to-bl from-black to-gray-900  bg-gray-50 px-6 text-center">
        <h2 className="text-4xl font-semibold mt-8 mb-12 lg:mt-8 ">Assine para aproveitar todos os serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 max-w-6xl w-full">
          {prices.map((plan) => (
            <motion.div
              key={plan.name}
              className="bg-white text-black h-[50vh] rounded-lg shadow-lg p-8 flex flex-col"
              whileHover={{ y: -20 }}
              transition={{ type: 'spring', stiffness: 150 }}
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
              <Button variant='secondary' className='cursor-pointer text-xl py-8'>Assinar agora</Button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
