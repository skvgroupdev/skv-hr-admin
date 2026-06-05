# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: employee-attendance.spec.ts >> Employee Attendance >> should switch to confirm state on first click of check-in button
- Location: e2e/employee-attendance.spec.ts:26:3

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('button').filter({ hasText: 'ເຂົ້າວຽກ' })
    - locator resolved to <button disabled class="w-full h-16 rounded-2xl bg-gradient-to-r from-[#1A3A6B] to-[#2563EB] text-white font-bold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    37 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { loginAs } from './helpers/auth'
  3  | 
  4  | test.describe('Employee Attendance', () => {
  5  |   test.beforeEach(async ({ page, context }) => {
  6  |     // Grant GPS permission and set location to HQ coords
  7  |     await context.grantPermissions(['geolocation'])
  8  |     await context.setGeolocation({ latitude: 17.9757, longitude: 102.6331 })
  9  | 
  10 |     await loginAs(page, 'staff')
  11 |     await page.goto('/employee/attendance')
  12 |     await page.waitForLoadState('networkidle')
  13 |   })
  14 | 
  15 |   test('should show one of the attendance action buttons', async ({ page }) => {
  16 |     // Exactly one of these states must be visible depending on current check-in state
  17 |     const checkedOutBtn = page.locator('button', { hasText: 'ອອກວຽກແລ້ວ' })
  18 |     const checkInBtn = page.locator('button', { hasText: 'ເຂົ້າວຽກ' })
  19 |     const checkOutBtn = page.locator('button', { hasText: 'ອອກວຽກ' })
  20 | 
  21 |     await expect(
  22 |       checkedOutBtn.or(checkInBtn).or(checkOutBtn)
  23 |     ).toBeVisible({ timeout: 10_000 })
  24 |   })
  25 | 
  26 |   test('should switch to confirm state on first click of check-in button', async ({ page }) => {
  27 |     const checkInBtn = page.locator('button', { hasText: 'ເຂົ້າວຽກ' })
  28 |     const isCheckInVisible = await checkInBtn.isVisible()
  29 | 
  30 |     // Only run the rest of this test if not already checked in
  31 |     if (!isCheckInVisible) {
  32 |       // Mark as expected-skip — state depends on seed data timing
  33 |       return
  34 |     }
  35 | 
> 36 |     await checkInBtn.click()
     |                      ^ Error: locator.click: Target page, context or browser has been closed
  37 | 
  38 |     await expect(page.locator('button', { hasText: 'ຢືນຢັນເຂົ້າວຽກ' })).toBeVisible({ timeout: 5_000 })
  39 |   })
  40 | 
  41 |   test('should cancel confirm state and return to check-in button', async ({ page }) => {
  42 |     const checkInBtn = page.locator('button', { hasText: 'ເຂົ້າວຽກ' })
  43 |     const isCheckInVisible = await checkInBtn.isVisible()
  44 | 
  45 |     if (!isCheckInVisible) {
  46 |       return
  47 |     }
  48 | 
  49 |     await checkInBtn.click()
  50 |     await expect(page.locator('button', { hasText: 'ຢືນຢັນເຂົ້າວຽກ' })).toBeVisible()
  51 | 
  52 |     await page.locator('button', { hasText: 'ຍົກເລີກ' }).click()
  53 | 
  54 |     await expect(page.locator('button', { hasText: 'ເຂົ້າວຽກ' })).toBeVisible({ timeout: 5_000 })
  55 |   })
  56 | 
  57 |   test('should display attendance history section', async ({ page }) => {
  58 |     await expect(page.getByText('ປະຫວັດການເຂົ້າ-ອອກ')).toBeVisible()
  59 | 
  60 |     // Either shows history rows or empty-state message
  61 |     const historyContent = page
  62 |       .locator('text=ຍັງບໍ່ມີປະຫວັດ')
  63 |       .or(page.locator('.flex.items-center.justify-between.py-3').first())
  64 | 
  65 |     await expect(historyContent).toBeVisible({ timeout: 10_000 })
  66 |   })
  67 | })
  68 | 
```