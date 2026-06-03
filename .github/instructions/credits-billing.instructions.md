---
description: "Use when mexer em billing, créditos, planos, FeatureGate, CreditsBadge, useBilling ou no contrato /auth/me no frontend."
applyTo: "discordia-front/src/features/account/**,discordia-front/src/custom-components/FeatureGate.tsx,discordia-front/src/custom-components/CreditsBadge.tsx,discordia-front/src/services/billing.service.ts,discordia-front/src/services/credits.service.ts,discordia-front/src/contexts/AuthContext.tsx"
---

# Créditos e Billing (frontend)

Complementa `copilot-instructions.md`. Foco em regras do lado cliente.

## Fonte de verdade do saldo

O saldo de créditos chega via:
1. **Bootstrap**: `GET /auth/me` → `user.credits.balance` (`AuthContext`).
2. **Live update**: header `X-Credits-Balance` em toda resposta autenticada → `setCreditsBalance()` no interceptor Axios, que atualiza `user.credits` sem novo request.
3. **Refresh explícito**: `refreshCredits()` chama `GET /credits/me` e sincroniza.

Não faça polling de saldo. Não calcule saldo localmente subtraindo custos — deixe o header fazer o sync.

## Protegendo rotas e features

Use `FeatureGate` para esconder features que requerem capability:

```tsx
<FeatureGate capability="music">
  <SunoWidget />
</FeatureGate>
```

- `admin` e `beta_tester` sempre passam, pois `hasCapability` retorna `true` para eles.
- Default de redirect: `/subscription`. Use `fallback` quando preferir renderizar alternativa em vez de redirecionar.
- Não verifique `user.plan.capabilities.includes(...)` manualmente — use sempre `hasCapability(cap)` para centralizar a lógica de role.

## Erros 402 e 403

O interceptor em `src/server/api.ts` já exibe toast com link para `/subscription` em:
- `402 INSUFFICIENT_CREDITS`
- `403 FEATURE_NOT_ALLOWED`

Não duplique esse tratamento em hooks ou componentes. Capture apenas se precisar de lógica adicional além do toast (ex.: resetar estado local).

## `CreditsBadge`

Exibe saldo real ou ∞ para roles isentas. As cores são:
- vermelho: `balance <= 0`
- âmbar: `0 < balance < 10`
- neutro: caso padrão

Não crie um segundo badge de crédito — use `CreditsBadge` onde precisar exibir saldo.

## `/auth/me` e `CurrentUser`

Campos relevantes:

```ts
user.plan.capabilities   // PlanCapability[]
user.plan.slug           // 'free' | 'basic' | 'premium'
user.credits.balance     // number
user.credits.isUnlimited // true para admin/beta_tester
user.role                // 'user' | 'admin' | 'beta_tester'
```

Ao adicionar campo novo no backend (em `AuthController.getMe()`), espelhe em `CurrentUser` / `UserPlan` / `UserCredits` aqui antes de consumir.

## `useBilling`

Carrega em paralelo: `plans`, `subscription`, `invoices`, `paymentMethod`. Não duplique essas chamadas em outros hooks — `useBilling` já tem loading/error e cleanup de requests canceladas.

## Erros comuns

- Verificar `user.plan.capabilities.includes(cap)` diretamente em vez de `hasCapability(cap)` — não cobre admin/beta_tester.
- Subtrair créditos localmente para "atualizar" o saldo — o header `X-Credits-Balance` faz isso depois de cada request.
- Criar nova instância Axios para billing/credits — use sempre `api` de `src/server/api.ts`.
- Tratar 402/403 novamente em hook que já tem tratamento global no interceptor.
