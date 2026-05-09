import { useRef, useEffect, useCallback, useState } from 'react'
import type { FoodItem } from '../types'
import { getWheelColor } from '../utils/colors'

interface WheelProps {
  items: FoodItem[]
  onResult: (item: FoodItem) => void
}

export function Wheel({ items, onResult }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)
  const isSpinningRef = useRef(false)
  const animFrameRef = useRef<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [canvasSize, setCanvasSize] = useState(320)

  // Responsive canvas size
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 320
      setCanvasSize(Math.min(w, 400))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const draw = useCallback((rotationDeg: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const displaySize = canvasSize
    canvas.width = displaySize * dpr
    canvas.height = displaySize * dpr
    canvas.style.width = `${displaySize}px`
    canvas.style.height = `${displaySize}px`
    ctx.scale(dpr, dpr)

    const cx = displaySize / 2
    const cy = displaySize / 2
    const radius = displaySize / 2 - 12
    const n = items.length

    if (n === 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 2
      ctx.stroke()
      return
    }

    const arc = (Math.PI * 2) / n
    const rotationRad = (rotationDeg * Math.PI) / 180

    // Draw segments
    for (let i = 0; i < n; i++) {
      const start = i * arc + rotationRad
      const end = start + arc

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, start, end)
      ctx.closePath()
      ctx.fillStyle = getWheelColor(i)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + arc / 2)

      const fontSize = Math.max(11, Math.min(15, 180 / n))
      ctx.font = `bold ${fontSize}px -apple-system, sans-serif`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#fff'
      ctx.shadowColor = 'rgba(0,0,0,0.4)'
      ctx.shadowBlur = 3

      const text = items[i].name
      const maxWidth = radius - 24
      if (ctx.measureText(text).width > maxWidth) {
        let truncated = text
        while (ctx.measureText(truncated + '…').width > maxWidth && truncated.length > 1) {
          truncated = truncated.slice(0, -1)
        }
        ctx.fillText(truncated + '…', radius - 12, 0)
      } else {
        ctx.fillText(text, radius - 12, 0)
      }
      ctx.restore()
    }

    // Inner circle
    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Dots on outer ring
    for (let i = 0; i < n; i++) {
      const angle = i * arc + rotationRad + arc / 2
      const dotX = cx + Math.cos(angle) * (radius + 6)
      const dotY = cy + Math.sin(angle) * (radius + 6)
      ctx.beginPath()
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fill()
    }
  }, [items, canvasSize])

  // Redraw on items change
  useEffect(() => {
    draw(rotationRef.current)
  }, [draw])

  const spin = useCallback(() => {
    if (items.length < 2 || isSpinningRef.current) return

    isSpinningRef.current = true
    setIsSpinning(true)

    const extraRotations = 5 + Math.random() * 3
    const targetAngle = extraRotations * 360 + Math.random() * 360
    const startRotation = rotationRef.current
    const endRotation = startRotation + targetAngle
    const duration = 4000 + Math.random() * 1000
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      rotationRef.current = startRotation + targetAngle * eased
      draw(rotationRef.current)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Determine result
        const arc = (Math.PI * 2) / items.length
        const pointerAngle = (Math.PI * 3) / 2 - (endRotation * Math.PI) / 180
        const normalized = ((pointerAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        const resultIndex = Math.min(
          Math.floor(normalized / arc),
          items.length - 1,
        )
        onResult(items[resultIndex])
        isSpinningRef.current = false
        setIsSpinning(false)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }, [items, draw, onResult])

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const canSpin = items.length >= 2 && !isSpinning

  return (
    <div ref={containerRef} className="relative flex flex-col items-center no-select">
      {/* Pointer */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10" style={{ marginTop: '-2px' }}>
          <svg width="28" height="24" viewBox="0 0 28 24">
            <defs>
              <filter id="pointer-shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
              </filter>
            </defs>
            <polygon
              points="14,22 2,2 26,2"
              fill="#fff"
              filter="url(#pointer-shadow)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <canvas
          ref={canvasRef}
          className="rounded-full"
          style={{ width: canvasSize, height: canvasSize }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={!canSpin}
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
          w-14 h-14 rounded-full
          font-bold text-lg
          transition-all duration-200
          ${canSpin
            ? 'glass-strong text-white cursor-pointer hover:scale-110 active:scale-95'
            : 'bg-white/5 text-white/30 cursor-not-allowed'
          }
        `}
      >
        {isSpinning ? (
          <svg className="animate-spin mx-auto" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        ) : 'GO'}
      </button>

      {/* Hint text */}
      <p className="text-white/40 text-sm mt-3 transition-opacity duration-300">
        {items.length === 0
          ? '↓ 添加你想吃的东西吧'
          : items.length === 1
            ? '再添一个才能转哦'
            : `点击 GO 转一转 (共 ${items.length} 项)`}
      </p>
    </div>
  )
}
