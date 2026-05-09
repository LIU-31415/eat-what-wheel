import { useState, useRef } from 'react'

interface AddFoodFormProps {
  onAdd: (name: string) => void
}

export function AddFoodForm({ onAdd }: AddFoodFormProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="输入店名或菜名..."
        maxLength={30}
        className="flex-1 glass rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none transition-all duration-200 focus:bg-white/12 focus:border-white/25 border border-transparent"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className={`
          px-5 rounded-xl font-medium text-sm transition-all duration-200 shrink-0
          ${value.trim()
            ? 'glass-strong text-white cursor-pointer hover:scale-105 active:scale-95'
            : 'bg-white/5 text-white/20 cursor-not-allowed'
          }
        `}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </form>
  )
}
