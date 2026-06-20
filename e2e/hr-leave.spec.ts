import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('HR Leave Approval', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'hrAdmin')
    await page.goto('/hr/leave')
    await page.waitForLoadState('networkidle')
  })

  test('should show tabs "ລໍຖ້າອະນຸມັດ" and "ລາຍງານ"', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'ລໍຖ້າອະນຸມັດ' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'ລາຍງານ' })).toBeVisible()
  })

  test('should display pending leave requests in the table', async ({ page }) => {
    const rows = page.locator('table tbody tr').filter({ hasNotText: 'ບໍ່ມີຄຳຂໍລໍຖ້າ' })
    await expect(rows.first()).toBeVisible({ timeout: 10_000 })
  })

  test('should open approve modal, fill comment, and confirm', async ({ page }) => {
    const firstApproveBtn = page.getByRole('button', { name: 'ອະນຸມັດ' }).first()
    await expect(firstApproveBtn).toBeVisible({ timeout: 10_000 })
    await firstApproveBtn.click()

    // Modal container scoped locator
    const modal = page.locator('.fixed.inset-0')
    await expect(modal.getByText('ອະນຸມັດຄຳຂໍ')).toBeVisible({ timeout: 5_000 })

    await modal.locator('textarea').fill('ໝາຍເຫດທົດສອບ')

    // Confirm button inside modal
    await modal.getByRole('button', { name: 'ອະນຸມັດ' }).click()

    // Modal closes after successful mutation
    await expect(modal.getByText('ອະນຸມັດຄຳຂໍ')).not.toBeVisible({ timeout: 10_000 })
  })

  test('should open reject modal, fill reason, and confirm', async ({ page }) => {
    const firstRejectBtn = page.getByRole('button', { name: 'ປະຕິເສດ' }).first()
    await expect(firstRejectBtn).toBeVisible({ timeout: 10_000 })
    await firstRejectBtn.click()

    const modal = page.locator('.fixed.inset-0')
    await expect(modal.getByText('ປະຕິເສດຄຳຂໍ')).toBeVisible({ timeout: 5_000 })

    await modal.locator('textarea').fill('ຂາດເອກະສານສະໜັບສະໜູນ')

    await modal.getByRole('button', { name: 'ປະຕິເສດ' }).click()

    await expect(modal.getByText('ປະຕິເສດຄຳຂໍ')).not.toBeVisible({ timeout: 10_000 })
  })

  test('should disable reject confirm button when reason is empty', async ({ page }) => {
    const firstRejectBtn = page.getByRole('button', { name: 'ປະຕິເສດ' }).first()
    await expect(firstRejectBtn).toBeVisible({ timeout: 10_000 })
    await firstRejectBtn.click()

    const modal = page.locator('.fixed.inset-0')
    await expect(modal.getByText('ປະຕິເສດຄຳຂໍ')).toBeVisible()

    // Confirm button in modal must be disabled when textarea is empty
    const confirmBtn = modal.getByRole('button', { name: 'ປະຕິເສດ' })
    await expect(confirmBtn).toBeDisabled()

    // Validation hint visible
    await expect(modal.getByText('ກະລຸນາໃສ່ເຫດຜົນ')).toBeVisible()
  })
})
