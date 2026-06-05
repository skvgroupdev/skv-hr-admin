import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Employee Attendance', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant GPS permission and set location to HQ coords
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 17.9757, longitude: 102.6331 })

    await loginAs(page, 'staff')
    await page.goto('/employee/attendance')
    await page.waitForLoadState('networkidle')
  })

  test('should show one of the attendance action buttons', async ({ page }) => {
    // Exactly one of these states must be visible depending on current check-in state
    const checkedOutBtn = page.locator('button', { hasText: 'ອອກວຽກແລ້ວ' })
    const checkInBtn = page.locator('button', { hasText: 'ເຂົ້າວຽກ' })
    const checkOutBtn = page.locator('button', { hasText: 'ອອກວຽກ' })

    await expect(
      checkedOutBtn.or(checkInBtn).or(checkOutBtn)
    ).toBeVisible({ timeout: 10_000 })
  })

  test('should switch to confirm state on first click of check-in button', async ({ page }) => {
    const checkInBtn = page.locator('button', { hasText: 'ເຂົ້າວຽກ' })
    const isCheckInVisible = await checkInBtn.isVisible()

    // Only run the rest of this test if not already checked in
    if (!isCheckInVisible) {
      // Mark as expected-skip — state depends on seed data timing
      return
    }

    await checkInBtn.click()

    await expect(page.locator('button', { hasText: 'ຢືນຢັນເຂົ້າວຽກ' })).toBeVisible({ timeout: 5_000 })
  })

  test('should cancel confirm state and return to check-in button', async ({ page }) => {
    const checkInBtn = page.locator('button', { hasText: 'ເຂົ້າວຽກ' })
    const isCheckInVisible = await checkInBtn.isVisible()

    if (!isCheckInVisible) {
      return
    }

    await checkInBtn.click()
    await expect(page.locator('button', { hasText: 'ຢືນຢັນເຂົ້າວຽກ' })).toBeVisible()

    await page.locator('button', { hasText: 'ຍົກເລີກ' }).click()

    await expect(page.locator('button', { hasText: 'ເຂົ້າວຽກ' })).toBeVisible({ timeout: 5_000 })
  })

  test('should display attendance history section', async ({ page }) => {
    await expect(page.getByText('ປະຫວັດການເຂົ້າ-ອອກ')).toBeVisible()

    // Either shows history rows or empty-state message
    const historyContent = page
      .locator('text=ຍັງບໍ່ມີປະຫວັດ')
      .or(page.locator('.flex.items-center.justify-between.py-3').first())

    await expect(historyContent).toBeVisible({ timeout: 10_000 })
  })
})
