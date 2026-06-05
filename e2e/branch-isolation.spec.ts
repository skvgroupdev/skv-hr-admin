import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Branch Isolation', () => {
  test('BRANCH_MANAGER (ສາຍລົມ) should not see employees from other branches in attendance page', async ({ page }) => {
    await loginAs(page, 'branchManager')
    await page.goto('/hr/attendance')
    await page.waitForLoadState('networkidle')

    // Wait for either table rows or the empty-state message
    await expect(
      page.locator('table tbody tr').first()
        .or(page.locator('text=ບໍ່ມີຂໍ້ມູນ'))
    ).toBeVisible({ timeout: 15_000 })

    const pageText = await page.locator('body').innerText()

    // Employees from branch ປາກເຊ must NOT appear
    expect(pageText).not.toContain('ຈັນທະລາ')  // ຈັນທະລາ ສ້ານ — branch ປາກເຊ
    expect(pageText).not.toContain('ນ້ຳຟ້າ')    // ນ້ຳຟ້າ ລາດ — branch ປາກເຊ
  })

  test('HR_ADMIN should see employees from all branches in /hr/employees', async ({ page }) => {
    await loginAs(page, 'hrAdmin')
    await page.goto('/hr/employees')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 })

    const tableText = await page.locator('table').innerText()

    // Must contain employees from multiple branches
    expect(tableText).toContain('ວິໄລ')       // branch ສາຍລົມ
    expect(tableText).toContain('ຈັນທະລາ')    // branch ປາກເຊ

    // Row count must exceed a single branch's employee count
    const rowCount = await page.locator('table tbody tr').filter({ hasNotText: 'ບໍ່ມີ' }).count()
    expect(rowCount).toBeGreaterThan(4)
  })

  // [BUG] BRANCH_MANAGER sees leave requests from other branches (e.g. ຈັນທະລາ from branch ປາກເຊ)
  // Backend /leave/pending does not filter by branchId for BRANCH_MANAGER role
  // This test documents the bug — it currently FAILS and should be fixed in the backend
  test('[BUG] BRANCH_MANAGER should see only own-branch leave requests', async ({ page }) => {
    await loginAs(page, 'branchManager')
    await page.goto('/hr/leave')
    await page.waitForLoadState('networkidle')

    await expect(
      page.locator('table tbody tr').first()
        .or(page.locator('text=ບໍ່ມີຄຳຂໍລໍຖ້າ'))
    ).toBeVisible({ timeout: 10_000 })

    const tableText = await page.locator('table').innerText()

    // These assertions document the EXPECTED behavior after the bug is fixed
    expect(tableText).not.toContain('ຈັນທະລາ')  // branch ປາກເຊ — must not appear
    expect(tableText).not.toContain('ນ້ຳຟ້າ')    // branch ປາກເຊ — must not appear
    expect(tableText).not.toContain('ວັນນະ')      // branch ປາກເຊ — must not appear
  })
})
