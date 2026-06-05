import { test, expect } from '@playwright/test'

/**
 * Flow 1 — Landing Page
 *
 * Verifies the full landing page experience:
 *   - Initial render with correct content
 *   - Navigation CTA routes to /app
 *   - Section navigation via keyboard arrows
 *   - Night / day mode toggle (ThemeSwitch checkbox)
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the main heading and the hub CTA', async ({ page }) => {
    // Hero h1 contains the site name
    await expect(page.locator('h1').first()).toBeVisible()

    // Nav CTA link (class lp-join) reads "Entrar no hub"
    const cta = page.getByRole('link', { name: /entrar no hub/i })
    await expect(cta).toBeVisible()
  })

  test('navigates to /app when the "Entrar no hub" CTA is clicked', async ({ page }) => {
    await page.getByRole('link', { name: /entrar no hub/i }).click()
    await expect(page).toHaveURL('/app')
  })

  test('navigation links are present and change the visible section', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Click the Plans nav item if it exists
    const plansLink = page.getByRole('button', { name: /planos/i }).or(
      page.getByRole('link', { name: /planos/i }),
    ).first()

    if (await plansLink.count() > 0) {
      await plansLink.click()
      await expect(page.getByText(/gratuito|premium|plano/i).first()).toBeVisible()
    }
  })

  test('keyboard ArrowRight moves to the next section', async ({ page }) => {
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(700) // let CSS animation settle

    const hash = await page.evaluate(() => window.location.hash)
    // Hash should have changed from the initial empty state
    expect(hash).not.toBe('')
    expect(hash).not.toBe('#view-inicio')
  })

  test('night mode toggle changes the .night class on the root element', async ({ page }) => {
    const root = page.locator('.landing-root')
    await expect(root).not.toHaveClass(/night/)

    // ThemeSwitch renders a hidden checkbox inside a <label> — click the label
    const toggle = page.locator('label.theme-switch').first()
    await expect(toggle).toBeVisible()

    await toggle.click()
    await expect(root).toHaveClass(/night/)

    // Toggle back to day mode
    await toggle.click()
    await expect(root).not.toHaveClass(/night/)
  })
})
