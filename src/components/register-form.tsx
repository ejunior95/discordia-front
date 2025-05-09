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
import Logo from "../assets/discordia-logo-removebg2.png"
import Loader from "@/custom-components/Loader"
import { useState } from "react"
import { toast } from "sonner"
import { Eye, EyeClosed, ImagePlus } from "lucide-react"
import UserService from "@/services/user.service"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<string>('text');
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState<string>('text');
  const [previewAvatar, setPreviewAvatar] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
  
    const form = e.currentTarget as any;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form['confirm-password'].value
    const avatar = form.avatar.files?.[0];

    if(password !== confirmPassword) {
      toast("Erro ao fazer o cadastro!", {
        description: 'As senhas não conferem',
      });
      setLoading(false)
      return
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar);
    }
  
    const userService = new UserService();
  
    await userService.create(formData)
      .then(() => {
        toast("Usuário criado com sucesso!", {
          description: 'Email de confirmação enviado',
        });
      }).catch((error) => {
        console.error("Erro ao fazer cadastro", error);
        toast("Não foi possível criar usuário", {
          description: String(error?.response?.data.message),
          // action: {
          //   label: "Detalhes",
          //   onClick: () => console.log("Undo"),
          // },
        });
      }).finally(() => {
        navigate("/login");
        setLoading(false);
      });
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
                    <Label
                      htmlFor="avatar"
                      className="
                          cursor-pointer 
                          inline-flex 
                          items-center 
                          justify-center 
                          p-3
                          bg-blue-600 
                          text-white 
                          font-semibold 
                          rounded-md
                          shadow-md 
                          hover:bg-blue-900 
                          transition duration-300"
                    >
                            <ImagePlus />
                            Escolha sua foto de perfil
                          </Label>
                          <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
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
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type={visiblePassword}
                    onKeyDown={() => setVisiblePassword('password')}
                    name="password"
                    className="pr-[2.5rem]"
                    required
                  />
                  <Button
                    onClick={() => toggleVisiblePassword('pass')}
                    variant="link"
                    size="icon"
                    type="button"
                    className="cursor-pointer absolute bottom-0 right-0"
                  >
                    {visiblePassword === 'password' ? (
                      <EyeClosed className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <Eye className="h-[1.2rem] w-[1.2rem]" />
                    )}
                  </Button>
                </div>
                <div className="grid gap-3 mb-2 relative">
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <Input
                    id="confirm-password"
                    type={visibleConfirmPassword}
                    onKeyDown={() => setVisibleConfirmPassword('password')}
                    className="pr-[2.5rem]"
                    required
                  />
                  <Button
                    onClick={() => toggleVisiblePassword('confirm-pass')}
                    variant="link"
                    size="icon"
                    type="button"
                    className="cursor-pointer absolute bottom-0 right-0"
                  >
                    {visibleConfirmPassword === 'password' ? (
                      <EyeClosed className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <Eye className="h-[1.2rem] w-[1.2rem]" />
                    )}
                  </Button>
                </div>                
                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="
                      cursor-pointer 
                      p-5 
                      bg-green-600! 
                      text-white! 
                      font-semibold 
                      rounded-md 
                      shadow-md 
                      hover:bg-green-700! 
                      transition 
                      duration-300">
                    Continuar
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
