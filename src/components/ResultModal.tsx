import type { FoodItem } from '../types'
import { getWheelColor } from '../utils/colors'

interface ResultModalProps {
  item: FoodItem
  index: number
  total: number
  onClose: () => void
}

export function ResultModal({ item, index, total, onClose }: ResultModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Result card */}
      <div
        className="relative glass-strong rounded-3xl p-8 mx-6 max-w-sm w-full text-center animate-bounce-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Color accent bar */}
        <div
          className="w-16 h-1.5 rounded-full mx-auto mb-6"
          style={{ background: getWheelColor(index) }}
        />

        <p className="text-white/60 text-sm tracking-widest uppercase">
          今天就吃
        </p>

        <h2 className="text-3xl font-bold text-white mt-3 mb-2 leading-tight">
          {item.name}
        </h2>

        <p className="text-white/40 text-xs">
          {total} 项选择中抽中
        </p>

        {/* Decorative confetti dots */}
        <div className="flex justify-center gap-2 mt-6 mb-8">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-confetti"
              style={{
                background: getWheelColor(index + i),
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="glass hover:bg-white/20 text-white font-medium px-8 py-3 rounded-full transition-all duration-200 active:scale-95 w-full"
        >
          再来一次
        </button>
      </div>
    </div>
  )
}
