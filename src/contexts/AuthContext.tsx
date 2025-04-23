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
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) setUser(data);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
