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
