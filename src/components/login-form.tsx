import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { getUserInfo, login } from "@/services/auth.service"
import { useState } from "react"
import Loader from "@/custom-components/Loader"
import { toast } from "sonner"
import { Eye, EyeClosed } from "lucide-react"
import Logo from "../assets/discordia-logo-removebg2.png"
import { useAuth } from "@/hooks/useAuth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<string>('password');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
  
    const email = (e.currentTarget as any).email.value;
    const password = (e.currentTarget as any).password.value;
  
    try {
      await login(email, password);
      const user = await getUserInfo();
      setUser(user);
      navigate("/home");
    } catch (err: any) {
      console.error("Erro ao fazer login", err);
      toast("Erro ao fazer login", {
        description: String(err?.response?.data.message),
        // action: {
        //   label: "Detalhes",
        //   onClick: () => console.log("Undo"),
        // },
      })
    }
    setLoading(false);
  };

  const toggleVisiblePassword = () => {
    visiblePassword === 'password' ?
    setVisiblePassword('text') :
    setVisiblePassword('password')
  }

  return (
    loading ? ( <> <Loader /> </> ) :
    <>
      <div className="flex w-100 place-content-center justify-center">
        <img src={Logo} className="w-15 h-12" alt="logo-discordia" />
        <span className="text-2xl font-semibold tracking-tighter py-2 pl-2 select-none">DiscordIA</span>
      </div>
      <div className={cn("flex flex-col gap-6 w-100 mt-4", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Faça o login na sua conta</CardTitle>
            <CardDescription>
              Entre com seu email e senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input id="password" type={visiblePassword} name="password" className="pr-[2.5rem]" required />
                  <Button onClick={() => toggleVisiblePassword()} variant="link" size="icon" className="cursor-pointer absolute bottom-0 right-0">
                    {
                      visiblePassword === 'password' ? 
                      ( <> <EyeClosed className="h-[1.2rem] w-[1.2rem]" /> </> ) :
                      ( <> <Eye className="h-[1.2rem] w-[1.2rem]" /> </> )
                    }
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="cursor-pointer p-5 bg-green-600! text-white! font-semibold rounded-md shadow-md hover:bg-green-700! transition duration-300">
                    Continuar
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Ainda não tem uma conta?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Cadastre-se aqui
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
