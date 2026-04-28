export type TransactionStatus = 'pending' | 'confirmed' | 'ignored'
export type SubmitStatus = 'submitted' | 'pending_submit'
export type JudgmentSource = 'ai' | 'user'
export type Confidence = 'high' | 'medium' | 'low'

export interface TransactionCard {
  category: string
  deductible_pct: number
  deductible_amount: number
  judgment_source: JudgmentSource
  user_declaration: string | null
  irs_publication: string
  irs_description: string
  confidence: Confidence
  submit_status: SubmitStatus
  pending_changes?: {
    user_declaration: string
  }
}

export interface SuggestedBranch {
  category: string
  deductible_pct: number
  deductible_amount: number
  tax_savings: number
  irs_publication: string | null
  irs_description: string
}

export interface TransactionAccount {
  name: string
  mask: string
}

export interface Transaction {
  id: string
  merchant_name: string
  amount: number
  date: string
  source: 'plaid' | 'manual'
  status: TransactionStatus
  is_income: boolean
  plaid_transaction_id?: string
  account?: TransactionAccount
  card?: TransactionCard | null
  suggested_branches?: SuggestedBranch[]
}
