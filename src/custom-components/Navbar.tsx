import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "/discordia-logo.png"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { 
  CreditCard, 
  LogOut, 
  Settings, 
  User, 
} from "lucide-react"
import { logout } from "@/services/auth.service"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  const formatFallbackAvatarStr = () => {
    const names = user?.name.split(' ')
    if(names) {
        if(names?.length === 1) {
            return names[0].slice(0,1)
        }
        return `${names[0].slice(0,1)}${names[names.length - 1].slice(0,1)}`
    }
    return '?'
  }

  return (
    <nav className="p-4 flex w-full justify-between bg-background text-foreground">
      <Link to="/" className="flex items-center gap-2 sm:gap-3">
        <img 
          src={Logo} 
          alt="logo-discordia" 
          className="
            w-12 
            sm:w-12 
            md:w-14 
            max-w-[3.5rem]
            transition-all
          " 
        />
        <span 
          className="
            hidden 
            sm:block 
            text-xl 
            md:text-2xl 
            font-semibold 
            tracking-tight 
            py-1 
            select-none
          "
        >
          DiscordIA
        </span>
      </Link>
      <div className="flex gap-4">
        <ModeToggle />
        {
          !user ? 
          <>
            <Link to="/register">
              <Button variant="outline" className="cursor-pointer">
                Cadastro
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="default" className="cursor-pointer">
                Fazer Login
              </Button>
            </Link>
          </>
          :
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer" title={user?.name}>
                  <AvatarImage src={user?.avatar} className="object-cover object-center" />
                  <AvatarFallback>{formatFallbackAvatarStr()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="select-none">{`Olá, ${user?.name.split(' ')[0]}!`}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User />
                    <span>Meu perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard />
                    <span>Assinatura</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={handleLogout} variant="outline" size="icon" title="Encerrar sessão" className="cursor-pointer">
              <LogOut  className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Encerrar sessão</span>
            </Button>
          </>
        }
      </div>
    </nav>
  )
}
