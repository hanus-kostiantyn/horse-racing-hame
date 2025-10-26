/**
 * Game configuration constants
 */
export const GAME_CONFIG = {
  /** Total number of horses in the game */
  TOTAL_HORSES: 20,
  /** Number of horses per race */
  HORSES_PER_RACE: 10,
  /** Total number of rounds */
  TOTAL_ROUNDS: 6,
  /** Race distances in meters for each round */
  RACE_DISTANCES: [1200, 1400, 1600, 1800, 2000, 2200] as const,
  /** Minimum condition value for a horse */
  MIN_CONDITION: 60,
  /** Maximum condition value for a horse */
  MAX_CONDITION: 100,
} as const

/**
 * Horse name pool for random generation
 */
export const HORSE_NAMES = [
  'Thunder Bolt', 'Lightning Strike', 'Wind Runner', 'Storm Chaser',
  'Midnight Star', 'Golden Arrow', 'Silver Dream', 'Fire Dancer',
  'Ocean Wave', 'Mountain King', 'Desert Rose', 'Arctic Fox',
  'Crimson Glory', 'Emerald Isle', 'Diamond Dust', 'Shadow Walker',
  'Sun Burst', 'Moon Beam', 'Star Gazer', 'Cloud Jumper',
  'Iron Will', 'Brave Heart', 'Swift Arrow', 'Noble Spirit',
  'Wild Fire', 'Ice Crystal', 'Ruby Red', 'Sapphire Blue',
  'Jade Emperor', 'Pearl Diver', 'Gold Rush', 'Silver Lining',
  'Bronze Age', 'Copper King', 'Steel Runner', 'Titanium Force',
  'Velocity Max', 'Speed Demon', 'Quick Silver', 'Flash Forward',
] as const

/**
 * Horse colors
 */
export const HORSE_COLORS = [
  '#DC143C',
  '#4169E1',
  '#FFD700',
  '#32CD32',
  '#FF69B4',
  '#8A2BE2',
  '#FF8C00',
  '#20B2AA',
  '#FF1493',
  '#00CED1',
  '#9370DB',
  '#FF6347',
  '#48D1CC',
  '#DA70D6',
  '#F0E68C',
  '#6495ED',
  '#FF7F50',
  '#40E0D0',
  '#EE82EE',
  '#98FB98',
] as const

/**
 * Race mechanics configuration
 */
export const RACE_MECHANICS = {
  /** Base speed multiplier - % per second at max condition */
  BASE_SPEED_MULTIPLIER: 30,
  /** Speed variation range - ± percentage */
  SPEED_VARIATION_RANGE: 5,
} as const

/**
 * Track layout configuration
 */
export const TRACK_LAYOUT = {
  /** Start line offset from left (percentage) */
  START_LINE_OFFSET: 5,
  /** Usable track width multiplier */
  TRACK_WIDTH_MULTIPLIER: 0.9,
} as const