# discordIA Frontend

Um chat competitivo entre as principais IAs do mercado, disputando para dar a melhor resposta para as suas perguntas.

## Sobre

discordIA é uma arena digital onde múltiplos modelos de IA respondem à mesma pergunta. O usuário compara as respostas, vota nas melhores, pode repetir a consulta de uma IA específica e acompanha o vencedor de cada rodada.

O frontend também reúne áreas protegidas para jogos, batalha de rima, RPG, dashboard, perfil, assinatura, créditos e configurações. Recursos sensíveis a plano usam gates de capacidade retornados pelo backend.

## Stack

- React 19
- TypeScript
- Vite 6
- TailwindCSS 4
- shadcn/ui + Radix UI
- React Router 7
- Axios com autenticação por cookies
- Framer Motion, Recharts e Sonner
- React Three Fiber/Three.js para elementos 3D
- pnpm

## Requisitos

- Node.js compatível com Vite 6
- pnpm 10.24.0 ou superior
- Backend do discordIA disponível e configurado para autenticação por cookies
- `VITE_API_BASE_URL` apontando para a API

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
  main.tsx                   # bootstrap com AuthProvider, CurrentIAProvider e StrictMode
  config/navigation.ts       # itens e capacidades usados na navegação principal
  contexts/AuthContext.tsx   # autenticação, plano, capacidades e créditos
  custom-components/         # layout, navbar, guards, gates e componentes do app
  features/chat/             # experiência principal do chat competitivo
  features/home/             # dashboard, leaderboard e atividades recentes
  features/account/          # perfil, preferências, billing e estatísticas do usuário
  features/chess/            # xadrez com chess.js e react-chessboard
  features/hangman/          # forca com contextos chooser/guesser
  features/jokenpo/          # jokenpô contra IA
  features/rap-battle/       # batalha de rima com polling de música
  features/rpg/              # campanha RPG com narração opcional
  pages/                     # páginas de rota
  server/api.ts              # instância Axios compartilhada
  services/                  # chamadas HTTP para auth, usuário, IA, billing, créditos, stats e áudio
```

## Rotas

- Públicas: `/`, `/login`, `/register`
- Protegidas: `/home`, `/chat`, `/games`, `/games/chess`, `/games/jokenpo`, `/games/hangman`, `/rap-battle`, `/rpg`, `/profile`, `/settings`, `/subscription`
- Fallback: `*` renderiza a página `NotFound`

As páginas protegidas usam `ProtectedRoute`; login e cadastro usam `PublicRoute` quando a aplicação não está em modo de página em criação.

As rotas abaixo também usam `FeatureGate`:

- `/chat`: capacidade `chat`
- `/games`, `/games/chess`, `/games/jokenpo`, `/games/hangman`, `/rap-battle`: capacidade `games`
- `/rpg`: capacidade `audio`

O frontend esconde ou redireciona recursos indisponíveis, mas o backend continua sendo a fonte de verdade para autorização.

## Chat competitivo

O chat vive em `src/features/chat` e funciona por rodadas:

- `useChatRounds` controla envio, cancelamento, retry, votos, vencedor e persistência em `localStorage`.
- `askToAll(question, signal)` consulta ChatGPT, Gemini, DeepSeek e Grok em uma única rodada e recebe `roundId`.
- `askToOne(question, agent)` refaz a resposta de uma IA específica.
- `voteOnRound(roundId, agent)` registra no backend a IA vencedora escolhida pelo usuário.
- Cada resposta possui estado `loading`, `success` ou `error`.
- Rodadas reabertas com respostas pendentes são marcadas como erro, sem reiniciar requests antigas.

Chamadas de chat e jogos consomem créditos. Saldo e erros de plano são tratados pelo interceptor global em `src/server/api.ts`.

## Jogos

Todos os jogos chamam `askGameAction(context, agent, payload, signal?)`, mantendo payloads serializáveis e alinhados com o backend.

- Xadrez usa `chess.js` e `react-chessboard`; regras não devem ser reimplementadas manualmente.
- Jokenpô envia histórico de rodadas `{ user, ai }`.
- Forca usa contextos `hangman-chooser` e `hangman-guesser`.
- RPG suporta cenários `fantasy`, `sci-fi`, `horror` e `custom`; quando o mestre é IA, a resposta pode incluir `audio_url`.
- Batalha de rima usa dois agentes, três rounds, votos, retries e pode receber `musicTaskId` para polling em `src/services/audio.service.ts`.

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
- `POST /rounds/:id/vote`
- `POST /ai/game-action`
- `GET /billing/plans`
- `GET /billing/subscription/me`
- `GET /billing/invoices/me`
- `GET /billing/payment-method/me`
- `GET /credits/me`
- `GET /credits/me/transactions`
- `GET /stats/home`
- `GET /stats/me`
- `GET /stats/me/rounds`
- `GET /music/rap-verse/:taskId/status`

O interceptor também:

- atualiza o saldo exibido quando o backend envia `X-Credits-Balance`;
- redireciona `401` para `/login` fora de rotas públicas;
- mostra toast e link para `/subscription` em `402/INSUFFICIENT_CREDITS`;
- mostra toast e link para `/subscription` em `403/FEATURE_NOT_ALLOWED`.

## Planos, créditos e assinatura

O usuário autenticado retornado por `/auth/me` inclui `plan` e `credits`. O `AuthContext` expõe:

- `hasCapability(capability)` para `chat`, `games`, `audio` e `music`;
- `refreshCredits()` para recarregar saldo;
- `setCreditsBalance()` para refletir o header `X-Credits-Balance`.

A página `/subscription` usa `useBilling()` para carregar planos, assinatura, faturas e método de pagamento. `CreditsBadge` mostra saldo ou status ilimitado na navegação e aponta para assinatura.

Roles `admin` e `beta_tester` devem aparecer como acesso total/ilimitado, em paridade com o backend.

## Dashboard e estatísticas

- `/home` usa `src/features/home` e `GET /stats/home` para totais, leaderboard, IA da semana, gráfico semanal e atividades recentes.
- Áreas de conta usam `useChatStats()` com `GET /stats/me` e `GET /stats/me/rounds`.

## Padrões de desenvolvimento

- Use imports internos com o alias `@/`.
- Componentes reutilizáveis de UI ficam em `src/components/ui`.
- Componentes específicos da aplicação ficam em `src/custom-components` ou dentro da feature correspondente.
- Novas features com estado e componentes próprios devem preferir `src/features/<feature>`.
- Use `cn()` de `src/lib/utils.ts` para compor classes Tailwind.
- Use `lucide-react` para ícones de interface e `@lobehub/icons` para ícones das IAs.
- Novas rotas devem ser importadas com `lazy()` em `App.tsx` e protegidas conforme o tipo de acesso.
- Recursos por plano devem ter `FeatureGate` e `requiresCapability` na navegação quando aparecerem no menu principal.
- Preserve a normalização de respostas em `main.service.ts`, pois a API pode retornar `{ response }` ou `{ [agent]: { response } }`.
- Ao mudar formatos persistidos em `localStorage`, sanitize estados antigos e transforme `loading` abandonado em erro/estado neutro.

## Observações

O projeto ainda não possui scripts de teste configurados no `package.json`. Hoje a validação disponível é feita com `pnpm run lint` e `pnpm run build`.

## Autor

- [Edvaldo de Ramos Junior](https://www.linkedin.com/in/deved-jr100/)
