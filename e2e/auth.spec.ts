import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Authentication', () => {
  test('should redirect HR_ADMIN to /hr/dashboard after login', async ({ page }) => {
    await loginAs(page, 'hrAdmin')

    await expect(page).toHaveURL(/\/hr\/dashboard/)
  })

  test('should redirect BRANCH_MANAGER to /employee/home after login', async ({ page }) => {
    await loginAs(page, 'branchManager')

    await expect(page).toHaveURL(/\/employee\/home/)
  })

  test('should redirect STAFF to /employee/home after login', async ({ page }) => {
    await loginAs(page, 'staff')

    await expect(page).toHaveURL(/\/employee\/home/)
  })

  test('should show error message when password is wrong', async ({ page }) => {
    await page.goto('/login')

    await page.locator('input[type="tel"]').fill('2011000002')
    await page.locator('input[type="password"]').fill('WrongPassword123')
    await page.getByRole('button', { name: /ເຂົ້າສູ່ລະບົບ/i }).click()

    // Error banner contains Lao error text — LoginPage renders bg-red-50 div on loginMutation.isError
    await expect(
      page.locator('text=ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ')
        .or(page.locator('text=ເກີດຂໍ້ຜິດພາດ'))
    ).toBeVisible({ timeout: 12_000 })
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to /login after logout and block back navigation', async ({ page }) => {
    await loginAs(page, 'hrAdmin')
    await expect(page).toHaveURL(/\/hr\/dashboard/)

    // Click logout button (TopBar has "ອອກຈາກລະບົບ" button)
    await page.getByRole('button', { name: /ອອກຈາກລະບົບ/i }).click()
    await page.waitForURL('/login', { timeout: 8_000 })
    await expect(page).toHaveURL(/\/login/)

    // Navigate back — ProtectedRoute must redirect to /login again (token cleared from store)
    await page.goto('/hr/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 })
  })

  test('should redirect unauthenticated user from /hr/dashboard to /login', async ({ page }) => {
    await page.goto('/hr/dashboard')

    await expect(page).toHaveURL(/\/login/, { timeout: 8_000 })
  })
})
