import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { formatFallbackAvatarStr } from "@/utils/globalFunctions";

export default function Settings() {
    const { user } = useAuth();

    return(
        <section className="
            p-10
            w-full 
            flex 
            flex-col 
            items-center
            2xl:h-[90dvh] 
        ">
            <h1 className="
                font-extrabold 
                tracking-tight 
                text-5xl 
                mb-5 
                md:text-6xl 
                md:mb-8 
                xl:text-7xl 
                xl:mb-8 
                2xl:mb-10
                w-full 
                lg:w-[80%]
                2xl:w-[60%] 
                2xl:max-w-[1200px]">
                Configurações
            </h1>
            <Tabs defaultValue="perfil" className="
                w-full 
                lg:w-[80%]
                2xl:w-[60%] 
                2xl:max-w-[1200px]">
              <TabsList className="w-full">
                <TabsTrigger value="perfil">Meu perfil</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                <TabsTrigger value="tab4">Tab 4</TabsTrigger>
              </TabsList>
              <TabsContent value="perfil">
                <Card>
                  <CardHeader>
                    <CardTitle className="select-none">Perfil</CardTitle>
                    <CardDescription className="select-none">
                      Atualize as informações básicas da sua conta e clique em salvar quando finalizar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex mb-5">
                        <Avatar className="h-30 w-30 mr-4 rounded-full">
                          <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover object-center" />
                          <AvatarFallback className="text-6xl">{formatFallbackAvatarStr(user!)}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-4">
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
                            Altere sua foto de perfil
                          </Label>
                          <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            className="hidden"
                          />
                        </div>
                        
                    </div>
                    <div className="space-y-1">
                      <Label className="my-3" htmlFor="name">Nome</Label>
                      <Input id="name" type="text" defaultValue={user?.name} />
                    </div>
                    <div className="space-y-1">
                      <Label className="my-3" htmlFor="name">Email</Label>
                      <Input id="name" type="email" defaultValue={user?.email} />
                    </div>
                    <div className="space-y-1">
                      <Label className="my-3" htmlFor="current">Senha atual</Label>
                      <Input id="current" defaultValue="" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label className="my-3" htmlFor="new">Nova senha</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full md:w-40 p-5 cursor-pointer select-none" disabled>Salvar</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="tab2">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="tab3">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="tab4">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
        </section>
    )
}