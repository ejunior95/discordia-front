# discordIA Frontend

Um chat competitivo entre as principais IAs do mercado, disputando para dar a melhor resposta para as suas perguntas.

## Sobre

discordIA é uma arena digital onde múltiplos modelos de IA respondem à mesma pergunta. O usuário compara as respostas, vota nas melhores, pode repetir a consulta de uma IA específica e acompanha o vencedor de cada rodada.

O frontend também reúne áreas protegidas para jogos, batalha de rima, RPG, perfil, assinatura e configurações.

## Stack

- React 19
- TypeScript
- Vite 6
- TailwindCSS 4
- shadcn/ui + Radix UI
- React Router 7
- Axios com autenticação por cookies
- pnpm

## Requisitos

- Node.js compatível com Vite 6
- pnpm 10.24.0 ou superior
- Backend do discordIA disponível e configurado para autenticação por cookies

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FLAG_ISWORKING=false
```

`VITE_API_BASE_URL` é obrigatória. A aplicação falha na inicialização se ela não estiver definida.

`VITE_FLAG_ISWORKING=true` exibe a página temporária de criação na landing, login e cadastro.

## Instalação

```bash
pnpm install
```

## Scripts

```bash
pnpm run dev      # inicia o servidor Vite em desenvolvimento
pnpm run build    # executa typecheck com tsc e gera build de produção
pnpm run lint     # valida o código com ESLint
pnpm run preview  # serve localmente o build de produção
```

## Estrutura principal

```text
src/
  App.tsx                    # rotas, lazy loading e proteção de páginas
  main.tsx                   # bootstrap com AuthProvider e StrictMode
  config/navigation.ts       # itens usados na navegação principal
  contexts/AuthContext.tsx   # estado global de autenticação
  custom-components/         # layout, navbar, guards e componentes do app
  features/chat/             # experiência principal do chat competitivo
  pages/                     # páginas de rota
  server/api.ts              # instância Axios compartilhada
  services/                  # chamadas HTTP para auth, usuário e IA
```

## Rotas

- Públicas: `/`, `/login`, `/register`
- Protegidas: `/home`, `/chat`, `/games`, `/games/chess`, `/games/jokenpo`, `/games/hangman`, `/rap-battle`, `/rpg`, `/profile`, `/settings`, `/subscription`
- Fallback: `*` renderiza a página `NotFound`

As páginas protegidas usam `ProtectedRoute`; login e cadastro usam `PublicRoute` quando a aplicação não está em modo de página em criação.

## Chat competitivo

O chat vive em `src/features/chat` e funciona por rodadas:

- `useChatRounds` controla envio, cancelamento, retry, votos, vencedor e persistência em `localStorage`.
- `askToAll(question, signal)` consulta ChatGPT, Gemini, DeepSeek e Grok em uma única rodada.
- `askToOne(question, agent)` refaz a resposta de uma IA específica.
- Cada resposta possui estado `loading`, `success` ou `error`.
- Rodadas reabertas com respostas pendentes são marcadas como erro, sem reiniciar requests antigas.

## Integração com backend

A instância Axios fica em `src/server/api.ts` e usa:

- `baseURL` a partir de `VITE_API_BASE_URL`
- `withCredentials: true` para cookies de autenticação
- interceptor de `401` que redireciona para `/login` fora das rotas públicas

Endpoints usados atualmente:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /users`
- `PATCH /users/:id`
- `POST /ask-to-all`
- `POST /ask-to-one`

## Padrões de desenvolvimento

- Use imports internos com o alias `@/`.
- Componentes reutilizáveis de UI ficam em `src/components/ui`.
- Componentes específicos da aplicação ficam em `src/custom-components` ou dentro da feature correspondente.
- Novas features com estado e componentes próprios devem preferir `src/features/<feature>`.
- Use `cn()` de `src/lib/utils.ts` para compor classes Tailwind.
- Use `lucide-react` para ícones de interface e `@lobehub/icons` para ícones das IAs.
- Novas rotas devem ser importadas com `lazy()` em `App.tsx` e protegidas conforme o tipo de acesso.

## Observações

O projeto ainda não possui scripts de teste configurados no `package.json`. Hoje a validação disponível é feita com `pnpm run lint` e `pnpm run build`.

## Autor

- [Edvaldo de Ramos Junior](https://www.linkedin.com/in/deved-jr100/)
