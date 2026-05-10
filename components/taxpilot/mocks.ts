/**
 * TaxPilot — Mock Data
 * Last updated: 2026-03-23 v1.0
 *
 * Usage:
 * 1. In services/api.ts, use this mock data in place of real API calls
 * 2. Once backend is live, swap to real fetch — page code stays unchanged
 * 3. All data formats match the API docs exactly
 */

// ─────────────────────────────────────────
// 1. Auth
// ─────────────────────────────────────────

export const mockAuthResponse = {
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock",
  refresh_token: "mock_refresh_token_abc123",
  is_new_user: false
}

export const mockUser = {
  id: "usr_01HV3K9XMQP8N2J7T5R6W4B",
  email: "evan@hawky.co",
  subscription_status: "active",
  trial_ends_at: null,
  created_at: "2026-01-15T10:00:00Z"
}

// ─────────────────────────────────────────
// 2. Tax Settings
// ─────────────────────────────────────────

export const mockTaxSettings = {
  income_types: ["1099", "side"],
  entity_type: "LLC",
  state: "CA",
  filing_status: "single",
  tax_start_year: 2024,
  tax_region: "US",
  updated_at: "2026-03-01T10:00:00Z"
}

// ─────────────────────────────────────────
// 3. Plaid Bank Accounts
// ─────────────────────────────────────────

export const mockPlaidItems = {
  items: [
    {
      item_id: "item_01HV3K9CHASE001",
      institution_name: "Chase",
      status: "active",
      last_synced_at: "2026-03-23T08:00:00Z",
      primary_color: "#117ACA",
      accounts: [
        {
          account_id: "acc_chase_checking",
          name: "Chase Checking",
          type: "depository",
          subtype: "checking",
          mask: "2847",
          network: "visa"
        }
      ]
    },
    {
      item_id: "item_01HV3K9CHASE003",
      institution_name: "Chase",
      status: "active",
      last_synced_at: "2026-03-23T08:00:00Z",
      primary_color: "#2B3A67",
      accounts: [
        {
          account_id: "acc_chase_sapphire",
          name: "Chase Sapphire",
          type: "credit",
          subtype: "credit card",
          mask: "4821",
          network: "visa"
        }
      ]
    },
    {
      item_id: "item_01HV3K9CHASE002",
      institution_name: "Chase",
      status: "reauth_required",
      last_synced_at: "2026-03-10T08:00:00Z",
      primary_color: "#1A4D2E",
      accounts: [
        {
          account_id: "acc_business_checking",
          name: "Business Checking",
          type: "depository",
          subtype: "checking",
          mask: "9021",
          network: "mastercard"
        }
      ]
    }
  ]
}

export const mockSyncStatus = {
  status: "complete",
  accounts_connected: 3,
  transactions_processed: 1240,
  transactions_total: 1240,
  current_step: "Done"
}

// ─────────────────────────────────────────
// 4. Discovery
// ─────────────────────────────────────────

// Case 1: All clear — everything confirmed, no pending
export const mockDiscoveryAllClear = {
  case: "case1",
  confirmed_amount: 6240.00,
  pending_count: 0,
  categories: [
    { name: "Software", amount: 1840.00 },
    { name: "Travel", amount: 2100.00 },
    { name: "Meals", amount: 1560.00 },
    { name: "Office", amount: 740.00 },
  ],
  estimated_tax_savings: 1680.00,
  tax_deadline_days: 24,
  has_prior_year_deductions: true
}

// Case 2: Partial clear + partial ambiguous (most common)
export const mockDiscovery = {
  case: "case2",
  confirmed_amount: 3840.00,
  pending_count: 23,
  categories: [
    { name: "Software", amount: 1240.00 },
    { name: "Travel", amount: 2100.00 },
    { name: "Office", amount: 500.00 }
  ],
  estimated_tax_savings: 1680.00,
  tax_deadline_days: 24,
  has_prior_year_deductions: true
}

// Case 3: All ambiguous
export const mockDiscoveryAllPending = {
  case: "case3",
  confirmed_amount: 0,
  pending_count: 47,
  categories: [],
  estimated_tax_savings: 0,
  tax_deadline_days: 24,
  has_prior_year_deductions: true
}

// Case 4: No history
export const mockDiscoveryNoHistory = {
  case: "case4",
  confirmed_amount: 0,
  pending_count: 0,
  categories: [],
  estimated_tax_savings: 0,
  tax_deadline_days: 24,
  has_prior_year_deductions: false
}

// ─────────────────────────────────────────
// 5. Transactions
// ─────────────────────────────────────────

export type TransactionStatus = "pending" | "confirmed" | "ignored"
export type SubmitStatus = "submitted" | "pending_submit"
export type JudgmentSource = "ai" | "user"
export type Confidence = "high" | "medium" | "low"

export const mockTransactions = {
  transactions: [
    // Confirmed — AI classified
    {
      id: "txn_01HV3AWS001",
      merchant_name: "AWS",
      amount: -243.67,
      date: "2026-03-15",
      source: "plaid",
      status: "confirmed",
      is_income: false,
      plaid_transaction_id: "plaid_txn_def456",
      account: { name: "Chase Checking", mask: "2847" },
      card: {
        category: "Software",
        deductible_pct: 100,
        deductible_amount: 243.67,
        judgment_source: "ai",
        user_declaration: null,
        irs_publication: "Pub 535",
        irs_description: "ordinary and necessary business expense",
        confidence: "high",
        submit_status: "submitted"
      }
    },
    // Pending — AI returned multiple branches
    {
      id: "txn_01HV3SFO001",
      merchant_name: "SFO Airport Parking",
      amount: -45.00,
      date: "2026-03-12",
      source: "plaid",
      status: "pending",
      is_income: false,
      plaid_transaction_id: "plaid_txn_ghi789",
      account: { name: "Chase Sapphire", mask: "4821" },
      card: null,
      suggested_branches: [
        {
          category: "Travel",
          deductible_pct: 100,
          deductible_amount: 45.00,
          tax_savings: 10.80,
          irs_publication: "Pub 463",
          irs_description: "Business travel parking — 100% deductible"
        },
        {
          category: "Personal",
          deductible_pct: 0,
          deductible_amount: 0,
          tax_savings: 0,
          irs_publication: null,
          irs_description: "Personal expense — not deductible"
        }
      ]
    },
    // Confirmed — user declared (modified, not yet submitted)
    {
      id: "txn_01HV3NOBU001",
      merchant_name: "Nobu Restaurant",
      amount: -280.00,
      date: "2026-03-14",
      source: "plaid",
      status: "confirmed",
      is_income: false,
      plaid_transaction_id: "plaid_txn_abc123",
      account: { name: "Chase Sapphire", mask: "4821" },
      card: {
        category: "Meals",
        deductible_pct: 50,
        deductible_amount: 140.00,
        judgment_source: "user",
        user_declaration: "Client dinner discussing Q2 contract renewal",
        irs_publication: "Pub 463",
        irs_description: "Business meals — 50% deductible",
        confidence: "high",
        submit_status: "pending_submit",
        pending_changes: {
          user_declaration: "Q2 contract renewal client dinner"
        }
      }
    },
    // Income
    {
      id: "txn_01HV3STRIPE001",
      merchant_name: "Stripe",
      amount: 3200.00,
      date: "2026-03-10",
      source: "plaid",
      status: "confirmed",
      is_income: true,
      plaid_transaction_id: "plaid_txn_jkl012",
      account: { name: "Chase Checking", mask: "2847" },
      card: null
    },
    // Notion subscription
    {
      id: "txn_01HV3NOTION001",
      merchant_name: "Notion",
      amount: -16.00,
      date: "2026-03-10",
      source: "plaid",
      status: "confirmed",
      is_income: false,
      plaid_transaction_id: "plaid_txn_mno345",
      account: { name: "Chase Checking", mask: "2847" },
      card: {
        category: "Software",
        deductible_pct: 100,
        deductible_amount: 16.00,
        judgment_source: "ai",
        user_declaration: null,
        irs_publication: "Pub 535",
        irs_description: "ordinary and necessary business expense",
        confidence: "high",
        submit_status: "submitted"
      }
    }
  ],
  next_cursor: null
}

// By category (savings page)
export const mockTransactionsByCategory = {
  year: 2026,
  categories: [
    {
      name: "Software",
      total_amount: 1240.00,
      tax_savings: 297.60,
      transaction_count: 12,
      transactions: [
        mockTransactions.transactions[0],  // AWS
        mockTransactions.transactions[4],  // Notion
      ]
    },
    {
      name: "Travel",
      total_amount: 3400.00,
      tax_savings: 816.00,
      transaction_count: 8,
      transactions: []
    },
    {
      name: "Meals",
      total_amount: 2100.00,
      tax_savings: 504.00,
      transaction_count: 15,
      transactions: [
        mockTransactions.transactions[2],  // Nobu
      ]
    },
    {
      name: "Pending",
      total_amount: 0,
      tax_savings: 0,
      transaction_count: 23,
      transactions: [
        mockTransactions.transactions[1],  // SFO Parking
      ]
    }
  ]
}

// By date (calendar page, Mar 14)
export const mockTransactionsByDate = {
  transactions: [
    mockTransactions.transactions[2],  // Nobu
    mockTransactions.transactions[0],  // AWS
    mockTransactions.transactions[3],  // Stripe
  ]
}

// ─────────────────────────────────────────
// 6. Manual Income
// ─────────────────────────────────────────

export const mockManualIncome = {
  records: [
    {
      id: "inc_01HV3K1001",
      income_type: "k1",
      source_name: "Hawky LLC",
      tax_year: 2025,
      ordinary_income: 84200.00,
      rental_income: null,
      interest_income: null,
      capital_gains: null,
      other_income: null,
      total_income: 84200.00,
      created_at: "2026-03-01T10:00:00Z"
    }
  ]
}

// ─────────────────────────────────────────
// 7. Tax Calculation
// ─────────────────────────────────────────

export const mockTaxSummary = {
  year: 2026,
  total_income: 84200.00,
  total_deductible: 18640.00,
  taxable_income: 65560.00,
  estimated_tax_reduction: 4890.00,
  is_zero_taxable: false,
  pending_count: 3,
  note: "Based on this year's recorded income · Updates in real time"
}

// Edge case: expenses exceed income
export const mockTaxSummaryZero = {
  year: 2026,
  total_income: 3000.00,
  total_deductible: 6240.00,
  taxable_income: 0,
  estimated_tax_reduction: 0,
  is_zero_taxable: true,
  pending_count: 0,
  note: "Expenses exceed income — no taxable income this year"
}

export const mockTaxSummaryByYear: Record<number, typeof mockTaxSummary> = {
  2026: mockTaxSummary,
  2025: { ...mockTaxSummary, year: 2025, total_income: 72000, total_deductible: 15200, taxable_income: 56800, estimated_tax_reduction: 3980, pending_count: 0 },
  2024: { ...mockTaxSummary, year: 2024, total_income: 61500, total_deductible: 12800, taxable_income: 48700, estimated_tax_reduction: 3350, pending_count: 0 },
}

export const mockTaxReport = {
  year: 2026,
  total_income: 84200.00,
  total_deductible: 18640.00,
  taxable_income: 65560.00,
  federal_tax: 14423.00,
  federal_rate: "22%",
  self_employment_tax: 10031.00,
  se_rate: "15.3%",
  state_tax: 6097.00,
  state_rate: "9.3%",
  state: "CA",
  estimated_total: 30551.00,
  categories: mockTransactionsByCategory.categories
}

export const mockTaxReportByYear: Record<number, typeof mockTaxReport> = {
  2026: mockTaxReport,
  2025: { ...mockTaxReport, year: 2025, total_income: 72000, total_deductible: 15200, taxable_income: 56800, federal_tax: 11490, self_employment_tax: 8690, state_tax: 5282, estimated_total: 25462 },
  2024: { ...mockTaxReport, year: 2024, total_income: 61500, total_deductible: 12800, taxable_income: 48700, federal_tax: 9500, self_employment_tax: 7450, state_tax: 4529, estimated_total: 21479 },
}

export const mockFilingGuide = {
  year: 2026,
  schedule_c: {
    line_27_other_expenses: {
      label: "Software & Cloud Services",
      amount: 1240.00
    },
    line_24a_travel: {
      label: "Business Travel",
      amount: 3400.00
    },
    line_24b_meals: {
      label: "Business Meals (50% applied)",
      amount: 1050.00
    }
  },
  schedule_se: {
    net_self_employment: {
      label: "Net Self-Employment Income",
      amount: 65560.00
    }
  },
  schedule_1: {
    line_17_se_deduction: {
      label: "SE Tax Deduction",
      amount: 5016.00
    }
  }
}

// ─────────────────────────────────────────
// 8. Usage in services/api.ts
// ─────────────────────────────────────────
//
// Dev phase (mock data):
//
// import { mockTaxSummary } from '../mocks'
//
// export async function getTaxSummary(year: number) {
//   // TODO: replace with real request
//   return mockTaxSummary
// }
//
// After backend is live:
//
// export async function getTaxSummary(year: number) {
//   return api.get<TaxSummary>(`/tax/summary?year=${year}`)
// }
//
// Page components need zero changes.
