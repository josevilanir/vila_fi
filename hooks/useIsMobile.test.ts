import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './useIsMobile'

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = []
  const mq = {
    matches,
    addEventListener: vi.fn((_: string, fn: (e: { matches: boolean }) => void) => listeners.push(fn)),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    // helper to simulate media query change
    _trigger: (m: boolean) => listeners.forEach((fn) => fn({ matches: m })),
  }
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mq))
  return mq
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useIsMobile', () => {
  it('returns false when the media query does not match', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when the media query matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('updates when the media query fires a change event', async () => {
    const mq = mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => mq._trigger(true))
    expect(result.current).toBe(true)
  })

  it('uses the breakpoint argument to build the media query string', () => {
    const mqFn = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    vi.stubGlobal('matchMedia', mqFn)
    renderHook(() => useIsMobile(1024))
    expect(mqFn).toHaveBeenCalledWith('(max-width: 1023px)')
  })

  it('removes the event listener on unmount', () => {
    const mq = mockMatchMedia(false)
    const { unmount } = renderHook(() => useIsMobile())
    unmount()
    expect(mq.removeEventListener).toHaveBeenCalled()
  })
})
