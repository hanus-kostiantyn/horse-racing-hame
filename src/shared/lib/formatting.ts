/**
 * Formatting utilities for the application
 */

/**
 * Format position display with leading zeros
 * @param position - Position number
 * @returns Formatted position string
 */
export function formatPosition(position: number): string {
  return position.toString().padStart(2, '0')
}

/**
 * Format number as ordinal (1st, 2nd, 3rd, etc.)
 * @param num - Number to format
 * @returns Ordinal string
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0] || 'th')
}