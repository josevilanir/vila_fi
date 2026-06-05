import { test, expect } from '@playwright/test'

/**
 * Flow 3 — Pomodoro Timer
 *
 * Verifies the Pomodoro timer widget on /app (desktop breakpoint):
 *   - Opening the timer via the header button
 *   - Start / Pause controls
 *   - Reset restores the full duration
 *   - Skip advances the mode (focus → short_break → … → long_break)
 *   - Closing the timer hides it
 *
 * Audio / video APIs are stubbed so tests never need media permissions.
 *
 * Note on title selectors: Playwright's getByTitle() does substring matching
 * by default, so we always pass { exact: true } to avoid "Reiniciar"
 * accidentally matching a search for "Iniciar".
 */

test.describe('Pomodoro Timer', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    // Stub Howler so audio never tries to play in headless Chromium
    await page.addInitScript(() => {
      ;(window as unknown as Record<string, unknown>).Howl = class {
        play() {}
        stop() {}
        pause() {}
        volume() {}
        on() {}
      }
      ;(window as unknown as Record<string, unknown>).Howler = { volume() {} }
    })

    // Abort YouTube / Google Video requests (not available in test network)
    await page.route('**youtube**', (route) => route.abort())
    await page.route('**googlevideo**', (route) => route.abort())

    await page.goto('/app')
    await page.waitForLoadState('networkidle')
  })

  // ── helper ──────────────────────────────────────────────────────────────────

  async function openTimer(page: import('@playwright/test').Page) {
    await page.getByRole('button', { name: 'Pomodoro' }).click()
    await expect(page.getByText('25:00')).toBeVisible({ timeout: 5000 })
  }

  // ── tests ────────────────────────────────────────────────────────────────────

  test('the Pomodoro button is visible on desktop', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Pomodoro' })).toBeVisible()
  })

  test('clicking Pomodoro opens the timer showing 25:00', async ({ page }) => {
    await openTimer(page)
    await expect(page.getByText('25:00')).toBeVisible()
  })

  test('clicking Pomodoro again hides the timer', async ({ page }) => {
    await openTimer(page)
    await page.getByRole('button', { name: 'Pomodoro' }).click()
    await expect(page.getByText('25:00')).not.toBeVisible({ timeout: 3000 })
  })

  test('start button switches to pause icon', async ({ page }) => {
    await openTimer(page)
    // exact: true prevents "Reiniciar" matching "Iniciar" via substring
    await page.getByTitle('Iniciar', { exact: true }).click()
    await expect(page.getByTitle('Pausar', { exact: true })).toBeVisible({ timeout: 3000 })
  })

  test('pause stops the timer and restores the play icon', async ({ page }) => {
    await openTimer(page)
    await page.getByTitle('Iniciar', { exact: true }).click()
    await expect(page.getByTitle('Pausar', { exact: true })).toBeVisible({ timeout: 3000 })
    await page.getByTitle('Pausar', { exact: true }).click()
    await expect(page.getByTitle('Iniciar', { exact: true })).toBeVisible({ timeout: 3000 })
  })

  test('reset restores 25:00 and pauses the timer', async ({ page }) => {
    await openTimer(page)
    await page.getByTitle('Iniciar', { exact: true }).click()
    await page.waitForTimeout(1200) // let 1 second tick

    await page.getByTitle('Reiniciar', { exact: true }).click()

    await expect(page.getByText('25:00')).toBeVisible({ timeout: 3000 })
    await expect(page.getByTitle('Iniciar', { exact: true })).toBeVisible({ timeout: 2000 })
  })

  test('skip once advances from focus (25:00) to short break (5:00)', async ({ page }) => {
    await openTimer(page)
    await expect(page.getByText('25:00')).toBeVisible()

    await page.getByTitle('Pular', { exact: true }).click()

    await expect(page.getByText('5:00')).toBeVisible({ timeout: 3000 })
  })

  test('seven skips complete the 4-cycle group and reach long break (15:00)', async ({ page }) => {
    await openTimer(page)

    // Cycle pattern: focus→break→focus→break→focus→break→focus→LONG_BREAK
    // That's 4 focus cycles = 7 skips total
    for (let i = 0; i < 7; i++) {
      await page.getByTitle('Pular', { exact: true }).click()
      await page.waitForTimeout(150)
    }

    await expect(page.getByText('15:00')).toBeVisible({ timeout: 3000 })
  })
})
