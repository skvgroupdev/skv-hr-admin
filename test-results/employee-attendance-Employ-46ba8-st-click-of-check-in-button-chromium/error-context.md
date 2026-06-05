# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: employee-attendance.spec.ts >> Employee Attendance >> should switch to confirm state on first click of check-in button
- Location: e2e/employee-attendance.spec.ts:26:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
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
    52 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]: SKV HR
      - button "ການແຈ້ງເຕືອນ" [ref=e6] [cursor=pointer]:
        - img [ref=e7]
    - main [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - paragraph [ref=e14]: ເຂົ້າ-ອອກວຽກ
          - generic [ref=e16]:
            - generic [ref=e19]: ຍັງບໍ່ໄດ້ເຂົ້າວຽກ
            - generic [ref=e20]:
              - generic [ref=e21]: "ເຂົ້າ: -"
              - generic [ref=e22]: "ອອກ: -"
          - generic [ref=e23]:
            - button "ເຂົ້າວຽກ" [disabled] [ref=e24]:
              - img [ref=e25]
              - text: ເຂົ້າວຽກ
            - paragraph [ref=e27]: ສາມາດ Check-in ໄດ້ຕັ້ງແຕ່ 06:00
        - generic [ref=e28]:
          - heading "ປະຫວັດການເຂົ້າ-ອອກ" [level=2] [ref=e29]
          - generic [ref=e30]:
            - generic [ref=e31]:
              - generic [ref=e32]:
                - paragraph [ref=e33]: 29/05/2026
                - paragraph [ref=e34]: 07:53 → 17:15
              - generic [ref=e35]: ອອກວຽກແລ້ວ
            - generic [ref=e36]:
              - generic [ref=e37]:
                - paragraph [ref=e38]: 28/05/2026
                - paragraph [ref=e39]: 07:53 → 17:15
              - generic [ref=e40]: ອອກວຽກແລ້ວ
            - generic [ref=e41]:
              - generic [ref=e42]:
                - paragraph [ref=e43]: 27/05/2026
                - paragraph [ref=e44]: 07:53 → 17:15
              - generic [ref=e45]: ອອກວຽກແລ້ວ
            - generic [ref=e46]:
              - generic [ref=e47]:
                - paragraph [ref=e48]: 26/05/2026
                - paragraph [ref=e49]: 07:53 → 17:15
              - generic [ref=e50]: ອອກວຽກແລ້ວ
            - generic [ref=e51]:
              - generic [ref=e52]:
                - paragraph [ref=e53]: 25/05/2026
                - paragraph [ref=e54]: 07:53 → 17:15
              - generic [ref=e55]: ອອກວຽກແລ້ວ
            - generic [ref=e56]:
              - generic [ref=e57]:
                - paragraph [ref=e58]: 22/05/2026
                - paragraph [ref=e59]: 07:53 → 17:15
              - generic [ref=e60]: ອອກວຽກແລ້ວ
            - generic [ref=e61]:
              - generic [ref=e62]:
                - paragraph [ref=e63]: 21/05/2026
                - paragraph [ref=e64]: 07:53 → 17:15
              - generic [ref=e65]: ອອກວຽກແລ້ວ
            - generic [ref=e66]:
              - generic [ref=e67]:
                - paragraph [ref=e68]: 20/05/2026
                - paragraph [ref=e69]: 07:53 → 17:15
              - generic [ref=e70]: ອອກວຽກແລ້ວ
            - generic [ref=e71]:
              - generic [ref=e72]:
                - paragraph [ref=e73]: 19/05/2026
                - paragraph [ref=e74]: 07:53 → 17:16
              - generic [ref=e75]: ອອກວຽກແລ້ວ
            - generic [ref=e76]:
              - generic [ref=e77]:
                - paragraph [ref=e78]: 18/05/2026
                - paragraph [ref=e79]: 07:53 → 17:16
              - generic [ref=e80]: ອອກວຽກແລ້ວ
            - generic [ref=e81]:
              - generic [ref=e82]:
                - paragraph [ref=e83]: 15/05/2026
                - paragraph [ref=e84]: 07:53 → 17:16
              - generic [ref=e85]: ອອກວຽກແລ້ວ
            - generic [ref=e86]:
              - generic [ref=e87]:
                - paragraph [ref=e88]: 14/05/2026
                - paragraph [ref=e89]: 07:53 → 17:16
              - generic [ref=e90]: ອອກວຽກແລ້ວ
            - generic [ref=e91]:
              - generic [ref=e92]:
                - paragraph [ref=e93]: 13/05/2026
                - paragraph [ref=e94]: 07:53 → 17:16
              - generic [ref=e95]: ອອກວຽກແລ້ວ
            - generic [ref=e96]:
              - generic [ref=e97]:
                - paragraph [ref=e98]: 12/05/2026
                - paragraph [ref=e99]: 07:53 → 17:16
              - generic [ref=e100]: ອອກວຽກແລ້ວ
            - generic [ref=e101]:
              - generic [ref=e102]:
                - paragraph [ref=e103]: 11/05/2026
                - paragraph [ref=e104]: 07:53 → 17:16
              - generic [ref=e105]: ອອກວຽກແລ້ວ
            - generic [ref=e106]:
              - generic [ref=e107]:
                - paragraph [ref=e108]: 08/05/2026
                - paragraph [ref=e109]: 07:53 → 17:16
              - generic [ref=e110]: ອອກວຽກແລ້ວ
            - generic [ref=e111]:
              - generic [ref=e112]:
                - paragraph [ref=e113]: 07/05/2026
                - paragraph [ref=e114]: 07:53 → 17:16
              - generic [ref=e115]: ອອກວຽກແລ້ວ
            - generic [ref=e116]:
              - generic [ref=e117]:
                - paragraph [ref=e118]: 06/05/2026
                - paragraph [ref=e119]: 07:53 → 17:16
              - generic [ref=e120]: ອອກວຽກແລ້ວ
            - generic [ref=e121]:
              - generic [ref=e122]:
                - paragraph [ref=e123]: 05/05/2026
                - paragraph [ref=e124]: 07:53 → 17:16
              - generic [ref=e125]: ອອກວຽກແລ້ວ
            - generic [ref=e126]:
              - generic [ref=e127]:
                - paragraph [ref=e128]: 04/05/2026
                - paragraph [ref=e129]: 07:53 → 17:16
              - generic [ref=e130]: ອອກວຽກແລ້ວ
    - navigation [ref=e131]:
      - link "ໜ້າຫຼັກ" [ref=e132] [cursor=pointer]:
        - /url: /employee/home
        - generic [ref=e133]:
          - img [ref=e134]
          - generic [ref=e137]: ໜ້າຫຼັກ
      - link "ເຂົ້າ-ອອກ" [ref=e138] [cursor=pointer]:
        - /url: /employee/attendance
        - generic [ref=e139]:
          - img [ref=e140]
          - generic [ref=e149]: ເຂົ້າ-ອອກ
      - link "ຄຳຮ້ອງ" [ref=e151] [cursor=pointer]:
        - /url: /employee/requests
        - generic [ref=e152]:
          - img [ref=e153]
          - generic [ref=e156]: ຄຳຮ້ອງ
      - link "ການເງິນ" [ref=e157] [cursor=pointer]:
        - /url: /employee/payslip
        - generic [ref=e158]:
          - img [ref=e159]
          - generic [ref=e162]: ການເງິນ
      - link "ໂປຣໄຟລ" [ref=e163] [cursor=pointer]:
        - /url: /employee/profile
        - generic [ref=e164]:
          - img [ref=e165]
          - generic [ref=e168]: ໂປຣໄຟລ
  - generic [ref=e169]:
    - img [ref=e171]
    - button "Open Tanstack query devtools" [ref=e219] [cursor=pointer]:
      - img [ref=e220]
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
     |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
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