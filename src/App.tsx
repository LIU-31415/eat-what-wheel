import { useState, useCallback } from 'react'
import { Wheel } from './components/Wheel'
import { ResultModal } from './components/ResultModal'
import { AddFoodForm } from './components/AddFoodForm'
import { FoodList } from './components/FoodList'
import { useFoods } from './hooks/useFoods'
import type { FoodItem } from './types'

function App() {
  const { foods, addFood, removeFood, editFood } = useFoods()
  const [result, setResult] = useState<FoodItem | null>(null)
  const [resultIndex, setResultIndex] = useState(0)

  const handleResult = useCallback((item: FoodItem) => {
    setResultIndex(foods.findIndex(f => f.id === item.id))
    setResult(item)
  }, [foods])

  const handleClose = useCallback(() => {
    setResult(null)
  }, [])

  return (
    <div className="app-bg flex flex-col items-center px-4 pb-8 min-h-dvh">
      {/* Header */}
      <header className="pt-6 pb-2 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white/90 tracking-wider">
          今天吃啥
        </h1>
        <p className="text-white/30 text-xs mt-1 tracking-widest">
          WHAT TO EAT TODAY
        </p>
      </header>

      {/* Wheel section */}
      <section className="w-full max-w-md flex flex-col items-center my-2">
        <Wheel items={foods} onResult={handleResult} />
      </section>

      {/* Management section */}
      <section className="w-full max-w-md mt-2 space-y-4">
        <AddFoodForm onAdd={addFood} />

        <div className="flex items-center justify-between px-1">
          <h3 className="text-white/50 text-xs tracking-wider">
            美食清单
          </h3>
          <span className="text-white/30 text-xs">
            {foods.length} 项
          </span>
        </div>

        <FoodList
          items={foods}
          onRemove={removeFood}
          onEdit={editFood}
        />

        {foods.length === 0 && (
          <div className="text-center py-4">
            <p className="text-white/20 text-xs">
              试试加入：老麻抄手、酸菜鱼、螺蛳粉、椰子鸡...
            </p>
          </div>
        )}
      </section>

      {/* Result modal */}
      {result && (
        <ResultModal
          item={result}
          index={resultIndex}
          total={foods.length}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

export default App
