import { Transaction } from './transaction'

export interface TaxSettings {
  income_types: string[]
  entity_type: string
  state: string
  filing_status: string
  tax_start_year: number
  tax_region: string
  updated_at: string
}

export interface TaxSummary {
  year: number
  total_income: number
  total_deductible: number
  taxable_income: number
  estimated_tax_reduction: number
  is_zero_taxable: boolean
  pending_count: number
  note: string
}

export interface TaxReport {
  year: number
  total_income: number
  total_deductible: number
  taxable_income: number
  federal_tax: number
  federal_rate: string
  self_employment_tax: number
  se_rate: string
  state_tax: number
  state_rate: string
  state: string
  estimated_total: number
  categories: CategorySummary[]
}

export interface CategorySummary {
  name: string
  total_amount: number
  tax_savings: number
  transaction_count: number
  transactions: Transaction[]
}

export interface FilingGuideLine {
  label: string
  amount: number
}

export interface FilingGuide {
  year: number
  schedule_c: Record<string, FilingGuideLine>
  schedule_se: Record<string, FilingGuideLine>
  schedule_1: Record<string, FilingGuideLine>
}

export interface Discovery {
  case: 'case1' | 'case2' | 'case3' | 'case4'
  confirmed_amount: number
  pending_count: number
  categories: { name: string; amount: number }[]
  estimated_tax_savings: number
  tax_deadline_days: number
  has_prior_year_deductions: boolean
}
