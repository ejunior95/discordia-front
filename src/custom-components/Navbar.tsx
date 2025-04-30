import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "/discordia-logo.png"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import {
  ChevronsUpDown,
  CreditCard, 
  LogOut, 
  Menu, 
  Settings,
  User, 
} from "lucide-react"
import { logout } from "@/services/auth.service"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
} from "@/components/ui/navigation-menu"
import { navigationItems } from "@/App"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatFallbackAvatarStr } from "@/utils/sharedFunctions"

export const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="p-4 flex w-full justify-between bg-background text-foreground">
      <Link to="/home" className="flex items-center gap-2 sm:gap-3">
        <img 
          src={Logo} 
          alt="logo-discordia" 
          className="w-12 sm:w-12 md:w-14 max-w-[3.5rem] transition-all" 
        />
        <span className="text-xl md:text-2xl font-semibold tracking-tight py-1 select-none">
          DiscordIA
        </span>
      </Link>

        {/* Exibição normal (Desktop) */}
        <div className="hidden lg:flex gap-4 justify-center items-center">
          <NavigationMenu>
            <NavigationMenuList  className="items-center flex justify-center gap-2 xl:gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link to={item.path}>
                    <NavigationMenuLink className="
                      rounded-md 
                      bg-background 
                      text-sm 
                      font-medium 
                      hover:bg-accent 
                      hover:text-accent-foreground 
                      focus:bg-accent 
                      focus:text-accent-foreground 
                      disabled:pointer-events-none 
                      disabled:opacity-50 
                      focus-visible:ring-ring/50 
                      outline-none 
                      transition-[color,box-shadow] 
                      focus-visible:ring-[3px] 
                      focus-visible:outline-1">
                      <div className="flex items-center justify-center gap-3">
                        {item.icon && <item.icon className="w-10 h-10" />}
                        <p>{item.label}</p>
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {
            !user ? 
            <>
            <ModeToggle />
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
                  <Avatar className="cursor-pointer border-2" title={user?.name}>
                    <AvatarImage src={user?.avatar} className="object-cover object-center" />
                    <AvatarFallback>{formatFallbackAvatarStr(user)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuUser />
              </DropdownMenu>

              <ModeToggle />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" title="Encerrar sessão" className="cursor-pointer">
                    <LogOut  className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Encerrar sessão</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja encerrar sua sessão? Todos os dados não salvos serão perdidos!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Não, vou continuar aqui</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="cursor-pointer">Sim, quero sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          }
        </div>

        {/* Exibição Mobile */}
        <div className="flex lg:hidden gap-4">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="cursor-pointer" 
                title="Temas" 
                onClick={() => setOpenSheet(!openSheet)}>
                <Menu className="w-10 h-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full h-dvh flex-col justify-between">
              <ScrollArea className="h-[80dvh] w-full overflow-auto mt-12">
                <div className="flex flex-col mt-1 items-center justify-center w-full gap-4 px-4">
                  {navigationItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      onClick={() => setOpenSheet(false)}
                      className="flex items-center mb-4 gap-6 text-xl rounded-lg font-medium w-[90dvw] p-8 border"
                    >
                      {item.icon && <item.icon className="w-8 h-8" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex m-6 p-6 border">
                    <Avatar className="h-10 w-10 mr-4 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover object-center" />
                      <AvatarFallback>{formatFallbackAvatarStr(user!)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="size-5 h-full" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuUser />
              </DropdownMenu>
            </SheetContent>
          </Sheet>
          <ModeToggle />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" title="Encerrar sessão" className="cursor-pointer">
                <LogOut  className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Encerrar sessão</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja encerrar sua sessão? Todos os dados não salvos serão perdidos!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Não, vou continuar aqui</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="cursor-pointer">Sim, quero sair</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
    </nav>
  )
  function DropdownMenuUser() {
    return(
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover object-center" />
              <AvatarFallback>{formatFallbackAvatarStr(user!)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to='/profile'>
            <DropdownMenuItem className="cursor-pointer">
              <User />
              <span>Meu perfil</span>
            </DropdownMenuItem>
          </Link>
          <Link to='/subscription'>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard />
              <span>Assinatura</span>
            </DropdownMenuItem>
          </Link>
          <Link to='/settings'>
            <DropdownMenuItem className="cursor-pointer">
              <Settings />
              <span>Configurações</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    )
  }
}

