import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{!user && children}</>;
}

