# Module 1: The $4,890 Hunt

### Teaching Arc
- **Metaphor:** A metal detector sweeping a beach — most sand is worthless, but the detector beeps when it finds something valuable. TaxPilot sweeps your transactions and beeps on every deductible.
- **Opening hook:** "You tap 'Connect Bank' and 30 seconds later the app shows $4,890 in potential savings — what actually happened in those 30 seconds?"
- **Key insight:** TaxPilot's entire value is in the gap between what you've been paying and what you legally owe — and that gap lives in your transaction history.
- **"Why should I care?":** Understanding the user journey in code lets you tell AI where to add new features, debug "it's not showing up" issues, and explain to users exactly what the app does (and doesn't do).

### Code Snippets (pre-extracted)

File: app/(auth)/welcome.tsx (lines 10-19)
```tsx
export default function WelcomeScreen() {
  const handleAppleSignIn = () => {
    // TODO: Implement Apple Sign In
    router.push('/(auth)/onboarding/step1')
  }

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    router.push('/(auth)/onboarding/step1')
  }
```

File: app/(auth)/welcome.tsx (lines 26-35)
```tsx
      <View style={styles.content}>
        <Logo size={64} />
        <Text style={[typography.caption2, styles.brand]}>TAXPILOT</Text>
        <Text style={[typography.title1, styles.headline]}>
          Save up to{'\n'}
          <Text style={[typography.display, styles.greenText]}>$4,890</Text>{'\n'}
          on taxes this year
        </Text>
        <Text style={[typography.callout, styles.subtext]}>
          We scan your bank transactions,{'\n'}
```

File: app/index.tsx (root redirect, ~5 lines)
```tsx
import { Redirect } from 'expo-router'
export default function Index() {
  // TODO: check auth state
  return <Redirect href="/(auth)/intro" />
}
```

File: app/(auth)/onboarding/step1.tsx (lines 7-35)
```tsx
const INCOME_OPTIONS = [
  { key: '1099', label: 'Self-employed income (1099)' },
  { key: 'side', label: 'Side income' },
  { key: 'W2', label: 'W-2 Salary' },
  { key: 'K1', label: 'K-1 Distribution' },
  { key: 'rental', label: 'Rental income' },
]

const ENTITY_OPTIONS = [
  { key: 'LLC', label: 'LLC (Single Member)' },
  { key: 'individual', label: 'Individual (No Entity)' },
  { key: 'S-Corp', label: 'S-Corp' },
  { key: 'partnership', label: 'Multi-member LLC / Partnership' },
]
```

### Screens (4 screens)

**Screen 1: What is TaxPilot?**
- Hero visual: 3 numbered step cards (icon + bold label + 1 sentence each)
  1. 🏦 Connect your bank — read-only, secure via Plaid
  2. 🔍 AI scans transactions — finds deductible business expenses
  3. 💰 You confirm & save — know exactly what to claim at tax time
- 2 sentences max intro text above the cards
- Glossary tooltips on: "deductible", "Plaid", "transaction"

**Screen 2: The 30-Second Journey**
- Data flow animation — 5 actors: You → Welcome Screen → Onboarding → Connect → Discovery
- Steps: user taps "Continue with Apple" → router pushes to step1 → 3 onboarding forms → Plaid connection → analysis → discovery results
- Label under each step explaining what happens

**Screen 3: What the App Asks You (and Why)**
- Code ↔ English translation of the INCOME_OPTIONS and ENTITY_OPTIONS arrays
- Left: the TypeScript arrays
- Right: "These aren't just labels — each key maps to IRS tax category codes. '1099' means you get paid without taxes withheld. 'LLC' changes how profits are taxed."
- Callout box: "💡 Aha! The onboarding questions aren't random — they determine which IRS deduction rules apply to you."

**Screen 4: Discovery — Your First Tax Report**
- Visual showing the 4 discovery scenarios (case1=all clear, case2=partial, case3=all pending, case4=no history) as 4 cards with icons
- 1 sentence each explaining when each case appears
- Quiz (3 questions, scenario style — see Interactive Elements below)

### Interactive Elements

- [x] **Data flow animation** — actors: You, Welcome Screen, Onboarding (3 steps), Connect Bank, Discovery. 7 steps showing navigation pushes. Use `router.push('/(auth)/onboarding/step1')` as the key step.
- [x] **Code↔English translation** — INCOME_OPTIONS array from step1.tsx. Right side: explain what 1099 vs W2 means for taxes in plain English.
- [x] **Quiz** — 3 questions, scenario style:
  Q1: "A user reports they never see the Discovery screen. Based on the flow you just traced, where would you look first?" Options: Connect Bank screen (correct) / Home screen / Step1 form / Report tab
  Q2: "TaxPilot asks for your entity type (LLC, S-Corp, etc.) during onboarding. Why?" Options: To personalize the logo / Because IRS deduction rules differ per entity type (correct) / To calculate state tax rates / To connect to the right bank
  Q3: "Your user sees Case 4 (No History). What does that mean technically?" Options: The bank connection failed / There are no transactions in their account history (correct) / All expenses are personal / The API is down
- [x] **Glossary tooltips** — deductible, Plaid, transaction, 1099, entity type, router, onboarding

### Reference Files to Read
- `references/interactive-elements.md` → "Message Flow / Data Flow Animation", "Multiple-Choice Quizzes", "Code ↔ English Translation Blocks", "Numbered Step Cards", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** none (this is the first)
- **Next module:** "Meet the Cast" — will introduce all files/actors by name
- **Tone/style notes:** Accent color is forest green (#2D8B55) to echo TaxPilot's emerald brand. Actor names: "You", "Router", "Onboarding", "Plaid", "Discovery". Module background: `--color-bg` (off-white).
