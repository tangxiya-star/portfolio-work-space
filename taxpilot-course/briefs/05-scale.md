# Module 5: Built to Scale

### Teaching Arc
- **Metaphor:** An airport terminal — every gate (screen) has a fixed address (file path), the departures board (router) knows all addresses automatically, security (TypeScript) checks every bag before it passes through, and the ground crew (hooks) follows the same protocol at every gate. New gates get added without rebuilding the terminal.
- **Opening hook:** "TaxPilot has 23 screens and adding a new one takes 30 seconds — create a file in the right folder and it appears automatically. No configuration needed. Here's the magic behind that."
- **Key insight:** Expo Router's file-based routing, strict TypeScript, and the hook extraction rule together create a codebase where AI can add features safely without breaking existing behaviour.
- **"Why should I care?":** These are the rules you enforce when prompting AI. Knowing them means you can tell AI "this goes in a hook, not a screen" or "don't use any type, TypeScript is strict here" and get better, safer code.

### Code Snippets (pre-extracted)

File: app/_layout.tsx (lines 1-12, font imports show the pattern)
```tsx
import { useCallback } from 'react'
import { View } from 'react-native'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
```

File: app/(tabs)/_layout.tsx (the tab bar config — how tabs are defined by file presence)
```tsx
// The file app/(tabs)/index.tsx becomes the Home tab automatically.
// The file app/(tabs)/calendar.tsx becomes the Calendar tab.
// No registration needed — the folder structure IS the navigation.
<Tabs screenOptions={{ tabBarStyle: { backgroundColor: theme.colors.background } }}>
  <Tabs.Screen name="index"    options={{ title: 'Home',     tabBarIcon: ... }} />
  <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ... }} />
  <Tabs.Screen name="savings"  options={{ title: 'Savings',  tabBarIcon: ... }} />
  <Tabs.Screen name="report"   options={{ title: 'Report',   tabBarIcon: ... }} />
</Tabs>
```

File: hooks/useOnboardingStep1.ts (shows hook extraction pattern)
```ts
// Business logic extracted FROM the screen INTO a hook.
// The screen imports this and stays clean of logic.
export function useOnboardingStep1() {
  const [selectedIncome, setSelectedIncome] = useState<string[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [selectedOccupation, setSelectedOccupation] = useState<string>('')

  const isComplete = selectedIncome.length > 0 && !!selectedEntity && !!selectedOccupation

  const handleContinue = async () => {
    // save to store, navigate to step2
  }

  return { selectedIncome, selectedEntity, selectedOccupation,
           isComplete, handleContinue, setSelectedIncome,
           setSelectedEntity, setSelectedOccupation }
}
```

File: types/transaction.ts (TypeScript strict — no any)
```ts
export type TransactionStatus = 'pending' | 'confirmed' | 'excluded'
export type TransactionCategory =
  | 'software' | 'travel' | 'office' | 'meals'
  | 'personal' | 'income' | 'other'

export interface Transaction {
  id: string
  merchant_name: string
  amount: number
  date: string
  status: TransactionStatus
  category: TransactionCategory | null
  account_id: string
  account_mask: string
}
```

### Screens (4 screens)

**Screen 1: File = Route — Expo Router Magic**
- Visual file tree showing app/ directory structure with arrows showing how each file becomes a URL/screen:
  - `app/index.tsx` → root redirect
  - `app/(auth)/welcome.tsx` → /welcome
  - `app/(tabs)/index.tsx` → /tabs (Home tab)
  - `app/(tabs)/calendar.tsx` → /tabs/calendar
  - `app/detail.tsx` → /detail (modal)
- "(auth)" and "(tabs)" groups in parentheses = route groups (they don't appear in the URL, just organize screens)
- Callout: "💡 To add a new tab, create a file in app/(tabs)/. The router finds it automatically. No imports, no config changes."
- Code ↔ English of the Tabs layout snippet

**Screen 2: The Hook Extraction Rule**
- Code ↔ English of useOnboardingStep1.ts
- Right: "The screen file (step1.tsx) contains zero business logic — it just renders. All the state, validation, and navigation logic lives in this hook. This keeps screens readable and logic testable."
- Two-column visual: LEFT = "What screen files do" (render JSX, apply styles, import hooks) vs RIGHT = "What hooks do" (manage state, call APIs, run business logic, navigate)
- Callout: "💡 Rule from CLAUDE.md: 'No business logic in components — extract to hooks/'. When AI puts logic in a screen, ask it to move it to a hook."

**Screen 3: TypeScript — The Safety Net**
- Code ↔ English of types/transaction.ts
- Right: "TransactionStatus can only be 'pending', 'confirmed', or 'excluded' — nothing else. If AI writes `status: 'approved'` anywhere, TypeScript catches it immediately before you even run the app."
- Side-by-side comparison: "Without TypeScript" (any type, runtime errors) vs "With TypeScript strict" (compile-time errors, clear contracts)
- Callout: "💡 Rule from CLAUDE.md: 'No any type — strict TypeScript everywhere.' If AI uses `any`, ask it to replace with the proper type from types/."

**Screen 4: How to Add a Feature (Putting It All Together)**
- Numbered step cards: "How to add a 'Notes' field to a transaction"
  1. 📝 Add `notes?: string` to the Transaction type in `types/transaction.ts`
  2. 🔧 Update the service: add a PATCH call in `services/api.ts`
  3. 🪝 Create `hooks/useUpdateNote.ts` with the mutation logic
  4. 📱 Update the Detail screen to render the field and call the hook
  5. 🎨 Style using only `theme.colors` and `typography` tokens
- Group chat animation: Screen → Hook → Service → API showing the feature being used
- Final quiz

### Interactive Elements

- [x] **Code↔English translation** — Tabs layout (file=route), useOnboardingStep1.ts (hook extraction), types/transaction.ts (TypeScript contracts)
- [x] **Group chat animation** — actors: Detail Screen, useUpdateNote Hook, API Service, Backend. Scenario: user types a note → hook sends PATCH → API updates → screen refreshes.
- [x] **Numbered step cards** — "How to add a Notes field" (5 steps)
- [x] **Visual file tree** — full app/ directory with route annotations
- [x] **Quiz** — 3 questions:
  Q1: "You want to add a /tax/breakdown screen. Where do you create the file?" Options: In components/ (wrong) / In app/(tabs)/breakdown.tsx (correct — becomes a tab route automatically) / In hooks/ / In services/
  Q2: "AI wrote a function inside a screen component that calls the API and updates state. What two rules does this break?" Options: No rules broken (wrong) / No business logic in components + no direct fetch in components (correct — should be a hook calling a service) / Only the TypeScript rule / Only the naming convention
  Q3: "You add a new status 'disputed' to transactions but forget to update TransactionStatus in types/transaction.ts. What happens?" Options: The app crashes at runtime (wrong) / TypeScript shows an error before you can even run the app (correct) / Nothing — TypeScript is optional / The value gets set to undefined

### Reference Files to Read
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Group Chat Animation", "Multiple-Choice Quizzes", "Numbered Step Cards", "Visual File Tree", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** "The Design Engine" — covered theme.ts and visual layer. This is the final module.
- **Next module:** none (this is the last)
- **Tone/style notes:** Accent = forest green. Module background: `--color-bg`. Airport terminal metaphor — "gate" = screen, "departures board" = router, "security" = TypeScript. Close the course on a practical, empowering note: "You now know exactly how to steer AI on this codebase."
