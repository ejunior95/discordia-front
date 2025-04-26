import { ThemeProvider } from './components/theme-provider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from './components/ui/sonner';
import { Layout } from './custom-components/Layout';
import Loader from './custom-components/Loader';
import ProtectedRoute from './custom-components/ProtectedRoute';
import PublicRoute from './custom-components/PublicRoute';

const Home = lazy(() => import('./pages/Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
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
              
              <Route path="/" element={<LandingPage />}/>

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
