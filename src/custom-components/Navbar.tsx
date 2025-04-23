import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "/discordia-logo.png"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { logout } from "@/services/auth.service"

export const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="p-4 flex w-full justify-between bg-background text-foreground">
      <Link to="/" className="flex gap-3">
        <img src={Logo} className="w-14" alt="logo-discordia" />
        <span className="text-2xl font-semibold tracking-tighter py-1 select-none">DiscordIA</span>
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
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>JR</AvatarFallback>
            </Avatar>
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
