import { LoginForm } from "@/components/login-form";
import Logo from "../assets/discordia-logo-removebg2.png"

export default function Login() {
    return(
        <div className='w-full h-dvh flex-col place-content-center justify-items-center'>
            <div className="flex w-100 place-content-center justify-center">
                <img src={Logo} className="w-15 h-12" alt="logo-discordia" />
                <span className="text-2xl font-semibold tracking-tighter py-2 pl-2 select-none">DiscordIA</span>
            </div>
            <LoginForm />
        </div>
    )
}