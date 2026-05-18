import { ThemeProvider } from './components/theme-provider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from './components/ui/sonner';
import { Layout } from './custom-components/Layout';
import Loader from './custom-components/Loader';
import ProtectedRoute from './custom-components/ProtectedRoute';
import PublicRoute from './custom-components/PublicRoute';
import { ErrorBoundary } from './custom-components/ErrorBoundary';
import { FeatureGate } from './custom-components/FeatureGate';

const Home = lazy(() => import('./pages/Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PageCreating = lazy(() => import('./pages/PageCreating'));
const Chat = lazy(() => import('./features/chat/Chat'));
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

export default function App() {
  const flagPageIsCreating = import.meta.env.VITE_FLAG_ISWORKING;
  return (
    <ThemeProvider defaultTheme="system" storageKey="discordia-theme-select">
      <BrowserRouter>
        <ErrorBoundary>
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
                  <FeatureGate capability="games"><Games /></FeatureGate>
                </ProtectedRoute>
              } />

              <Route path="/games/chess" element={
                <ProtectedRoute>
                  <FeatureGate capability="games"><Chess /></FeatureGate>
                </ProtectedRoute>
              } />

              <Route path="/games/jokenpo" element={
                <ProtectedRoute>
                  <FeatureGate capability="games"><Jokenpo /></FeatureGate>
                </ProtectedRoute>
              } />
              
              <Route path="/games/hangman" element={
                <ProtectedRoute>
                  <FeatureGate capability="games"><Hangman /></FeatureGate>
                </ProtectedRoute>
              } />
 

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
 

              <Route path="/rap-battle" element={
                <ProtectedRoute>
                  <FeatureGate capability="games"><RapBattle /></FeatureGate>
                </ProtectedRoute>
              } />
 

              <Route path="/rpg" element={
                <ProtectedRoute>
                  <FeatureGate capability="audio"><RolePlaying /></FeatureGate>
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
                  <FeatureGate capability="chat"><Chat /></FeatureGate>
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
        </ErrorBoundary>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};
