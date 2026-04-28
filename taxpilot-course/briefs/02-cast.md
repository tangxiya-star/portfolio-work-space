# Module 2: Meet the Cast

### Teaching Arc
- **Metaphor:** A TV production crew — the screen actors (Screen components) are what the audience sees, but behind the scenes there's a director calling shots (Router), a props department handling costumes (Theme/Typography), a memory department keeping notes (Zustand Store), and a research team fetching facts from outside (React Query + API).
- **Opening hook:** "TaxPilot has 23 files in the app/ folder — but only 4 types of 'characters' doing the real work. Once you know the cast, you can tell AI exactly where to put anything."
- **Key insight:** Every file in TaxPilot is one of exactly 4 archetypes: Screen, Hook, Store, or Service. Knowing which is which is the key to steering AI confidently.
- **"Why should I care?":** When you ask AI to "add a feature," it needs to know: is this a screen, a hook, a store update, or a service call? Misplacing logic causes bugs, duplicated state, and UI that doesn't update.

### Code Snippets (pre-extracted)

File: store/taxStore.ts (lines 1-41, full file)
```ts
import { create } from 'zustand'

interface TaxStore {
  userId: string | null
  accessToken: string | null

  pendingSubmitIds: string[]
  addPendingSubmit: (id: string) => void
  removePendingSubmit: (id: string) => void
  clearPendingSubmit: () => void

  onboardingComplete: boolean
  setOnboardingComplete: (v: boolean) => void

  setAuth: (userId: string, token: string) => void
  clearAuth: () => void
}

export const useTaxStore = create<TaxStore>((set) => ({
  userId: null,
  accessToken: token,

  pendingSubmitIds: [],
  addPendingSubmit: (id) =>
    set((state) => ({
      pendingSubmitIds: state.pendingSubmitIds.includes(id)
        ? state.pendingSubmitIds
        : [...state.pendingSubmitIds, id],
    })),
  removePendingSubmit: (id) =>
    set((state) => ({
      pendingSubmitIds: state.pendingSubmitIds.filter((i) => i !== id),
    })),
  clearPendingSubmit: () => set({ pendingSubmitIds: [] }),

  onboardingComplete: false,
  setOnboardingComplete: (v) => set({ onboardingComplete: v }),

  setAuth: (userId, token) => set({ userId, accessToken: token }),
  clearAuth: () => set({ userId: null, accessToken: null }),
}))
```

File: hooks/useTransactions.ts (full file, 16 lines)
```ts
import { useQuery } from '@tanstack/react-query'
import type { Transaction } from '../types/transaction'

// TODO: Switch to real API when backend is ready
import { mockTransactions } from '../mocks/data'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions', 'home'],
    queryFn: async () => {
      // return api.get<{ transactions: Transaction[]; next_cursor: string | null }>('/transactions/home')
      return mockTransactions
    },
    staleTime: 30 * 1000,
  })
}
```

File: app/_layout.tsx (lines 52-63)
```tsx
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="detail" />
        </Stack>
      </QueryClientProvider>
    </View>
  )
```

### Screens (5 screens)

**Screen 1: The 4 Archetypes**
- 4 large pattern cards (icon + name + 1 sentence + example file):
  - 📱 **Screen** — What the user sees and taps. e.g., `app/(tabs)/index.tsx`
  - 🪝 **Hook** — Logic extracted from screens so it can be reused. e.g., `hooks/useTransactions.ts`
  - 🗄️ **Store** — Global memory that any screen can read or update. e.g., `store/taxStore.ts`
  - 🌐 **Service** — Everything that talks to the outside world. e.g., `services/api.ts`

**Screen 2: The Store — Global Memory**
- Code ↔ English translation of `store/taxStore.ts`
- Left: the Zustand store
- Right: plain English per section: "This is the app's memory. userId = who's logged in. pendingSubmitIds = the list of expenses waiting for your approval. These survive screen changes — unlike local state."
- Callout: "💡 Rule: Only 3 things live in Zustand: auth state, batch submit queue, and onboarding progress. Everything else (transactions, tax data) goes through React Query."

**Screen 3: Hooks — Logic with a Name**
- Code ↔ English of `hooks/useTransactions.ts`
- Right side: "A hook is a function that starts with 'use'. This one asks React Query for transactions. If you've asked before and it's fresh (under 30 seconds), it returns the cached answer instead of asking again."
- Visual file tree showing hooks/ directory with all hook files annotated

**Screen 4: The Root Layout — The Show's Stage Manager**
- Code ↔ English of `app/_layout.tsx` (lines 52-63)
- Right: "QueryClientProvider wraps the whole app so any hook can use React Query. Stack defines the navigation structure — (auth) screens, (tabs) screens, and the detail modal. All screens live inside this wrapper."
- Glossary tooltips: QueryClientProvider, Stack, Provider pattern

**Screen 5: Group Chat — Who Talks to Whom**
- Group chat animation with the 5 actors: Screen, Hook, Store, Service, Plaid API
- Chat scenario: User views Home screen → Screen asks Hook for data → Hook checks React Query cache → Cache miss → Service calls API → API returns data → Hook delivers to Screen → Screen renders

**Quiz at end:**
- 3 scenario questions
- Q1: "You want to add a 'favorite transactions' list that persists when the user navigates away. Where does this list live?" Options: In the Screen component (wrong) / In Zustand Store (correct) / In a Hook / In the Service
- Q2: "AI wrote code that fetches transactions directly inside a screen component with fetch(). What's wrong with this?" Options: fetch() doesn't work in React Native (wrong) / It breaks the rule that API calls go through services/api.ts (correct) / It will work fine / The transactions will load too slowly
- Q3: "useTransactions() has staleTime: 30 * 1000. What does that mean in practice?" Options: The data expires after 30 milliseconds (wrong) / Data is considered fresh for 30 seconds — no re-fetch during that window (correct) / The hook runs every 30 seconds automatically / Transactions older than 30 days are hidden

### Interactive Elements

- [x] **Code↔English translation** — store/taxStore.ts (full) + hooks/useTransactions.ts (full) + _layout.tsx snippet
- [x] **Group chat animation** — actors: Home Screen, useTransactions Hook, React Query Cache, API Service, Plaid API. 6-message flow showing a cache miss then cache hit.
- [x] **Quiz** — 3 scenario questions above
- [x] **Pattern cards** — 4 archetypes as visual cards (Screen/Hook/Store/Service)
- [x] **Visual file tree** — hooks/ directory with each file's purpose annotated
- [x] **Glossary tooltips** — Zustand, React Query, hook, store, provider, staleTime, cache, QueryClient

### Reference Files to Read
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Group Chat Animation", "Multiple-Choice Quizzes", "Pattern/Feature Cards", "Visual File Tree", "Glossary Tooltips"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** "The $4,890 Hunt" — covered the user-facing journey and screens. Module 1 set the scene; Module 2 reveals the crew behind it.
- **Next module:** "How Data Travels" — will show data moving between these actors in detail (React Query lifecycle, mock→real swap).
- **Tone/style notes:** Accent = forest green. Module background: `--color-bg-warm`. Actor colors: Screen=actor-1 (vermillion), Hook=actor-2 (teal), Store=actor-3 (plum), Service=actor-4 (golden), API=actor-5 (forest). Keep the "TV crew" metaphor consistent — don't switch metaphors mid-module.
