export const WHEEL_COLORS = [
  '#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C',
  '#4DABF7', '#748FFC', '#DA77F2', '#F783AC',
  '#20C997', '#9775FA', '#FF8787', '#FCC419',
  '#38D9A9', '#4C6EF5', '#E8590C', '#7048E8',
  '#0CA678', '#4263EB', '#D6336C', '#F76707',
]

export function getWheelColor(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length]
}
