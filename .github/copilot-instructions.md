# discordIA Frontend - Copilot Instructions

## Project Overview

discordIA is a competitive AI chat application where ChatGPT, Gemini, DeepSeek, and Grok answer the same prompt. Users compare responses, vote on the best answer, retry individual AI responses, and track a winner per round.

The frontend also includes protected game experiences for chess, jokenpo, hangman, RPG, and rap battles, plus home analytics, profile, subscription, credits, and settings areas. Some routes are gated by plan capabilities returned by the backend.

Stack: React 19, TypeScript, Vite 6, TailwindCSS 4, shadcn/ui, Radix UI, React Router 7, Axios, pnpm.

## Architecture and Data Flow

### Core Application Structure

- Entry point: `src/main.tsx` wraps the app with `AuthProvider`, `CurrentIAProvider`, and `StrictMode`.
- Routing: `src/App.tsx` defines lazy-loaded routes inside `Suspense`.
- Layout: `src/custom-components/Layout.tsx` renders the app shell and hides the navbar on public routes.
- Route protection: use `ProtectedRoute` for authenticated pages and `PublicRoute` for login/register.
- Plan protection: use `FeatureGate` for routes/features that require `chat`, `games`, `audio`, or `music` capabilities.
- Error handling: `src/custom-components/ErrorBoundary.tsx` wraps the route tree.
- Navigation config: `src/config/navigation.ts` exports navbar items.
- API instance: `src/server/api.ts` owns the shared Axios client.

### Providers and Global State

- `AuthContext` loads the authenticated user with `getUserInfo()` and exposes `user`, `setUser`, `isLoading`, `refreshCredits`, `setCreditsBalance`, and `hasCapability` through `useAuth()`.
- `CurrentUser` includes role, plan capabilities, credits, profile fields, and terms acceptance metadata.
- `registerCreditsListener` lets the Axios interceptor update navbar credit balance from `X-Credits-Balance`.
- `CurrentIAContext` stores the selected AI for game flows as `CurrentIA = '' | 'gemini' | 'grok' | 'deepseek' | 'chat-gpt'`.
- `CurrentIAContext` persists its value in `localStorage` under `currentIA`.
- Protected game pages should redirect to `/games` when a selected AI is required and missing.
- `ThemeProvider` uses storage key `discordia-theme-select` and supports light, dark, and system modes.

### Routes

- Public: `/`, `/login`, `/register`.
- Protected: `/home`, `/chat`, `/games`, `/games/chess`, `/games/jokenpo`, `/games/hangman`, `/rap-battle`, `/rpg`, `/profile`, `/settings`, `/subscription`.
- Capability gated: `/chat` requires `chat`; `/games`, `/games/chess`, `/games/jokenpo`, `/games/hangman`, and `/rap-battle` require `games`; `/rpg` currently requires `audio`.
- Fallback: `*` renders `NotFound`.
- `VITE_FLAG_ISWORKING=true` renders `PageCreating` for landing, login, and register.
- New route pages should be imported with `lazy()` in `App.tsx` and wrapped with the correct guard.

## API Integration

### Axios

`src/server/api.ts` exports the only Axios instance to use:

- `baseURL` comes from `VITE_API_BASE_URL` and throws during startup if missing.
- `withCredentials: true` sends cookie auth.
- A `401` response redirects to `/login` outside public routes, except `/auth/me` bootstrap failures.
- A `402` with `INSUFFICIENT_CREDITS` shows a credits toast with upgrade action.
- A `403` with `FEATURE_NOT_ALLOWED` shows a plan toast with upgrade action.
- Successful responses can update credits from `X-Credits-Balance`.

Do not create a second Axios instance for app API calls.

### Service Layer Pattern

- Services export async functions, not classes.
- Use `api.request<T>({ method, url, data, signal })`.
- Accept `AbortSignal` for long-running AI calls that the UI can cancel.
- Catch inside a service only when the caller genuinely needs a fallback there, as auth bootstrap does.
- Normalize backend response variants in the service when the UI needs one stable shape.

Current service highlights:

- `src/services/auth.service.ts`: `login`, `logout`, `getUserInfo`.
- `src/services/user.service.ts`: `createUser`, `updateUser` with `FormData`.
- `src/services/main.service.ts`: `askToAll`, `askToOne`, `askGameAction`.
- `src/services/billing.service.ts`: plans, subscription, invoices, payment method.
- `src/services/credits.service.ts`: balance and transactions.
- `src/services/stats.service.ts`: account stats and recent rounds.
- `src/services/audio.service.ts`: rap battle music status and polling.

`askToOne` and `askGameAction` normalize both direct `{ response }` responses and keyed `{ [agent]: { response } }` responses.

### Backend Endpoints Used

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

Keep endpoint changes synchronized with the NestJS DTOs/controllers in `discordia/`.

## Feature Structure

### Component Organization

- UI primitives: `src/components/ui/` for shadcn/Radix components.
- App-level components: `src/custom-components/` for layout, route guards, navbar, loaders, dialogs, game cards, scoreboard, and page headers.
- Feature modules: `src/features/<feature>/` for feature-owned UI, hooks, constants, and types.
- Route pages: `src/pages/` for lazily loaded page-level wrappers.
- Shared interfaces: `src/interfaces/`.
- Shared utilities: `src/utils/` and `src/lib/utils.ts`.
- Home analytics: `src/features/home`.
- Billing, preferences, settings, and account stats: `src/features/account`.

Prefer keeping stateful feature logic inside `src/features/<feature>/hooks`.

### Chat Feature

`src/features/chat` implements the core competition UI.

- `AGENTS` and `AgentIA` define `chat-gpt`, `gemini`, `deepseek`, and `grok`.
- `useChatRounds()` controls send, abort, retry, vote, clear, winners, and `localStorage` persistence.
- `askToAll(question, signal)` queries all four agents.
- `askToOne(question, agent, signal)` retries one agent.
- `voteOnRound(roundId, agent, signal)` persists the selected winner in the backend.
- Responses use `loading`, `success`, or `error` states.
- Saved `loading` responses must be converted to errors on reload instead of restarting old requests.
- Preserve backward compatibility for stored `Round` and `AIResponse` data.

### Game Features

All game AI calls should use `askGameAction(context, agent, payload, signal?)` from `src/services/main.service.ts`. Payloads must stay serializable and aligned with backend `gamePromptBuilders.ts`.

- Chess lives in `src/features/chess` and uses `chess.js` plus `react-chessboard`; do not reimplement chess rules.
- Chess payload: `fen`, `pgn`, `side`, `level`, optional `lastInvalid`.
- Jokenpo lives in `src/features/jokenpo`; history payload contains previous `{ user, ai }` choices.
- Hangman lives in `src/features/hangman`; modes map to `hangman-chooser` and `hangman-guesser` contexts.
- RPG lives in `src/features/rpg`; campaigns support scenarios `fantasy`, `sci-fi`, `horror`, `custom`, with master/user/AI turn order.
- RPG master AI responses may include `audio_url`; keep audio playback optional and resilient.
- Rap battle lives in `src/features/rap-battle`; battles use two agents, three rounds, voting, retries, previous-verse context, optional `musicTaskId`, and polling through `pollRapMusic`.
- Use feature constants for storage keys, limits, labels, and options.
- Sanitize restored localStorage state so stale `loading` or in-progress states do not resume abandoned requests.

### Account and Settings

- Account-related logic lives in `src/features/account`.
- `usePreferences()` persists user preferences in `localStorage` and deep-merges saved values with defaults.
- `useBilling()` loads plans, active subscription, invoices, and payment method for `/subscription`.
- `useChatStats()` combines `stats/me` and `stats/me/rounds` for account/dashboard views.
- `CreditsBadge` shows current balance or unlimited status and links to `/subscription`.
- Admin and beta tester roles should be treated as full-access/unlimited in UI, matching backend exemption rules.
- Preserve compatibility when changing preference shapes.

### Home Dashboard

- `src/features/home` consumes `GET /stats/home` and renders totals, leaderboard, IA of the week, weekly performance, recent activity, and shortcuts.
- Keep chart/leaderboard types synchronized with `home.api.ts` and backend `StatsService` responses.

## Styling and UI

- Use TailwindCSS 4 with tokens from `src/index.css`.
- Use `cn()` from `src/lib/utils.ts` for class composition.
- Use shadcn/Radix primitives before creating new UI primitives.
- Use `lucide-react` for interface icons.
- Use `@lobehub/icons` for AI brand icons.
- Use `class-variance-authority` for component variants when matching existing components.
- Keep text responsive and avoid layouts that overflow on mobile.
- Prefer theme tokens over hardcoded colors.
- Keep dark/light/system theme support intact.
- `@ejunior95/easy-chat` is installed and its CSS is imported in `src/main.tsx`, but the widget is currently commented out; do not re-enable it without an explicit request.

## Path Aliases

The alias is configured in `tsconfig.json` and `vite.config.ts`:

```ts
"@/*" -> "./src/*"
```

Use `@/` imports for internal modules instead of long relative paths.

## Environment Variables

Required variables:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FLAG_ISWORKING=false
```

`VITE_API_BASE_URL` is mandatory. `VITE_FLAG_ISWORKING=true` enables the temporary creating page for public entry routes.

Never commit real secrets or private values. Use placeholders in examples.

## Development Workflow

Always use `pnpm`:

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run lint
pnpm run preview
```

There are currently no `test`, `test:e2e`, or `test:cov` scripts in `package.json`. Use `pnpm run build` and `pnpm run lint` for available validation unless tests are added.

## Common Changes

### Adding a Protected Page

1. Create the page in `src/pages` or route directly to a feature component.
2. Import it with `lazy()` in `App.tsx`.
3. Wrap it in `<ProtectedRoute>`.
4. Add navigation in `src/config/navigation.ts` only if it belongs in the main navbar.
5. Keep loading handled by the existing `Suspense` fallback.

### Adding a Service Method

```ts
export async function methodName(param: string, signal?: AbortSignal) {
  return api.request<ResponseType>({ method: 'POST', url: 'endpoint', data, signal });
}
```

- Type the request and response.
- Use the shared Axios instance.
- Normalize backend response variants here when needed.
- Keep auth and cookie behavior centralized.

### Adding a Game Flow

1. Add types, constants, hook, and components under `src/features/<game>`.
2. Add a route page in `src/pages` when needed.
3. Use `CurrentIAContext` or explicit agent selection consistently.
4. Call `askGameAction` with a backend-supported context and payload.
5. Persist only serializable state and sanitize restored state.
6. Update backend `ALLOWED_CONTEXTS`, `GameActionDto`, and `gamePromptBuilders.ts` if adding a new context.

### Adding shadcn/ui Components

The project uses shadcn/ui `new-york` style with configuration in `components.json`. Components install to `@/components/ui` and use Tailwind CSS variables for theming.

## Common Pitfalls

- Missing guard: protected pages must use `<ProtectedRoute>`.
- Missing plan gate: capability-specific pages must use `<FeatureGate>` and matching navigation `requiresCapability`.
- Missing `VITE_API_BASE_URL`: app startup throws if it is undefined.
- Duplicate API clients: use `src/server/api.ts` only.
- LocalStorage migrations: avoid breaking saved chat rounds, games, current IA, theme, and preferences.
- AI response shapes: backend may return keyed-by-agent objects; rely on service normalization.
- Credits/billing: do not compute final access solely in the frontend; backend guards remain the source of truth.
- Stale loading state: convert persisted loading states to errors or neutral states on reload.
- Chess rules: use `chess.js` legality instead of custom rule logic.

## Quick Reference

- App bootstrap: `src/main.tsx`
- Routes: `src/App.tsx`
- API client: `src/server/api.ts`
- Auth: `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`
- Current IA: `src/contexts/CurrentIAContext.tsx`
- Navigation: `src/config/navigation.ts`
- Feature gate: `src/custom-components/FeatureGate.tsx`
- Credits badge: `src/custom-components/CreditsBadge.tsx`
- Chat: `src/features/chat`
- Home: `src/features/home`
- Chess: `src/features/chess`
- Hangman: `src/features/hangman`
- Jokenpo: `src/features/jokenpo`
- RPG: `src/features/rpg`
- Rap battle: `src/features/rap-battle`
- Account/settings: `src/features/account`
- Billing service: `src/services/billing.service.ts`
- Credits service: `src/services/credits.service.ts`
- Stats service: `src/services/stats.service.ts`
- Audio service: `src/services/audio.service.ts`
