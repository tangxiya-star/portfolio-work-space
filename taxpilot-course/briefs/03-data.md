# Module 3: How Data Travels

### Teaching Arc
- **Metaphor:** A postal sorting centre — mail comes in from different senders (Plaid, the API), gets sorted into labelled bins (React Query cache keyed by queryKey), and the right recipient (screen component) gets their letter without touching anyone else's.
- **Opening hook:** "You tap a transaction row — TaxPilot shows details instantly. No loading spinner. How? The data was already there, waiting in a cache before you tapped."
- **Key insight:** React Query is a smart cache that separates "fetching data" from "displaying data." The mock→real swap pattern means you can build the entire UI before the backend exists.
- **"Why should I care?":** When data isn't showing up, or showing stale data, or re-fetching too often — this module tells you exactly where to look and what to tell AI to fix.

### Code Snippets (pre-extracted)

File: hooks/useTaxSummary.ts (full, 18 lines)
```ts
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { TaxSummary } from '../types/tax'

// TODO: Switch to real API when backend is ready
import { mockTaxSummary } from '../mocks/data'

export function useTaxSummary(year: number) {
  return useQuery({
    queryKey: ['tax-summary', year],
    queryFn: async () => {
      // return api.get<TaxSummary>(`/tax/summary?year=${year}`)
      return mockTaxSummary
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  })
}
```

File: services/api.ts (full, 46 lines)
```ts
import { storage } from './storage'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api'

class APIError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'APIError'
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await storage.getToken()
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new APIError(error.error.code, error.error.message)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

export { APIError }
```

File: mocks/data.ts (lines 1-10, the header comment)
```ts
/**
 * TaxPilot — Mock Data
 * Last updated: 2026-03-23 v1.0
 *
 * Usage:
 * 1. In services/api.ts, use this mock data in place of real API calls
 * 2. Once backend is live, swap to real fetch — page code stays unchanged
 * 3. All data formats match the API docs exactly
 */
```

### Screens (4 screens)

**Screen 1: The Mock→Real Swap**
- Show the mock pattern visually: two columns side-by-side
  - Left: "During dev" (commented-out real API call + active mock return)
  - Right: "After launch" (real API call active, mock import removed)
- Callout: "💡 This is genius engineering. The screen component doesn't know or care whether data came from mock or API — it just receives data. Zero UI changes needed when backend goes live."
- Use the useTaxSummary.ts snippet for the translation block.

**Screen 2: The React Query Lifecycle**
- Data flow animation — 5 actors: Screen, Hook (useTransactions), React Query Cache, API Service, Backend/Mock
- Steps:
  1. Screen mounts — calls useTransactions()
  2. Hook checks cache: is ['transactions','home'] there?
  3. Cache miss → calls queryFn
  4. queryFn returns mockTransactions (or real API)
  5. Cache stores result with key ['transactions','home']
  6. Hook delivers data to Screen
  7. 30 seconds later: Screen re-focuses → staleTime expired → re-fetch
- 7 animated steps

**Screen 3: The API Service — One Gate for All Traffic**
- Code ↔ English of services/api.ts
- Left: the full api.ts
- Right: "BASE_URL = where the backend lives. request() = the universal template that every API call follows. It grabs the auth token, attaches it to every request, and throws a typed error if something goes wrong. api.get/post/patch/delete = the clean interface the rest of the app uses."
- Callout: "💡 No fetch() anywhere in the app except here. This is called a 'service layer' — if the API URL or auth method ever changes, you update one file, not 20 screens."

**Screen 4: queryKey — The Postal Address**
- Visual: 3 post office boxes labelled with queryKeys:
  - `['transactions', 'home']` → useTransactions hook
  - `['tax-summary', 2026]` → useTaxSummary(2026)
  - `['tax-summary', 2025]` → useTaxSummary(2025)
- Explain: changing the year argument creates a separate cache slot — 2026 and 2025 summaries never overwrite each other.
- Quiz at end (3 questions)

### Interactive Elements

- [x] **Data flow animation** — 7-step React Query lifecycle (described above)
- [x] **Code↔English translation** — useTaxSummary.ts (mock→real pattern), services/api.ts (service layer)
- [x] **Quiz** — 3 questions:
  Q1: "The Home screen shows stale tax data from 2 minutes ago even though a transaction was just confirmed. What setting controls this?" Options: refetchOnWindowFocus (partial) / staleTime (correct — it's set to 30s, so data seems fresh for 30s) / queryKey / BASE_URL
  Q2: "You want to add a new API endpoint /tax/deductions. Where in the codebase do you add the fetch call?" Options: Directly in the screen component (wrong) / In services/api.ts, then call it from a new hook (correct) / In store/taxStore.ts / In mocks/data.ts
  Q3: "Two screens both call useTaxSummary(2026). How many actual network requests happen?" Options: Two — one per screen (wrong) / One — React Query shares the cached result (correct) / Zero — mock data never hits the network / Depends on staleTime
- [x] **Glossary tooltips** — queryKey, queryFn, staleTime, cache, service layer, fetch, Bearer token, environment variable, mock data

### Reference Files to Read
- `references/interactive-elements.md` → "Message Flow / Data Flow Animation", "Code ↔ English Translation Blocks", "Multiple-Choice Quizzes", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** "Meet the Cast" — introduced the 4 archetypes. This module shows Hooks and Services in motion.
- **Next module:** "The Design Engine" — shifts from data to visuals. How theme.ts drives every pixel.
- **Tone/style notes:** Accent = forest green. Module background: `--color-bg`. Postal sorting centre metaphor — keep the "bin/address" language for cache slots. Actor colors: Screen=actor-1, Hook=actor-2, Cache=actor-3, Service=actor-4, Backend=actor-5.
