import { useState } from 'react'
import { router } from 'expo-router'

export function useOnboardingStep1() {
  const [selectedIncome, setSelectedIncome] = useState<string[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null)

  const toggleIncome = (key: string) => {
    setSelectedIncome((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const isValid = selectedIncome.length > 0 && selectedEntity !== null && selectedOccupation !== null

  const handleContinue = () => {
    // TODO: Save to local state / API
    router.push('/(auth)/onboarding/step2')
  }

  return {
    selectedIncome,
    selectedEntity,
    selectedOccupation,
    isValid,
    toggleIncome,
    setSelectedEntity,
    setSelectedOccupation,
    handleContinue,
  }
}
