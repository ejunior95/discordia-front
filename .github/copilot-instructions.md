# discordIA Frontend - AI Coding Assistant Instructions

## Project Overview
discordIA is a competitive AI chat application where multiple AI models (ChatGPT, Gemini, DeepSeek, Grok) answer the same prompt. Users compare responses, vote on the best answer, retry individual AI responses, and track a winner per round.

**Stack**: React 19 + TypeScript + Vite + TailwindCSS 4 + shadcn/ui + React Router v7

## Architecture & Data Flow

### Core Application Structure
- **Entry Point**: [src/main.tsx](src/main.tsx) wraps app with `AuthProvider` and `StrictMode`
- **Routing**: [src/App.tsx](src/App.tsx) defines all routes with lazy-loaded page components
- **Layout System**: [src/custom-components/Layout.tsx](src/custom-components/Layout.tsx) conditionally renders `Navbar` (hidden on `/`, `/login`, `/register`)
- **Route Protection**: Use `ProtectedRoute` wrapper for authenticated pages, `PublicRoute` for login/register
- **Error Handling**: [src/custom-components/ErrorBoundary.tsx](src/custom-components/ErrorBoundary.tsx) wraps the route tree
- **Navigation Config**: [src/config/navigation.ts](src/config/navigation.ts) exports the shared navbar item list

### Authentication Flow
Cookie-based auth managed through [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx):
- On mount, calls `getUserInfo()` from [src/services/auth.service.ts](src/services/auth.service.ts)
- Sets global `user` state (id, name, email, avatar, createdAt)
- `ProtectedRoute` shows `Loader` while loading, redirects to `/login` if unauthenticated
- Use `useAuth()` hook to access `user`, `setUser`, `isLoading` anywhere

### API Integration
[src/server/api.ts](src/server/api.ts) exports configured axios instance:
```typescript
// Requires VITE_API_BASE_URL environment variable
// withCredentials: true for cookie-based auth
// Redirects 401 responses to /login outside public routes
```

**Service Layer Pattern**:
- [src/services/auth.service.ts](src/services/auth.service.ts): `login`, `logout`, `getUserInfo`
- [src/services/main.service.ts](src/services/main.service.ts): `askToAll(question, signal?)`, `askToOne(question, agent, signal?)`
- [src/services/user.service.ts](src/services/user.service.ts): `createUser`, `updateUser` using `FormData`
- Services use exported async functions, not classes
- API responses follow `IResponseApiAllIa` interface (chat-gpt, gemini, deepseek, grok objects)

### Main Chat Feature
[src/features/chat/Chat.tsx](src/features/chat/Chat.tsx) implements the core competition UI:
- Uses `useChatRounds()` from [src/features/chat/hooks/useChatRounds.ts](src/features/chat/hooks/useChatRounds.ts)
- Sends questions to all 4 AIs via `askToAll(question, signal)`
- Stores rounds as `{ id, question, askedAt, responses, winner? }`
- Each AI response has `loading`, `success`, or `error` status plus vote count
- Supports aborting the active request, retrying one agent, copying answers, clearing history, and voting
- Persists rounds in `localStorage` with `ROUNDS_STORAGE_KEY`
- Saved `loading` responses are converted to errors on reload instead of restarting requests

## Development Conventions

### Component Organization
- **UI Components**: [src/components/ui/](src/components/ui/) - shadcn/ui primitives (button, card, dialog, etc.)
- **Custom Components**: [src/custom-components/](src/custom-components/) - app-level layout, route guards, navbar, loaders, dialogs, game cards
- **Feature Modules**: [src/features/](src/features/) - feature-owned UI, hooks, constants, and types (currently chat)
- **Pages**: [src/pages/](src/pages/) - route-level components loaded lazily

### Styling Approach
- **TailwindCSS 4** with Vite plugin (`@tailwindcss/vite`)
- **Theme System**: `ThemeProvider` from [src/components/theme-provider.tsx](src/components/theme-provider.tsx) with `next-themes`
  - Storage key: `discordia-theme-select`
  - Supports light/dark/system modes
- **Utility Function**: Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) to merge Tailwind classes with `clsx` + `tailwind-merge`
- **Component Variants**: Use `class-variance-authority` for button/component styling (see [src/components/ui/button.tsx](src/components/ui/button.tsx))

### Path Aliases
Configured in [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts):
```typescript
"@/*" → "./src/*"
```
Always use `@/` imports for internal modules.

### Navigation
Export `navigationItems` from [src/config/navigation.ts](src/config/navigation.ts) for consistent nav links:
```typescript
[{ label, path, icon }] // Used by Navbar component
```

### Environment Variables
Required variables (prefix with `VITE_`):
- `VITE_API_BASE_URL` - Backend API endpoint (throws error if missing)
- `VITE_FLAG_ISWORKING` - Feature flag to show "PageCreating" placeholder on landing

## Key Development Patterns

### Adding Protected Routes
```tsx
<Route path="/new-page" element={
  <ProtectedRoute>
    <NewPage />
  </ProtectedRoute>
} />
```

### Creating Service Methods
Follow the current exported-function pattern:
```typescript
export async function methodName(param: string, signal?: AbortSignal) {
  return api.request<ResponseType>({ method, url, data, signal });
}
```

Only catch errors in services when the caller genuinely needs a fallback there, as `getUserInfo()` does for auth bootstrap.

### Animation Pattern
Use `framer-motion` only where it already improves interaction. Do not add animation as a default requirement for new pages.

### Icon Usage
- Primary library: `lucide-react`
- AI brand icons: `@lobehub/icons` (OpenAI, DeepSeek, Gemini, Grok)

## Development Workflow

### Commands
```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (Vite)
pnpm run build        # TypeScript check + production build
pnpm run lint         # ESLint validation
pnpm run preview      # Preview production build
```

There are currently no `test`, `test:e2e`, or `test:cov` scripts in [package.json](package.json). Use build and lint for available validation unless tests are added.

### Adding shadcn/ui Components
Project uses shadcn/ui "new-york" style with configuration in [components.json](components.json). Components auto-install to `@/components/ui` with Tailwind CSS variables for theming.

### Common Pitfalls
1. **Missing Auth Context**: Always wrap new protected features with `<ProtectedRoute>`
2. **API Errors**: Backend may return 401 if cookies expired - handle in service layer
3. **Lazy Loading**: New pages must be imported with `lazy()` and wrapped in `<Suspense fallback={<Loader />}>`
4. **Theme Variables**: Use CSS variables from Tailwind config, not hardcoded colors
5. **Environment Variables**: `VITE_API_BASE_URL` is mandatory and throws during app startup if missing
6. **Chat Persistence**: `useChatRounds` writes to `localStorage`; keep stored data backward-compatible when changing `Round` or `AIResponse`

## File Structure Conventions
- Hooks → [src/hooks/](src/hooks/) (e.g., `useAuth.ts`)
- Feature hooks → `src/features/<feature>/hooks/` when state belongs to one feature
- Interfaces → [src/interfaces/](src/interfaces/) (e.g., `user.ts`)
- Utilities → [src/utils/](src/utils/) (global helper functions)
- Assets → [src/assets/](src/assets/) (images, icons)
- Route pages → [src/pages/](src/pages/)
- Shared navigation → [src/config/navigation.ts](src/config/navigation.ts)

## Backend Integration Notes
- Backend integration is HTTP-based and relies on cookie authentication
- Endpoints: `/auth/login`, `/auth/logout`, `/auth/me`, `/users`, `/users/:id`, `/ask-to-all`, `/ask-to-one`
- All requests use `withCredentials: true` for cookie authentication
- Expected response format for AI queries: `{ 'chat-gpt': {...}, gemini: {...}, deepseek: {...}, grok: {...} }`
