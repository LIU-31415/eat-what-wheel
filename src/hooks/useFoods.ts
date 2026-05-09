import { useState, useEffect, useCallback } from 'react'
import type { FoodItem } from '../types'
import { loadItems, saveItems } from '../utils/storage'

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>(() => loadItems())

  useEffect(() => {
    saveItems(foods)
  }, [foods])

  const addFood = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setFoods(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmed, createdAt: Date.now() },
    ])
  }, [])

  const removeFood = useCallback((id: string) => {
    setFoods(prev => prev.filter(f => f.id !== id))
  }, [])

  const editFood = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setFoods(prev => prev.map(f => (f.id === id ? { ...f, name: trimmed } : f)))
  }, [])

  return { foods, addFood, removeFood, editFood }
}
