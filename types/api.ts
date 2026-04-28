export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface AuthResponse {
  access_token: string
  refresh_token: string
  is_new_user: boolean
}

export interface User {
  id: string
  email: string
  subscription_status: 'active' | 'trial' | 'expired'
  trial_ends_at: string | null
  created_at: string
}

export interface PlaidItem {
  item_id: string
  institution_name: string
  status: 'active' | 'reauth_required' | 'paused'
  last_synced_at: string
  accounts: PlaidAccount[]
}

export interface PlaidAccount {
  account_id: string
  name: string
  type: string
  subtype: string
  mask: string
}

export interface SyncStatus {
  status: 'processing' | 'complete'
  accounts_connected: number
  transactions_processed: number
  transactions_total: number
  current_step: string
}
