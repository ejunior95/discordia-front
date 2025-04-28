import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { JSX } from "react/jsx-runtime";
import Loader from "./Loader";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
