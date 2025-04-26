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
const Games = lazy(() => import('./pages/Games'));
const RapBattle = lazy(() => import('./pages/RapBattle'));
const RolePlaying = lazy(() => import('./pages/RolePlaying'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Subscription = lazy(() => import('./pages/Subscription'));

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
 

              <Route path="/games" element={
                <ProtectedRoute>
                  <Games />
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
