import { ThemeProvider } from './components/theme-provider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from './custom-components/Loader';
import ProtectedRoute from './custom-components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import PublicRoute from './custom-components/PublicRoute';
import { Layout } from './custom-components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="discordia-theme-select">
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};
