import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "/discordia-logo.png"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
import { navigationItems, filterNavigationByCapabilities } from "@/config/navigation"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatFallbackAvatarStr } from "@/utils/globalFunctions"
import { CreditsBadge } from "@/custom-components/CreditsBadge"

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [openSheet, setOpenSheet] = useState(false);

  const visibleNavItems = useMemo(() => {
    if (!user) return navigationItems;
    if (user.role === 'admin' || user.role === 'beta_tester') return navigationItems;
    const caps = user.plan?.capabilities ?? [];
    return filterNavigationByCapabilities(navigationItems, caps);
  }, [user]);

  useEffect(() => {
    setOpenSheet(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="p-4 flex w-full justify-between bg-background text-foreground relative z-50">
        <Link to="/home" className="flex items-center gap-2 sm:gap-3">
          <img 
            src={Logo} 
            alt="logo-discordia" 
            className="w-12 max-w-14 transition-all sm:w-12 md:w-14" 
          />
          <span className="text-xl md:text-2xl font-semibold tracking-tight py-1 select-none">
            DiscordIA
          </span>
        </Link>

          {/* Exibição normal (Desktop) */}
          <div className="hidden lg:flex gap-4 justify-center items-center">
            <NavigationMenu>
              <NavigationMenuList  className="items-center flex justify-center gap-2 xl:gap-4">
                {visibleNavItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink asChild className="
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
                      <Link to={item.path}>
                        <div className="flex items-center justify-center gap-3">
                          {item.icon && <item.icon className="w-10 h-10" />}
                          <p>{item.label}</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
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
                
                <CreditsBadge />
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
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:hidden">
            {user && <CreditsBadge />}
            <Sheet 
              open={openSheet} 
              onOpenChange={setOpenSheet}
            >
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="cursor-pointer" 
                  title="Abrir menu">
                  <Menu className="w-10 h-10" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="flex w-full max-w-full flex-col gap-0 p-0">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <SheetDescription className="sr-only">Menu de navegação mobile</SheetDescription>
                <div className="border-b px-4 py-4 pr-12">
                  <div className="flex items-center gap-3">
                    <img
                      src={Logo}
                      alt="logo-discordia"
                      className="h-10 w-10 object-contain"
                    />
                    <span className="text-lg font-semibold tracking-tight">DiscordIA</span>
                  </div>
                </div>
                <ScrollArea className="max-h-[calc(100dvh-11rem)] overflow-auto px-4 py-4">
                  <div className="mx-auto min-h-dvh flex w-full max-w-md flex-col justify-evenly gap-2">
                    {visibleNavItems.map((item) => (
                      <Link 
                        key={item.path} 
                        to={item.path} 
                        onClick={() => setOpenSheet(false)}
                        className="flex w-full min-w-0 items-center gap-6 rounded-lg border px-4 py-6 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.icon && <item.icon className="h-8 w-8 shrink-0" />}
                        <span className="min-w-0 truncate text-xl">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="mx-auto flex w-full max-w-md min-w-0 items-center rounded-lg border p-4 text-left">
                          <Avatar className="mr-3 h-10 w-10 shrink-0 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} className="object-cover object-center" />
                            <AvatarFallback>{formatFallbackAvatarStr(user)}</AvatarFallback>
                          </Avatar>
                          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                          </div>
                          <ChevronsUpDown className="ml-3 size-5 shrink-0" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuUser onNavigate={() => setOpenSheet(false)} />
                    </DropdownMenu>
                  ) : (
                    <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                      <Link to="/register" onClick={() => setOpenSheet(false)}>
                        <Button variant="outline" className="w-full cursor-pointer">
                          Cadastro
                        </Button>
                      </Link>
                      <Link to="/login" onClick={() => setOpenSheet(false)}>
                        <Button variant="default" className="w-full cursor-pointer">
                          Fazer Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <ModeToggle />

            {user ? (
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
            ) : null}
          </div>
      </nav>
    </>
  )

  function DropdownMenuUser({ onNavigate }: { onNavigate?: () => void } = {}) {
    return(
      <DropdownMenuContent className="w-56" align="end">
        {user ? (
          <>
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} className="object-cover object-center" />
                <AvatarFallback>{formatFallbackAvatarStr(user)}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to='/profile' onClick={onNavigate}>
                <DropdownMenuItem className="cursor-pointer">
                  <User />
                  <span>Meu perfil</span>
                </DropdownMenuItem>
              </Link>
              <Link to='/subscription' onClick={onNavigate}>
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard />
                  <span>Assinatura</span>
                </DropdownMenuItem>
              </Link>
              <Link to='/settings' onClick={onNavigate}>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings />
                  <span>Configurações</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    )
  }
}

