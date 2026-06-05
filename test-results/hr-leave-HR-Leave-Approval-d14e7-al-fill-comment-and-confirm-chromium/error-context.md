# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr-leave.spec.ts >> HR Leave Approval >> should open approve modal, fill comment, and confirm
- Location: e2e/hr-leave.spec.ts:21:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.fixed.inset-0').getByText('ອະນຸມັດຄຳຂໍ')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.fixed.inset-0').getByText('ອະນຸມັດຄຳຂໍ')

```

```yaml
- complementary:
  - img "SKV HR"
  - navigation:
    - list:
      - listitem:
        - link "ພາບລວມ":
          - /url: /hr/dashboard
    - paragraph: ຈັດການພະນັກງານ
    - list:
      - listitem:
        - link "ພະນັກງານ":
          - /url: /hr/employees
      - listitem:
        - link "ສາຂາ":
          - /url: /hr/branches
      - listitem:
        - link "ພະແນກ":
          - /url: /hr/departments
      - listitem:
        - link "ຕໍາແໜ່ງ":
          - /url: /hr/positions
    - paragraph: ການດຳເນີນງານ
    - list:
      - listitem:
        - link "ການເຂົ້າວຽກ":
          - /url: /hr/attendance
      - listitem:
        - link "ການລາພັກ 9":
          - /url: /hr/leave
      - listitem:
        - link "OT 20":
          - /url: /hr/ot
      - listitem:
        - link "ອອກນອກສາຂາ":
          - /url: /hr/outside-work
    - paragraph: ການເງິນ & ລາພັກຍງານ
    - list:
      - listitem:
        - link "ເງິນເດືອນ":
          - /url: /hr/payroll
      - listitem:
        - link "ລາພັກຍງານ":
          - /url: /hr/reports
    - paragraph: ການສື່ສານ
    - list:
      - listitem:
        - link "ປະກາດ":
          - /url: /hr/announcements
      - listitem:
        - link "ການແຈ້ງເຕືອນ":
          - /url: /hr/notifications
    - paragraph: ຕັ້ງຄ່າ
    - list:
      - listitem:
        - link "ໂມງເຂົ້າວຽກ":
          - /url: /hr/shifts
      - listitem:
        - link "ວັນຫຍຸດ":
          - /url: /hr/holidays
      - listitem:
        - link "ການຕັ້ງຄ່າພາສີ":
          - /url: /hr/settings/tax-config
  - paragraph: POWERBY SKV Group
- banner:
  - img "SKV HR"
  - paragraph: ນາລີ ພົມມະ
  - text: HR_ADMIN
  - button "ອອກຈາກລະບົບ"
- main:
  - heading "ການລາພັກ" [level=1]
  - button "ລໍຖ້າອນຸມັດ"
  - button "ລາຍງານ"
  - table:
    - rowgroup:
      - row "ພະນັກງານ ປະເພດລາພັກ ຊ່ວງວັນທີ ຈຳນວນວັນ ເຫດຜົນ ການຈັດການ":
        - columnheader "ພະນັກງານ"
        - columnheader "ປະເພດລາພັກ"
        - columnheader "ຊ່ວງວັນທີ"
        - columnheader "ຈຳນວນວັນ"
        - columnheader "ເຫດຜົນ"
        - columnheader "ການຈັດການ"
    - rowgroup:
      - row "ນ້ຳຟ້າ ລາດ +8562011000014 ລາພັກ (Annual) 09/05/2026 – 11/05/2026 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ນ້ຳຟ້າ ລາດ +8562011000014":
          - paragraph: ນ້ຳຟ້າ ລາດ
          - paragraph: "+8562011000014"
        - cell "ລາພັກ (Annual)"
        - cell "09/05/2026 – 11/05/2026"
        - cell "3 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ນ້ຳຟ້າ ລາດ +8562011000014 ລາພັກ (Annual) 09/05/2026 – 11/05/2026 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ນ້ຳຟ້າ ລາດ +8562011000014":
          - paragraph: ນ້ຳຟ້າ ລາດ
          - paragraph: "+8562011000014"
        - cell "ລາພັກ (Annual)"
        - cell "09/05/2026 – 11/05/2026"
        - cell "3 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ສຸດາ ທ +8562011000015 ລາພັກ (Annual) 07/04/2025 – 08/04/2025 2 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ສຸດາ ທ +8562011000015":
          - paragraph: ສຸດາ ທ
          - paragraph: "+8562011000015"
        - cell "ລາພັກ (Annual)"
        - cell "07/04/2025 – 08/04/2025"
        - cell "2 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ຈັນທະລາ ສ້ານ +8562011000013 ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid) 15/04/2025 – 15/04/2025 1 ວັນ ກິດທຸລະສ່ວນຕົວ ອນຸມັດ ປະຕິເສດ":
        - cell "ຈັນທະລາ ສ້ານ +8562011000013":
          - paragraph: ຈັນທະລາ ສ້ານ
          - paragraph: "+8562011000013"
        - cell "ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid)"
        - cell "15/04/2025 – 15/04/2025"
        - cell "1 ວັນ"
        - cell "ກິດທຸລະສ່ວນຕົວ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ສົມສັກ ວົງສາ +8562011000001 ລາພັກ (Annual) 07/02/2025 – 07/02/2025 1 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ສົມສັກ ວົງສາ +8562011000001":
          - paragraph: ສົມສັກ ວົງສາ
          - paragraph: "+8562011000001"
        - cell "ລາພັກ (Annual)"
        - cell "07/02/2025 – 07/02/2025"
        - cell "1 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ນາລີ ພົມມະ +8562011000002 ລາພັກ (Annual) 09/03/2026 – 13/03/2026 5 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ນາລີ ພົມມະ +8562011000002":
          - paragraph: ນາລີ ພົມມະ
          - paragraph: "+8562011000002"
        - cell "ລາພັກ (Annual)"
        - cell "09/03/2026 – 13/03/2026"
        - cell "5 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ນາລີ ພົມມະ +8562011000002 ລາພັກ (Annual) 09/03/2026 – 13/03/2026 5 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ນາລີ ພົມມະ +8562011000002":
          - paragraph: ນາລີ ພົມມະ
          - paragraph: "+8562011000002"
        - cell "ລາພັກ (Annual)"
        - cell "09/03/2026 – 13/03/2026"
        - cell "5 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ບຸນມີ ສີສຸວັນ +8562011000004 ລາພັກ (Annual) 12/04/2025 – 14/04/2025 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ບຸນມີ ສີສຸວັນ +8562011000004":
          - paragraph: ບຸນມີ ສີສຸວັນ
          - paragraph: "+8562011000004"
        - cell "ລາພັກ (Annual)"
        - cell "12/04/2025 – 14/04/2025"
        - cell "3 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
      - row "ບຸນມີ ສີສຸວັນ +8562011000004 ລາພັກ (Annual) 12/04/2025 – 14/04/2025 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ":
        - cell "ບຸນມີ ສີສຸວັນ +8562011000004":
          - paragraph: ບຸນມີ ສີສຸວັນ
          - paragraph: "+8562011000004"
        - cell "ລາພັກ (Annual)"
        - cell "12/04/2025 – 14/04/2025"
        - cell "3 ວັນ"
        - cell "ຂໍລາພັກປະຈຳປີ"
        - cell "ອນຸມັດ ປະຕິເສດ":
          - button "ອນຸມັດ"
          - button "ປະຕິເສດ"
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
  4  | test.describe('HR Leave Approval', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await loginAs(page, 'hrAdmin')
  7  |     await page.goto('/hr/leave')
  8  |     await page.waitForLoadState('networkidle')
  9  |   })
  10 | 
  11 |   test('should show tabs "ລໍຖ້າອນຸມັດ" and "ລາຍງານ"', async ({ page }) => {
  12 |     await expect(page.getByRole('button', { name: 'ລໍຖ້າອນຸມັດ' })).toBeVisible()
  13 |     await expect(page.getByRole('button', { name: 'ລາຍງານ' })).toBeVisible()
  14 |   })
  15 | 
  16 |   test('should display pending leave requests in the table', async ({ page }) => {
  17 |     const rows = page.locator('table tbody tr').filter({ hasNotText: 'ບໍ່ມີຄຳຂໍລໍຖ້າ' })
  18 |     await expect(rows.first()).toBeVisible({ timeout: 10_000 })
  19 |   })
  20 | 
  21 |   test('should open approve modal, fill comment, and confirm', async ({ page }) => {
  22 |     const firstApproveBtn = page.getByRole('button', { name: 'ອນຸມັດ' }).first()
  23 |     await expect(firstApproveBtn).toBeVisible({ timeout: 10_000 })
  24 |     await firstApproveBtn.click()
  25 | 
  26 |     // Modal container scoped locator
  27 |     const modal = page.locator('.fixed.inset-0')
> 28 |     await expect(modal.getByText('ອະນຸມັດຄຳຂໍ')).toBeVisible({ timeout: 5_000 })
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  29 | 
  30 |     await modal.locator('textarea').fill('ໝາຍເຫດທົດສອບ')
  31 | 
  32 |     // Confirm button inside modal
  33 |     await modal.getByRole('button', { name: 'ອນຸມັດ' }).click()
  34 | 
  35 |     // Modal closes after successful mutation
  36 |     await expect(modal.getByText('ອະນຸມັດຄຳຂໍ')).not.toBeVisible({ timeout: 10_000 })
  37 |   })
  38 | 
  39 |   test('should open reject modal, fill reason, and confirm', async ({ page }) => {
  40 |     const firstRejectBtn = page.getByRole('button', { name: 'ປະຕິເສດ' }).first()
  41 |     await expect(firstRejectBtn).toBeVisible({ timeout: 10_000 })
  42 |     await firstRejectBtn.click()
  43 | 
  44 |     const modal = page.locator('.fixed.inset-0')
  45 |     await expect(modal.getByText('ປະຕິເສດຄຳຂໍ')).toBeVisible({ timeout: 5_000 })
  46 | 
  47 |     await modal.locator('textarea').fill('ຂາດເອກະສານສະໜັບສະໜູນ')
  48 | 
  49 |     await modal.getByRole('button', { name: 'ປະຕິເສດ' }).click()
  50 | 
  51 |     await expect(modal.getByText('ປະຕິເສດຄຳຂໍ')).not.toBeVisible({ timeout: 10_000 })
  52 |   })
  53 | 
  54 |   test('should disable reject confirm button when reason is empty', async ({ page }) => {
  55 |     const firstRejectBtn = page.getByRole('button', { name: 'ປະຕິເສດ' }).first()
  56 |     await expect(firstRejectBtn).toBeVisible({ timeout: 10_000 })
  57 |     await firstRejectBtn.click()
  58 | 
  59 |     const modal = page.locator('.fixed.inset-0')
  60 |     await expect(modal.getByText('ປະຕິເສດຄຳຂໍ')).toBeVisible()
  61 | 
  62 |     // Confirm button in modal must be disabled when textarea is empty
  63 |     const confirmBtn = modal.getByRole('button', { name: 'ປະຕິເສດ' })
  64 |     await expect(confirmBtn).toBeDisabled()
  65 | 
  66 |     // Validation hint visible
  67 |     await expect(modal.getByText('ກະລຸນາໃສ່ເຫດຜົນ')).toBeVisible()
  68 |   })
  69 | })
  70 | 
```