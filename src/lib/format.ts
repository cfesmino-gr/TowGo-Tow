export function formatPeso(value: number): string {
  return `\u20B1${new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  }).format(value)}`
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function estimateFare(base: number, distanceKm: number): number {
  const rounded = Math.round((base + distanceKm * 220) / 50) * 50
  return Math.max(base, rounded)
}
