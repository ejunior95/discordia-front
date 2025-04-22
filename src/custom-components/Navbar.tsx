// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "/discordia-logo.png"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
// import { LogOut } from "lucide-react"

export const Navbar = () => {
  return (
    <nav className="p-4 flex w-full justify-between bg-background text-foreground">
        <Link to="/" className="flex gap-3">
          <img src={Logo} className="w-14" alt="logo-discordia" />
          <span className="text-2xl font-semibold tracking-tighter py-1 select-none">DiscordIA</span>
        </Link>
        <div className="flex gap-4">
          <ModeToggle />
          <Link to="/register">
            <Button variant="outline" className="cursor-pointer">
              Cadastro
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="default" className="cursor-pointer">
              Fazer login
            </Button>
          </Link>
          {/* <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" className="cursor-pointer">
            <LogOut  className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Fazer logout</span>
          </Button> */}
        </div>
    </nav>
  )
}
