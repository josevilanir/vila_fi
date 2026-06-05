import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from './themeStore'

beforeEach(() => {
  useThemeStore.setState({ isDarkMode: false })
})

describe('themeStore', () => {
  it('starts with isDarkMode = false', () => {
    expect(useThemeStore.getState().isDarkMode).toBe(false)
  })

  it('toggleTheme flips to dark mode', () => {
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().isDarkMode).toBe(true)
  })

  it('toggleTheme flips back to light mode', () => {
    useThemeStore.setState({ isDarkMode: true })
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().isDarkMode).toBe(false)
  })
})
