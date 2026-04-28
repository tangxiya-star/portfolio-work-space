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
