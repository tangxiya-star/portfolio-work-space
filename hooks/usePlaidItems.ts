import { useQuery } from '@tanstack/react-query'
import type { PlaidItem } from '../types/api'

// TODO: Switch to real API when backend is ready
import { mockPlaidItems } from '../mocks/data'

export function usePlaidItems() {
  return useQuery({
    queryKey: ['plaid-items'],
    queryFn: async () => {
      // return api.get<{ items: PlaidItem[] }>('/plaid/items')
      return mockPlaidItems
    },
    staleTime: 60 * 1000,
  })
}
