import { Button } from '@/components/ui/button'
import Discordia3dLogo from '../assets/discordia-logo-3D.png'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <div className="flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-24">
                <section className="flex flex-col items-center justify-center h-screen text-center">
                    <img 
                      src={Discordia3dLogo} 
                      alt="discordia-logo3d" 
                      className="
                        w-[50vw] 
                        max-w-[300px] 
                        sm:max-w-[400px] 
                        md:max-w-[500px] 
                        lg:max-w-[500px] 
                        xl:max-w-[450px] 
                        2xl:max-w-[750px] 
                        mb-6 
                        lg:mb-0 
                        lg:-mt-40
                        xl:-mb-4 
                        xl:-mt-40
                        -mt-20"
                    />

                    <div className="flex text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-6xl 2xl:text-8xl font-extrabold tracking-tight">
                        <h1>Discord</h1>
                        <h1 className="text-blue-500 ml-1">I</h1>
                        <h1 className="text-amber-600 ml-1">A</h1>
                    </div>
                </section>

                <section className="w-full max-w-3xl py-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 border-b pb-2">
                        Um chat conflituoso entre as principais IAs do mercado
                    </h2>
                    <p className="text-base sm:text-lg leading-relaxed mb-6">
                        Prepare-se para uma experiência única de inteligência artificial! <br /> 
                        DiscordIA é a primeira arena digital onde múltiplas IAs competem em tempo real para entregar a melhor resposta possível. <br />
                        Cada pergunta gera uma batalha de mentes artificiais — você vê diferentes abordagens, interpretações e soluções, todas buscando sua atenção.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed mb-6">
                        💡 <strong>Compare. Avalie. Escolha.</strong> O DiscordIA transforma a decisão final em algo estratégico e divertido.
                    </p>
                    <Link to="/chat">
                        <Button className="text-lg sm:text-xl p-6 w-full cursor-pointer">
                            Ok, vamos começar!
                        </Button>
                    </Link>
                </section>
            </div>
        </>
    )
}
