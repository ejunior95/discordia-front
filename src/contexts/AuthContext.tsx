import { getUserInfo } from "@/services/auth.service";
import { createContext, useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
};

type AuthContextType = {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) setUser(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
