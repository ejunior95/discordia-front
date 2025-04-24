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
import { Link } from "react-router-dom"
import Logo from "../assets/discordia-logo-removebg2.png"
import Loader from "@/custom-components/Loader"
import { useState } from "react"
import { toast } from "sonner"
import { Eye, EyeClosed } from "lucide-react"
import UserService from "@/services/user.service"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ICreateUser } from "@/interfaces/user"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<string>('password');
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState<string>('password');
  const [previewAvatar, setPreviewAvatar] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const name = (e.currentTarget as any).name.value;
    const email = (e.currentTarget as any).email.value;
    const password = (e.currentTarget as any).password.value;

    const payload: ICreateUser = { name, email, password }
    
    const userService = new UserService();
    await userService.create(payload)
    .then((success) => {
      toast("Usuário criado com sucesso!", {
        description: 'Email de confirmação enviado',
      })
    }).catch((error) => {
      console.error("Erro ao fazer login", error);
      toast("Não foi possível criar usuário", {
        description: String(error?.response?.data.message),
        action: {
          label: "Detalhes",
          onClick: () => console.log("Undo"),
        },
      })
    })
  
    setLoading(false);
  };

  const toggleVisiblePassword = (type: 'pass' | 'confirm-pass') => {
    if (type === 'pass') {
      visiblePassword === 'password' ?
      setVisiblePassword('text') :
      setVisiblePassword('password')
    } else {
      visibleConfirmPassword === 'password' ?
      setVisibleConfirmPassword('text') :
      setVisibleConfirmPassword('password')
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewAvatar(imageUrl);
    }
  };

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
            <CardTitle className="text-lg">Crie sua conta agora</CardTitle>
            <CardDescription>
              Entre com seu email e senha para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Seu nome</Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="Seu nome completo aqui"
                    required
                  />
                </div>
                <div className="flex w-full place-content-between items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={previewAvatar} className="object-cover object-center" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                  <div className="grid gap-3 w-[82%]">
                    <Label htmlFor="email">Selecione sua foto de perfil</Label>
                    <Input onChange={handleAvatarChange} id="avatar" name="avatar" type="file" className="cursor-pointer" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input id="password" type={visiblePassword} name="password" className="pr-[2.5rem]" required />
                  <Button onClick={() => toggleVisiblePassword('pass')} variant="link" size="icon" type="button" className="cursor-pointer absolute bottom-0 right-0">
                    {
                      visiblePassword === 'password' ? 
                      ( <> <EyeClosed className="h-[1.2rem] w-[1.2rem]" /> </> ) :
                      ( <> <Eye className="h-[1.2rem] w-[1.2rem]" /> </> )
                    }
                  </Button>
                </div>
                <div className="grid gap-3 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirmar senha</Label>
                  </div>
                  <Input id="confirm-password" type={visibleConfirmPassword} className="pr-[2.5rem]" required />
                  <Button onClick={() => toggleVisiblePassword('confirm-pass')} variant="link" size="icon" type="button" className="cursor-pointer absolute bottom-0 right-0">
                    {
                      visibleConfirmPassword === 'password' ? 
                      ( <> <EyeClosed className="h-[1.2rem] w-[1.2rem]" /> </> ) :
                      ( <> <Eye className="h-[1.2rem] w-[1.2rem]" /> </> )
                    }
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full cursor-pointer">
                    Cadastrar
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Faça o login aqui
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
