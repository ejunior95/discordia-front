import { ThemeProvider } from './components/theme-provider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from './components/ui/sonner';
import { Layout } from './custom-components/Layout';
import Loader from './custom-components/Loader';
import ProtectedRoute from './custom-components/ProtectedRoute';
import PublicRoute from './custom-components/PublicRoute';
import { 
  Gamepad2, 
  House, 
  MessagesSquare, 
  MicVocal, 
  Swords 
} from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PageCreating = lazy(() => import('./pages/PageCreating'));
const Chat = lazy(() => import('./pages/Chat'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Games = lazy(() => import('./pages/Games'));
const RapBattle = lazy(() => import('./pages/RapBattle'));
const RolePlaying = lazy(() => import('./pages/RolePlaying'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Chess = lazy(() => import('./pages/Chess'));
const Jokenpo = lazy(() => import('./pages/Jokenpo'));
const Hangman = lazy(() => import('./pages/Hangman'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const navigationItems = [
  { label: 'Início', path: '/home', icon: House },
  { label: 'Chat', path: '/chat', icon: MessagesSquare },
  { label: 'Jogos', path: '/games', icon: Gamepad2 },
  { label: 'Batalha de rima', path: '/rap-battle', icon: MicVocal },
  { label: 'RPG', path: '/rpg', icon: Swords },
];

export default function App() {
  const flagPageIsCreating = import.meta.env.VITE_FLAG_ISWORKING;
  return (
    <ThemeProvider defaultTheme="system" storageKey="discordia-theme-select">
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<Layout />}>
              
              <Route path="/" element={  
                flagPageIsCreating === "true" ? 
                <PageCreating /> :
                <LandingPage /> 
              }/>

              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
 

              <Route path="/games" element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              } />

              <Route path="/games/chess" element={
                <ProtectedRoute>
                  <Chess />
                </ProtectedRoute>
              } />

              <Route path="/games/jokenpo" element={
                <ProtectedRoute>
                  <Jokenpo />
                </ProtectedRoute>
              } />
              
              <Route path="/games/hangman" element={
                <ProtectedRoute>
                  <Hangman />
                </ProtectedRoute>
              } />
 

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
 

              <Route path="/rap-battle" element={
                <ProtectedRoute>
                  <RapBattle />
                </ProtectedRoute>
              } />
 

              <Route path="/rpg" element={
                <ProtectedRoute>
                  <RolePlaying />
                </ProtectedRoute>
              } />
 

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/subscription" element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } />
 
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />

              <Route path="/login" element={
                flagPageIsCreating === "true" ? 
                <PageCreating /> :
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />

              <Route path="/register" element={
                flagPageIsCreating === "true" ? 
                <PageCreating /> :
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};
