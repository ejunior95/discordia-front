import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { EasyChat } from '@ejunior95/easy-chat';
import '@ejunior95/easy-chat/dist/style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <EasyChat
          config={{
            title: "DiscordIA Chatbot",
            position: "bottom-right",
            primaryColor: "#007bff",
            systemPrompt: "You are a helpful and sarcastic assistant.",
            initialMessage: "Olá! Eu sou o assistente virtual do DiscordIA. Como posso ajudar você hoje?",
          }} 
        />
    </AuthProvider>
  </StrictMode>,
)
