import { api } from './api'

export const plaidService = {
  async createLinkToken(mode: 'create' | 'update', itemId?: string) {
    return api.post<{ link_token: string }>('/plaid/create-link-token', {
      mode,
      ...(itemId ? { item_id: itemId } : {}),
    })
  },

  async exchangeToken(publicToken: string, institutionName: string) {
    return api.post('/plaid/exchange-token', {
      public_token: publicToken,
      institution_name: institutionName,
    })
  },

  async getSyncStatus() {
    return api.get<{
      status: 'processing' | 'complete'
      accounts_connected: number
      transactions_processed: number
      transactions_total: number
      current_step: string
    }>('/plaid/sync-status')
  },
}
