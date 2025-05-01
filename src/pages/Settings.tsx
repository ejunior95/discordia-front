import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/custom-components/Loader";
import { useAuth } from "@/hooks/useAuth";
import UserService from "@/services/user.service";
import { formatFallbackAvatarStr } from "@/utils/globalFunctions";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [previewAvatar, setPreviewAvatar] = useState<string>(
      user?.avatar ? user?.avatar : ''
    );
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [visiblePassword, setVisiblePassword] = useState<string>('text');
    const [visibleNewPassword, setVisibleNewPassword] = useState<string>('text');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
    
      if (!user) {
        toast("Erro", { description: "Usuário não autenticado!" });
        setLoading(false);
        return;
      }
    
      const formData = new FormData();
    
      if (name !== user.name) {
        formData.append("name", name);
      }
      if (email !== user.email) {
        formData.append("email", email);
      }
      if (newPassword.length > 0) {
        formData.append("password", newPassword);
      }
      if (password.length > 0) {
        formData.append("currentPassword", password);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
    
      const userService = new UserService();
    
      try {
        await userService.update(user.id, formData);
        toast("Alterações salvas com sucesso!");
      } catch (error: any) {
        toast("Erro ao salvar alterações", {
          description: String(error?.response?.data?.message || 'Erro desconhecido'),
        });
      }
      setVisiblePassword('text')
      setVisibleNewPassword('text')
      setLoading(false);
    };

    const toggleVisiblePassword = (type: 'pass' | 'new-pass') => {
      if (type === 'pass') {
        visiblePassword === 'password' ?
        setVisiblePassword('text') :
        setVisiblePassword('password')
      } else {
        visibleNewPassword === 'password' ?
        setVisibleNewPassword('text') :
        setVisibleNewPassword('password')
      }
    }
    
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewAvatar(imageUrl);
      }
    };
    
    const verifyChangesForm = () => {
      return (
        name !== user?.name ||
        email !== user?.email ||
        password.length > 0 ||
        newPassword.length > 0 ||
        previewAvatar !== (user?.avatar || '')
      );
    }

    return(
      loading ? ( <> <Loader /> </> ) :
      <>
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
                    <form onSubmit={handleSubmit} autoComplete="false">
                      <div className="flex mb-5">
                        <Avatar className="h-30 w-30 mr-4 rounded-full">
                          <AvatarImage
                            src={previewAvatar}
                            alt={user?.name}
                            className="object-cover object-center"
                          />
                          <AvatarFallback className="text-6xl">
                            {formatFallbackAvatarStr(user!)}
                          </AvatarFallback>
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
                            onChange={handleAvatarChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="my-3" htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="my-3" htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 relative">
                        <Label className="my-3" htmlFor="current">Senha atual</Label>
                        <Input
                          id="current"
                          type={visiblePassword}
                          onKeyDown={() => setVisiblePassword('password')}
                          onChange={(e) => setPassword(e.target.value)}
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
                      <div className="space-y-1 relative">
                        <Label className="my-3" htmlFor="new">Nova senha</Label>
                        <Input
                          id="new"
                          type={visibleNewPassword}
                          onKeyDown={() => setVisibleNewPassword('password')}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                          onClick={() => toggleVisiblePassword('new-pass')}
                          variant="link"
                          size="icon"
                          type="button"
                          className="cursor-pointer absolute bottom-0 right-0"
                        >
                          {visibleNewPassword === 'password' ? (
                            <EyeClosed className="h-[1.2rem] w-[1.2rem]" />
                          ) : (
                            <Eye className="h-[1.2rem] w-[1.2rem]" />
                          )}
                        </Button>
                      </div>

                      <CardFooter className="px-0 mt-4">
                        <Button
                          type="submit"
                          className="w-full md:w-40 p-5 cursor-pointer select-none"
                          disabled={!verifyChangesForm()}
                        >
                          Salvar
                        </Button>
                      </CardFooter>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </section>
      </>
    )
}