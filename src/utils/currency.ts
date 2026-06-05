export function formatLAK(amount: number | null | undefined): string {
  if (amount == null) return '-'
  return new Intl.NumberFormat('lo-LA').format(Math.round(amount)) + ' ກີບ'
}

// Short form for chart axes
export function formatLAKShort(amount: number): string {
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M'
  if (amount >= 1_000) return (amount / 1_000).toFixed(0) + 'K'
  return String(Math.round(amount))
}

// Number only — for columns where header already says LAK
export function formatNumber(amount: number | null | undefined): string {
  if (amount == null) return '-'
  return new Intl.NumberFormat('lo-LA').format(Math.round(amount))
}
