# TaxPilot — Development Rules

Every implementation MUST follow these documents (read them before any feature work):
- `TaxPilot_前端开发规范_1.md` — Code standards, directory structure, naming
- `TaxPilot_IA活文档_1.html` — Page-level business logic and interactions
- `TaxPilot_API接口文档.md` — All backend endpoints and response formats
- `TaxPilot_Mock数据.ts` — Dev-phase mock data (use until backend is live)

## Tech Stack (do not deviate)
- React Native + Expo Managed Workflow
- Expo Router (file-based routing)
- Zustand (global state — auth, batch submit, onboarding only)
- React Query (all server data)
- TypeScript strict mode (no `any`)
- StyleSheet only (no third-party UI libs)
- @expo/vector-icons for icons

## Directory Structure (strict — do not reorganize)
```
app/          → Pages (Expo Router)
components/   → Reusable components (PascalCase files)
services/     → API calls (all fetch goes through services/api.ts)
store/        → Zustand store (taxStore.ts)
hooks/        → Custom hooks (useXxx.ts)
types/        → TypeScript type definitions
constants/    → theme.ts, typography.ts
```

## Critical Rules
1. **No direct fetch in components** — all API calls go through `services/api.ts`
2. **No server data in Zustand** — transactions, tax data etc. managed by React Query
3. **No `any` type** — strict TypeScript everywhere
4. **No business logic in components** — extract to hooks/
5. **Colors from theme only** — never hardcode hex values (except in theme.ts itself)
6. **Green is #22C55F** — the only green allowed anywhere in the app

## Design System
- Colors: `constants/theme.ts` (brand: ink #0D0D0D, newsprint #E3DFD5, emerald #22C55F)
- Typography: `constants/typography.ts` (Space Grotesk for display, Plus Jakarta Sans for body, JetBrains Mono for numbers)
- Font sizes follow Apple HIG: display(34), title1(28), title2(22), body(17), callout(16), footnote(13), caption(12/11)
- Spacing: 8pt grid (xs:4, sm:8, md:12, lg:16, xl:24, 2xl:32, 3xl:48)
- Radius: xs:4, sm:8, md:16, lg:24, xl:40, round:9999

## API Pattern
```typescript
// hooks/useXxx.ts — React Query hook
// services/api.ts — fetch wrapper
// During dev: return mock data from TaxPilot_Mock数据.ts
// After backend: swap to real fetch, components unchanged
```

## Naming
- Pages: kebab-case (welcome.tsx, step1.tsx)
- Components: PascalCase (TransactionCard.tsx)
- Hooks: camelCase with use prefix (useTransactions.ts)
- Booleans: is/has/can prefix
- Event handlers: handle prefix

## Git
- Branch: feature/xxx → PR to dev → main
- Commits: feat: / fix: / style: / refactor: / docs:
