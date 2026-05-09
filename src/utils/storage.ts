import type { FoodItem } from '../types'

const STORAGE_KEY = 'eat-what-wheel-items'

export function loadItems(): FoodItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is FoodItem =>
      typeof item === 'object' && item !== null &&
      typeof item.id === 'string' &&
      typeof item.name === 'string'
    )
  } catch {
    return []
  }
}

export function saveItems(items: FoodItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or unavailable — silently ignore
  }
}
