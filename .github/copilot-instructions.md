# discordIA Frontend - AI Coding Assistant Instructions

## Project Overview
discordIA is a competitive AI chat application where multiple AI models (ChatGPT, Gemini, DeepSeek, Grok) compete to provide the best responses to user questions. Users can compare, evaluate, and vote on responses.

**Stack**: React 19 + TypeScript + Vite + TailwindCSS 4 + shadcn/ui + React Router v7

## Architecture & Data Flow

### Core Application Structure
- **Entry Point**: [src/main.tsx](src/main.tsx) wraps app with `AuthProvider` and `StrictMode`
- **Routing**: [src/App.tsx](src/App.tsx) defines all routes with lazy-loaded page components
- **Layout System**: [src/custom-components/Layout.tsx](src/custom-components/Layout.tsx) conditionally renders `Navbar` (hidden on `/`, `/login`, `/register`)
- **Route Protection**: Use `ProtectedRoute` wrapper for authenticated pages, `PublicRoute` for login/register

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
```

**Service Layer Pattern**:
- [src/services/auth.service.ts](src/services/auth.service.ts): login, logout, getUserInfo
- [src/services/main.service.ts](src/services/main.service.ts): `askToAll(question)`, `askToOne(question, agent)`
- Services use class-based structure with async methods
- API responses follow `IResponseApiAllIa` interface (chat-gpt, gemini, deepseek, grok objects)

### Main Chat Feature
[src/custom-components/ChatBody.tsx](src/custom-components/ChatBody.tsx) implements the core competition UI:
- Sends question to all 4 AIs via `MainService.askToAll()`
- Displays user message followed by 4 AI responses
- Uses message array structure: `{ message: string, type: 'user'|'ia', agentIA?: string }`
- Shows `SecondaryLoader` during API calls
- Auto-scrolls chat with `ScrollArea` ref

## Development Conventions

### Component Organization
- **UI Components**: [src/components/ui/](src/components/ui/) - shadcn/ui primitives (button, card, dialog, etc.)
- **Custom Components**: [src/custom-components/](src/custom-components/) - app-specific logic (ChatBody, GameCard, Navbar, etc.)
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
Export `navigationItems` from [src/App.tsx](src/App.tsx) for consistent nav links:
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
Follow class-based pattern with try-catch and console.error:
```typescript
async methodName(param: string) {
  try {
    const response = await api.request({ method, url, data });
    return response;
  } catch (error) {
    console.error(`Erro na requisição API: ${error}`);
  }
}
```

### Animation Pattern
Use `framer-motion` with `AnimatePresence` for page transitions (see [src/custom-components/ChatBody.tsx](src/custom-components/ChatBody.tsx#L73-L79))

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

### Adding shadcn/ui Components
Project uses shadcn/ui "new-york" style with configuration in [components.json](components.json). Components auto-install to `@/components/ui` with Tailwind CSS variables for theming.

### Common Pitfalls
1. **Missing Auth Context**: Always wrap new protected features with `<ProtectedRoute>`
2. **API Errors**: Backend may return 401 if cookies expired - handle in service layer
3. **Lazy Loading**: New pages must be imported with `lazy()` and wrapped in `<Suspense fallback={<Loader />}>`
4. **Theme Variables**: Use CSS variables from Tailwind config, not hardcoded colors

## File Structure Conventions
- Hooks → [src/hooks/](src/hooks/) (e.g., `useAuth.ts`)
- Interfaces → [src/interfaces/](src/interfaces/) (e.g., `user.ts`)
- Utilities → [src/utils/](src/utils/) (global helper functions)
- Assets → [src/assets/](src/assets/) (images, icons)

## Backend Integration Notes
- Backend is NestJS-based (see README references)
- Endpoints: `/auth/login`, `/auth/logout`, `/auth/me`, `/ask-to-all`, `/ask-to-one`
- All requests use `withCredentials: true` for cookie authentication
- Expected response format for AI queries: `{ 'chat-gpt': {...}, gemini: {...}, deepseek: {...}, grok: {...} }`
