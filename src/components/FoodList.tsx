import { useState } from 'react'
import type { FoodItem } from '../types'
import { getWheelColor } from '../utils/colors'

interface FoodListProps {
  items: FoodItem[]
  onRemove: (id: string) => void
  onEdit: (id: string, name: string) => void
}

export function FoodList({ items, onRemove, onEdit }: FoodListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const startEdit = (item: FoodItem) => {
    setEditingId(item.id)
    setEditText(item.name)
  }

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onEdit(editingId, editText.trim())
    }
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') setEditingId(null)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/30 text-sm">还没有加入任何东西</p>
        <p className="text-white/20 text-xs mt-1">在上方输入店名或菜名开始</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="glass rounded-xl px-4 py-3 flex items-center gap-3 group transition-all duration-200 hover:bg-white/10"
        >
          {/* Color dot */}
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: getWheelColor(index) }}
          />

          {/* Name / Edit input */}
          {editingId === item.id ? (
            <input
              className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/30 py-0.5"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span
              className="flex-1 text-white/80 text-sm truncate cursor-pointer"
              onClick={() => startEdit(item)}
              title="点击编辑"
            >
              {item.name}
            </span>
          )}

          {/* Action buttons */}
          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => startEdit(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
              title="编辑"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/10 transition-all"
              title="删除"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
