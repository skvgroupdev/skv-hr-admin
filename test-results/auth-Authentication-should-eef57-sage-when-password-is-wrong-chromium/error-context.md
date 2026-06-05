# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should show error message when password is wrong
- Location: e2e/auth.spec.ts:23:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ').or(locator('text=ເກີດຂໍ້ຜິດພາດ'))
Expected: visible
Timeout: 12000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 12000ms
  - waiting for locator('text=ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ').or(locator('text=ເກີດຂໍ້ຜິດພາດ'))

```

```yaml
- main:
  - img "SKV HR"
  - heading "ເຂົ້າສູ່ລະບົບ" [level=1]
  - paragraph: SKV HR - ລະບົບຈັດການບຸກຄະລາພັກກອນ
  - text: ເບີໂທລະສັບ +856
  - textbox "20 XXXX XXXX"
  - text: ລະຫັດຜ່ານ
  - textbox "ລະຫັດຜ່ານ":
    - /placeholder: ••••••••
  - button
  - button "ເຂົ້າສູ່ລະບົບ"
- contentinfo:
  - paragraph: POWERBY SKV Group · © 2026
- button "Open Tanstack query devtools":
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { loginAs } from './helpers/auth'
  3  | 
  4  | test.describe('Authentication', () => {
  5  |   test('should redirect HR_ADMIN to /hr/dashboard after login', async ({ page }) => {
  6  |     await loginAs(page, 'hrAdmin')
  7  | 
  8  |     await expect(page).toHaveURL(/\/hr\/dashboard/)
  9  |   })
  10 | 
  11 |   test('should redirect BRANCH_MANAGER to /employee/home after login', async ({ page }) => {
  12 |     await loginAs(page, 'branchManager')
  13 | 
  14 |     await expect(page).toHaveURL(/\/employee\/home/)
  15 |   })
  16 | 
  17 |   test('should redirect STAFF to /employee/home after login', async ({ page }) => {
  18 |     await loginAs(page, 'staff')
  19 | 
  20 |     await expect(page).toHaveURL(/\/employee\/home/)
  21 |   })
  22 | 
  23 |   test('should show error message when password is wrong', async ({ page }) => {
  24 |     await page.goto('/login')
  25 | 
  26 |     await page.locator('input[type="tel"]').fill('2011000002')
  27 |     await page.locator('input[type="password"]').fill('WrongPassword123')
  28 |     await page.getByRole('button', { name: /ເຂົ້າສູ່ລະບົບ/i }).click()
  29 | 
  30 |     // Error banner contains Lao error text — LoginPage renders bg-red-50 div on loginMutation.isError
  31 |     await expect(
  32 |       page.locator('text=ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ')
  33 |         .or(page.locator('text=ເກີດຂໍ້ຜິດພາດ'))
> 34 |     ).toBeVisible({ timeout: 12_000 })
     |       ^ Error: expect(locator).toBeVisible() failed
  35 |     await expect(page).toHaveURL(/\/login/)
  36 |   })
  37 | 
  38 |   test('should redirect to /login after logout and block back navigation', async ({ page }) => {
  39 |     await loginAs(page, 'hrAdmin')
  40 |     await expect(page).toHaveURL(/\/hr\/dashboard/)
  41 | 
  42 |     // Click logout button (TopBar has "ອອກຈາກລະບົບ" button)
  43 |     await page.getByRole('button', { name: /ອອກຈາກລະບົບ/i }).click()
  44 |     await page.waitForURL('/login', { timeout: 8_000 })
  45 |     await expect(page).toHaveURL(/\/login/)
  46 | 
  47 |     // Navigate back — ProtectedRoute must redirect to /login again (token cleared from store)
  48 |     await page.goto('/hr/dashboard')
  49 |     await expect(page).toHaveURL(/\/login/, { timeout: 8_000 })
  50 |   })
  51 | 
  52 |   test('should redirect unauthenticated user from /hr/dashboard to /login', async ({ page }) => {
  53 |     await page.goto('/hr/dashboard')
  54 | 
  55 |     await expect(page).toHaveURL(/\/login/, { timeout: 8_000 })
  56 |   })
  57 | })
  58 | 
```