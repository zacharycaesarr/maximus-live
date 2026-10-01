/**
 * Homepage semantic colors — ONE source of truth for the home shell.
 * Page scroll BG reads these for color stops; it does not own a palette.
 * Service-card artwork keeps its own lab tokens.
 */

import type { CSSProperties } from 'react'

export const HOME_COLORS_STORAGE_KEY = 'mr-v3-home-colors-v2'

export const defaultHomeColors = {
  bgLight: '#F3F0E8',
  bgDark: '#080909',
  surfaceLight: '#F8F5EE',
  surfaceDark: '#11120E',
  textOnLight: '#080909',
  textOnDark: '#F3F0E8',
  muted: '#786F63',
  line: '#D8D0C3',
  acid: '#C8FF3D',
} as const

/** Extreme colors so each role is obvious while testing wiring. */
export const testRoutingHomeColors = {
  bgLight: '#FF4FA3',
  bgDark: '#1B4DFF',
  surfaceLight: '#FFE600',
  surfaceDark: '#00A86B',
  textOnLight: '#E10600',
  textOnDark: '#00F0FF',
  muted: '#FF8C00',
  line: '#A020F0',
  acid: '#BFFF00',
} as const

export type HomeColors = {
  bgLight: string
  bgDark: string
  surfaceLight: string
  surfaceDark: string
  textOnLight: string
  textOnDark: string
  muted: string
  line: string
  acid: string
}

/** "R G B" channels so Tailwind opacity modifiers (bg-home-line/40) work. */
export function hexToRgbChannels(hex: string): string {
  const raw = hex.trim().replace('#', '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (full.length !== 6) return '0 0 0'
  const n = Number.parseInt(full, 16)
  if (Number.isNaN(n)) return '0 0 0'
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

export function loadHomeColors(): HomeColors {
  try {
    const raw = localStorage.getItem(HOME_COLORS_STORAGE_KEY)
    if (!raw) return { ...defaultHomeColors }
    return { ...defaultHomeColors, ...JSON.parse(raw) }
  } catch {
    return { ...defaultHomeColors }
  }
}

/** CSS custom properties for the homepage root wrapper. */
export function homeColorsToStyle(colors: HomeColors): CSSProperties {
  return {
    ['--home-bg-light' as string]: colors.bgLight,
    ['--home-bg-dark' as string]: colors.bgDark,
    ['--home-surface-light' as string]: colors.surfaceLight,
    ['--home-surface-dark' as string]: colors.surfaceDark,
    ['--home-text-light' as string]: colors.textOnLight,
    ['--home-text-dark' as string]: colors.textOnDark,
    ['--home-muted' as string]: colors.muted,
    ['--home-line' as string]: colors.line,
    ['--home-acid' as string]: colors.acid,
    // Channel twins for Tailwind /alpha utilities
    ['--home-bg-light-rgb' as string]: hexToRgbChannels(colors.bgLight),
    ['--home-bg-dark-rgb' as string]: hexToRgbChannels(colors.bgDark),
    ['--home-surface-light-rgb' as string]: hexToRgbChannels(colors.surfaceLight),
    ['--home-surface-dark-rgb' as string]: hexToRgbChannels(colors.surfaceDark),
    ['--home-text-light-rgb' as string]: hexToRgbChannels(colors.textOnLight),
    ['--home-text-dark-rgb' as string]: hexToRgbChannels(colors.textOnDark),
    ['--home-muted-rgb' as string]: hexToRgbChannels(colors.muted),
    ['--home-line-rgb' as string]: hexToRgbChannels(colors.line),
    ['--home-acid-rgb' as string]: hexToRgbChannels(colors.acid),
  }
}

export function persistHomeColors(colors: HomeColors) {
  try {
    localStorage.setItem(HOME_COLORS_STORAGE_KEY, JSON.stringify(colors))
  } catch {
    /* ignore */
  }
}
