import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "./Loader";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{!user && children}</>;
}

