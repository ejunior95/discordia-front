import { Button } from '@/components/ui/button'
import Discordia3dLogo from '../assets/discordia-logo-3D.png'
import { Link } from 'react-router-dom'
import { Navbar } from '@/custom-components/Navbar'

export default function Home() {
    return(
        <>
            <Navbar />
            <div className='w-full flex-col place-content-center justify-items-center'>
                <section className='w-full flex-col h-dvh place-content-center justify-items-center'>
                    <img src={Discordia3dLogo} alt='discordia-logo3d' className='w-1/4 -mt-20' />   
                    <div className='flex justify-center items-center text-8xl'>
                        <h1 className='font-extrabold tracking-tight'>
                            Discord
                        </h1>    
                        <h1 className='font-extrabold tracking-tight text-blue-500'>
                            I
                        </h1>    
                        <h1 className='font-extrabold tracking-tight text-amber-600'>
                            A
                        </h1>    
                    </div> 
                </section>
                <section className='w-1/2 h-dvh my-8'>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
                        Um chat conflituoso entre as principais IAs do mercado
                    </h2>
                    <p>
                        Prepare-se para uma experiência única de inteligência artificial! <br /> 
                        DiscordIA é a primeira arena digital onde múltiplas IAs competem em tempo real para entregar a melhor resposta possível.<br /> 
                        Cada pergunta gera uma batalha de mentes artificiais — você vê diferentes abordagens, interpretações e soluções, todas buscando sua atenção.
                    </p>
                    <br />
                    <p>
                        💡 Compare. Avalie. Escolha. O discordIA transforma a decisão final em algo estratégico e divertido.
                    </p>
                    <Link to="/chat">
                        <Button variant="default" className="cursor-pointer mb-8 text-2xl p-8 w-full my-8">Ok, vamos começar!</Button>
                    </Link>
                </section>
            </div>
        </>
    )
}