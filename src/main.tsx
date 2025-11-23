import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { EasyChat } from '@ejunior95/easy-chat';
import '@ejunior95/easy-chat/dist/style.css';

const flagPageIsCreating = import.meta.env.VITE_FLAG_ISWORKING;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <>
        {flagPageIsCreating !== "true" && (
          <EasyChat
            config={{
              position: "bottom-right",
              primaryColor: "#007bff",
              systemPrompt: `Você é um assistente virtual chamado Disc, especializado em fornecer informações e suporte sobre a plataforma DiscordIA. 
                  Seja educado, prestativo e forneça respostas claras e concisas às perguntas dos usuários relacionadas ao DiscordIA.
                  Basicamente, para te dar mais contexto, o DiscordIA é uma plataforma onde os usuários colocam os agentes de IA Gemini, Grok, ChatGPT e Deepseek para disputar entre si em batalhas de IA, 
                  onde o objetivo é entreter os espectadores e proporcionar uma experiência divertida e interativa.`,
              theme: "dark",
            }}
          />
        )}
      </>
    </AuthProvider>
  </StrictMode>,
)
