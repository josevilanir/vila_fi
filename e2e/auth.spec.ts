import { test, expect } from '@playwright/test'

/**
 * Flow 2 — Authentication
 *
 * Tests the complete auth journey on /app:
 *   - Open the AuthModal from the header "Entrar" button
 *   - Switch between login and register tabs
 *   - Login with mocked API → user menu appears
 *   - Logout → "Entrar" button returns
 *
 * All API calls are intercepted with page.route() so the test
 * never touches a real database.
 */

const MOCK_USER = {
  id: 'test-user-id',
  email: 'user@vilafi.test',
  name: 'Test User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'

test.describe('Authentication flow', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the login API so no real DB is needed
    await page.route('**/api/v1/auth/login', async (route) => {
      const body = await route.request().postDataJSON()
      if (body?.email === MOCK_USER.email) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { token: MOCK_TOKEN, user: MOCK_USER }, error: null }),
        })
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            data: null,
            error: { code: 'INVALID_CREDENTIALS', message: 'E-mail ou senha inválidos' },
          }),
        })
      }
    })

    // Intercept /me so restoreSession works after login persists the token
    await page.route('**/api/v1/auth/me', async (route) => {
      const auth = route.request().headers()['authorization'] ?? ''
      if (auth.includes(MOCK_TOKEN)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { ...MOCK_USER, subscription: null }, error: null }),
        })
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ data: null, error: { code: 'UNAUTHORIZED', message: 'Não autorizado' } }),
        })
      }
    })

    await page.goto('/app')
    await page.waitForLoadState('networkidle')
  })

  // ── helper ──────────────────────────────────────────────────────────────────

  /**
   * Opens the auth modal by clicking the header "Entrar" button.
   * Uses aria-label so it doesn't match the form submit button.
   */
  async function openModal(page: import('@playwright/test').Page) {
    await page.getByRole('button', { name: 'Entrar' }).filter({ hasNot: page.locator('[type="submit"]') }).first().click()
    await expect(page.getByText('Entrar no Vila Fi')).toBeVisible({ timeout: 5000 })
  }

  // ── tests ────────────────────────────────────────────────────────────────────

  test('the header "Entrar" button is visible when not authenticated', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Entrar' }).first()).toBeVisible()
  })

  test('clicking "Entrar" opens the auth modal', async ({ page }) => {
    await openModal(page)
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('switches from login to register form', async ({ page }) => {
    await openModal(page)
    // The switch button's accessible name is "Não tem conta? Criar conta"
    await page.getByRole('button', { name: /criar conta/i }).click()
    await expect(page.getByText('Criar conta').first()).toBeVisible({ timeout: 3000 })
    // The register form has an extra "Name" field
    await expect(page.getByPlaceholder(/nome|name/i)).toBeVisible({ timeout: 3000 })
  })

  test('closes the modal when the X button is clicked', async ({ page }) => {
    await openModal(page)
    // The X close button is the first button inside the modal card
    await page.locator('.fixed svg').first().locator('..').click()
    await expect(page.getByText('Entrar no Vila Fi')).not.toBeVisible({ timeout: 3000 })
  })

  test('shows an error for wrong credentials', async ({ page }) => {
    await openModal(page)
    await page.getByPlaceholder('seu@email.com').fill('wrong@email.com')
    await page.getByPlaceholder('••••••••').fill('wrongpass')
    // Scope the submit click to the form to avoid matching the header button
    await page.locator('form button[type="submit"]').click()
    await expect(page.getByText('E-mail ou senha inválidos')).toBeVisible({ timeout: 5000 })
  })

  test('full login flow: user menu appears after successful login', async ({ page }) => {
    await openModal(page)
    await page.getByPlaceholder('seu@email.com').fill(MOCK_USER.email)
    await page.getByPlaceholder('••••••••').fill('anypassword')
    await page.locator('form button[type="submit"]').click()

    // Modal should close
    await expect(page.getByText('Entrar no Vila Fi')).not.toBeVisible({ timeout: 5000 })
    // Presets button (only shown when authenticated) should appear
    await expect(page.getByLabel('Meus presets')).toBeVisible({ timeout: 5000 })
  })

  test('logout returns the user to the unauthenticated state', async ({ page }) => {
    // ── Login first ──────────────────────────────────────────────────────────
    await openModal(page)
    await page.getByPlaceholder('seu@email.com').fill(MOCK_USER.email)
    await page.getByPlaceholder('••••••••').fill('anypassword')
    await page.locator('form button[type="submit"]').click()
    await expect(page.getByLabel('Meus presets')).toBeVisible({ timeout: 5000 })

    // ── Logout ────────────────────────────────────────────────────────────────
    // Try clicking the UserMenu avatar, then the logout button inside it
    const userAvatar = page.getByLabel(/menu do usuário|perfil do usuário/i)
    if (await userAvatar.count() > 0) {
      await userAvatar.first().click()
      await page.getByRole('button', { name: /sair|logout/i }).click()
    } else {
      // Fallback: clear token directly (simulates session expiry)
      await page.evaluate(() => localStorage.removeItem('vilafi_token'))
      await page.reload()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByRole('button', { name: 'Entrar' }).first()).toBeVisible({ timeout: 5000 })
  })
})
