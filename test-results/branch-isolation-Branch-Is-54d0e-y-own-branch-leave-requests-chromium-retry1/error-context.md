# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: branch-isolation.spec.ts >> Branch Isolation >> [BUG] BRANCH_MANAGER should see only own-branch leave requests
- Location: e2e/branch-isolation.spec.ts:44:3

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "ຈັນທະລາ"
Received string:        "ພະນັກງານ	ປະເພດລາພັກ	ຊ່ວງວັນທີ	ຈຳນວນວັນ	ເຫດຜົນ	ການຈັດການ


ນ້ຳຟ້າ ລາດ

+8562011000014

	ລາພັກ (Annual)	09/05/2026 – 11/05/2026	3 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ນ້ຳຟ້າ ລາດ

+8562011000014

	ລາພັກ (Annual)	09/05/2026 – 11/05/2026	3 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ສຸດາ ທ

+8562011000015

	ລາພັກ (Annual)	07/04/2025 – 08/04/2025	2 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ຈັນທະລາ ສ້ານ

+8562011000013

	ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid)	15/04/2025 – 15/04/2025	1 ວັນ	ກິດທຸລະສ່ວນຕົວ	
ອນຸມັດ
ປະຕິເສດ



ສົມສັກ ວົງສາ

+8562011000001

	ລາພັກ (Annual)	07/02/2025 – 07/02/2025	1 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ນາລີ ພົມມະ

+8562011000002

	ລາພັກ (Annual)	09/03/2026 – 13/03/2026	5 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ນາລີ ພົມມະ

+8562011000002

	ລາພັກ (Annual)	09/03/2026 – 13/03/2026	5 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ບຸນມີ ສີສຸວັນ

+8562011000004

	ລາພັກ (Annual)	12/04/2025 – 14/04/2025	3 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ



ບຸນມີ ສີສຸວັນ

+8562011000004

	ລາພັກ (Annual)	12/04/2025 – 14/04/2025	3 ວັນ	ຂໍລາພັກປະຈຳປີ	
ອນຸມັດ
ປະຕິເສດ"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - img "SKV HR" [ref=e6]
      - navigation [ref=e7]:
        - list [ref=e9]:
          - listitem [ref=e10]:
            - link "ພາບລວມ" [ref=e11] [cursor=pointer]:
              - /url: /hr/dashboard
              - img [ref=e12]
              - generic [ref=e17]: ພາບລວມ
        - generic [ref=e18]:
          - paragraph [ref=e19]: ຈັດການພະນັກງານ
          - list [ref=e20]:
            - listitem [ref=e21]:
              - link "ພະນັກງານ" [ref=e22] [cursor=pointer]:
                - /url: /hr/employees
                - img [ref=e23]
                - generic [ref=e28]: ພະນັກງານ
            - listitem [ref=e29]:
              - link "ສາຂາ" [ref=e30] [cursor=pointer]:
                - /url: /hr/branches
                - img [ref=e31]
                - generic [ref=e35]: ສາຂາ
            - listitem [ref=e36]:
              - link "ພະແນກ" [ref=e37] [cursor=pointer]:
                - /url: /hr/departments
                - img [ref=e38]
                - generic [ref=e42]: ພະແນກ
            - listitem [ref=e43]:
              - link "ຕໍາແໜ່ງ" [ref=e44] [cursor=pointer]:
                - /url: /hr/positions
                - img [ref=e45]
                - generic [ref=e48]: ຕໍາແໜ່ງ
        - generic [ref=e49]:
          - paragraph [ref=e50]: ການດຳເນີນງານ
          - list [ref=e51]:
            - listitem [ref=e52]:
              - link "ການເຂົ້າວຽກ" [ref=e53] [cursor=pointer]:
                - /url: /hr/attendance
                - img [ref=e54]
                - generic [ref=e58]: ການເຂົ້າວຽກ
            - listitem [ref=e59]:
              - link "ການລາພັກ 9" [ref=e60] [cursor=pointer]:
                - /url: /hr/leave
                - img [ref=e61]
                - generic [ref=e64]: ການລາພັກ
                - generic [ref=e65]: "9"
            - listitem [ref=e66]:
              - link "OT 20" [ref=e67] [cursor=pointer]:
                - /url: /hr/ot
                - img [ref=e68]
                - generic [ref=e71]: OT
                - generic [ref=e72]: "20"
            - listitem [ref=e73]:
              - link "ອອກນອກສາຂາ" [ref=e74] [cursor=pointer]:
                - /url: /hr/outside-work
                - img [ref=e75]
                - generic [ref=e78]: ອອກນອກສາຂາ
        - generic [ref=e79]:
          - paragraph [ref=e80]: ການເງິນ & ລາພັກຍງານ
          - list [ref=e81]:
            - listitem [ref=e82]:
              - link "ເງິນເດືອນ" [ref=e83] [cursor=pointer]:
                - /url: /hr/payroll
                - img [ref=e84]
                - generic [ref=e86]: ເງິນເດືອນ
            - listitem [ref=e87]:
              - link "ລາພັກຍງານ" [ref=e88] [cursor=pointer]:
                - /url: /hr/reports
                - img [ref=e89]
                - generic [ref=e91]: ລາພັກຍງານ
        - generic [ref=e92]:
          - paragraph [ref=e93]: ການສື່ສານ
          - list [ref=e94]:
            - listitem [ref=e95]:
              - link "ປະກາດ" [ref=e96] [cursor=pointer]:
                - /url: /hr/announcements
                - img [ref=e97]
                - generic [ref=e100]: ປະກາດ
            - listitem [ref=e101]:
              - link "ການແຈ້ງເຕືອນ" [ref=e102] [cursor=pointer]:
                - /url: /hr/notifications
                - img [ref=e103]
                - generic [ref=e106]: ການແຈ້ງເຕືອນ
        - generic [ref=e107]:
          - paragraph [ref=e108]: ຕັ້ງຄ່າ
          - list [ref=e109]:
            - listitem [ref=e110]:
              - link "ໂມງເຂົ້າວຽກ" [ref=e111] [cursor=pointer]:
                - /url: /hr/shifts
                - img [ref=e112]
                - generic [ref=e115]: ໂມງເຂົ້າວຽກ
            - listitem [ref=e116]:
              - link "ວັນຫຍຸດ" [ref=e117] [cursor=pointer]:
                - /url: /hr/holidays
                - img [ref=e118]
                - generic [ref=e120]: ວັນຫຍຸດ
            - listitem [ref=e121]:
              - link "ການຕັ້ງຄ່າພາສີ" [ref=e122] [cursor=pointer]:
                - /url: /hr/settings/tax-config
                - img [ref=e123]
                - generic [ref=e126]: ການຕັ້ງຄ່າພາສີ
      - paragraph [ref=e128]: POWERBY SKV Group
    - generic [ref=e129]:
      - banner [ref=e130]:
        - img "SKV HR" [ref=e131]
        - generic [ref=e132]:
          - generic [ref=e133]:
            - img [ref=e135]
            - generic [ref=e138]:
              - paragraph [ref=e139]: ບຸນມີ ສີສຸວັນ
              - generic [ref=e140]: BRANCH_MANAGER
          - button "ອອກຈາກລະບົບ" [ref=e141] [cursor=pointer]:
            - img [ref=e142]
            - text: ອອກຈາກລະບົບ
      - main [ref=e145]:
        - generic [ref=e146]:
          - heading "ການລາພັກ" [level=1] [ref=e147]
          - generic [ref=e148]:
            - button "ລໍຖ້າອນຸມັດ" [ref=e149] [cursor=pointer]
            - button "ລາຍງານ" [ref=e150] [cursor=pointer]
          - table [ref=e153]:
            - rowgroup [ref=e154]:
              - row "ພະນັກງານ ປະເພດລາພັກ ຊ່ວງວັນທີ ຈຳນວນວັນ ເຫດຜົນ ການຈັດການ" [ref=e155]:
                - columnheader "ພະນັກງານ" [ref=e156]
                - columnheader "ປະເພດລາພັກ" [ref=e157]
                - columnheader "ຊ່ວງວັນທີ" [ref=e158]
                - columnheader "ຈຳນວນວັນ" [ref=e159]
                - columnheader "ເຫດຜົນ" [ref=e160]
                - columnheader "ການຈັດການ" [ref=e161]
            - rowgroup [ref=e162]:
              - row "ນ້ຳຟ້າ ລາດ +8562011000014 ລາພັກ (Annual) 09/05/2026 – 11/05/2026 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e163]:
                - cell "ນ້ຳຟ້າ ລາດ +8562011000014" [ref=e164]:
                  - generic [ref=e165]:
                    - paragraph [ref=e166]: ນ້ຳຟ້າ ລາດ
                    - paragraph [ref=e167]: "+8562011000014"
                - cell "ລາພັກ (Annual)" [ref=e168]
                - cell "09/05/2026 – 11/05/2026" [ref=e169]
                - cell "3 ວັນ" [ref=e170]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e171]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e172]:
                  - generic [ref=e173]:
                    - button "ອນຸມັດ" [ref=e174] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e175] [cursor=pointer]
              - row "ນ້ຳຟ້າ ລາດ +8562011000014 ລາພັກ (Annual) 09/05/2026 – 11/05/2026 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e176]:
                - cell "ນ້ຳຟ້າ ລາດ +8562011000014" [ref=e177]:
                  - generic [ref=e178]:
                    - paragraph [ref=e179]: ນ້ຳຟ້າ ລາດ
                    - paragraph [ref=e180]: "+8562011000014"
                - cell "ລາພັກ (Annual)" [ref=e181]
                - cell "09/05/2026 – 11/05/2026" [ref=e182]
                - cell "3 ວັນ" [ref=e183]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e184]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e185]:
                  - generic [ref=e186]:
                    - button "ອນຸມັດ" [ref=e187] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e188] [cursor=pointer]
              - row "ສຸດາ ທ +8562011000015 ລາພັກ (Annual) 07/04/2025 – 08/04/2025 2 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e189]:
                - cell "ສຸດາ ທ +8562011000015" [ref=e190]:
                  - generic [ref=e191]:
                    - paragraph [ref=e192]: ສຸດາ ທ
                    - paragraph [ref=e193]: "+8562011000015"
                - cell "ລາພັກ (Annual)" [ref=e194]
                - cell "07/04/2025 – 08/04/2025" [ref=e195]
                - cell "2 ວັນ" [ref=e196]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e197]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e198]:
                  - generic [ref=e199]:
                    - button "ອນຸມັດ" [ref=e200] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e201] [cursor=pointer]
              - row "ຈັນທະລາ ສ້ານ +8562011000013 ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid) 15/04/2025 – 15/04/2025 1 ວັນ ກິດທຸລະສ່ວນຕົວ ອນຸມັດ ປະຕິເສດ" [ref=e202]:
                - cell "ຈັນທະລາ ສ້ານ +8562011000013" [ref=e203]:
                  - generic [ref=e204]:
                    - paragraph [ref=e205]: ຈັນທະລາ ສ້ານ
                    - paragraph [ref=e206]: "+8562011000013"
                - cell "ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid)" [ref=e207]
                - cell "15/04/2025 – 15/04/2025" [ref=e208]
                - cell "1 ວັນ" [ref=e209]
                - cell "ກິດທຸລະສ່ວນຕົວ" [ref=e210]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e211]:
                  - generic [ref=e212]:
                    - button "ອນຸມັດ" [ref=e213] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e214] [cursor=pointer]
              - row "ສົມສັກ ວົງສາ +8562011000001 ລາພັກ (Annual) 07/02/2025 – 07/02/2025 1 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e215]:
                - cell "ສົມສັກ ວົງສາ +8562011000001" [ref=e216]:
                  - generic [ref=e217]:
                    - paragraph [ref=e218]: ສົມສັກ ວົງສາ
                    - paragraph [ref=e219]: "+8562011000001"
                - cell "ລາພັກ (Annual)" [ref=e220]
                - cell "07/02/2025 – 07/02/2025" [ref=e221]
                - cell "1 ວັນ" [ref=e222]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e223]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e224]:
                  - generic [ref=e225]:
                    - button "ອນຸມັດ" [ref=e226] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e227] [cursor=pointer]
              - row "ນາລີ ພົມມະ +8562011000002 ລາພັກ (Annual) 09/03/2026 – 13/03/2026 5 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e228]:
                - cell "ນາລີ ພົມມະ +8562011000002" [ref=e229]:
                  - generic [ref=e230]:
                    - paragraph [ref=e231]: ນາລີ ພົມມະ
                    - paragraph [ref=e232]: "+8562011000002"
                - cell "ລາພັກ (Annual)" [ref=e233]
                - cell "09/03/2026 – 13/03/2026" [ref=e234]
                - cell "5 ວັນ" [ref=e235]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e236]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e237]:
                  - generic [ref=e238]:
                    - button "ອນຸມັດ" [ref=e239] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e240] [cursor=pointer]
              - row "ນາລີ ພົມມະ +8562011000002 ລາພັກ (Annual) 09/03/2026 – 13/03/2026 5 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e241]:
                - cell "ນາລີ ພົມມະ +8562011000002" [ref=e242]:
                  - generic [ref=e243]:
                    - paragraph [ref=e244]: ນາລີ ພົມມະ
                    - paragraph [ref=e245]: "+8562011000002"
                - cell "ລາພັກ (Annual)" [ref=e246]
                - cell "09/03/2026 – 13/03/2026" [ref=e247]
                - cell "5 ວັນ" [ref=e248]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e249]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e250]:
                  - generic [ref=e251]:
                    - button "ອນຸມັດ" [ref=e252] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e253] [cursor=pointer]
              - row "ບຸນມີ ສີສຸວັນ +8562011000004 ລາພັກ (Annual) 12/04/2025 – 14/04/2025 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e254]:
                - cell "ບຸນມີ ສີສຸວັນ +8562011000004" [ref=e255]:
                  - generic [ref=e256]:
                    - paragraph [ref=e257]: ບຸນມີ ສີສຸວັນ
                    - paragraph [ref=e258]: "+8562011000004"
                - cell "ລາພັກ (Annual)" [ref=e259]
                - cell "12/04/2025 – 14/04/2025" [ref=e260]
                - cell "3 ວັນ" [ref=e261]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e262]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e263]:
                  - generic [ref=e264]:
                    - button "ອນຸມັດ" [ref=e265] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e266] [cursor=pointer]
              - row "ບຸນມີ ສີສຸວັນ +8562011000004 ລາພັກ (Annual) 12/04/2025 – 14/04/2025 3 ວັນ ຂໍລາພັກປະຈຳປີ ອນຸມັດ ປະຕິເສດ" [ref=e267]:
                - cell "ບຸນມີ ສີສຸວັນ +8562011000004" [ref=e268]:
                  - generic [ref=e269]:
                    - paragraph [ref=e270]: ບຸນມີ ສີສຸວັນ
                    - paragraph [ref=e271]: "+8562011000004"
                - cell "ລາພັກ (Annual)" [ref=e272]
                - cell "12/04/2025 – 14/04/2025" [ref=e273]
                - cell "3 ວັນ" [ref=e274]
                - cell "ຂໍລາພັກປະຈຳປີ" [ref=e275]
                - cell "ອນຸມັດ ປະຕິເສດ" [ref=e276]:
                  - generic [ref=e277]:
                    - button "ອນຸມັດ" [ref=e278] [cursor=pointer]
                    - button "ປະຕິເສດ" [ref=e279] [cursor=pointer]
      - contentinfo [ref=e280]:
        - paragraph [ref=e281]: POWERBY SKV Group · © 2026
  - generic [ref=e282]:
    - img [ref=e284]
    - button "Open Tanstack query devtools" [ref=e332] [cursor=pointer]:
      - img [ref=e333]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { loginAs } from './helpers/auth'
  3  | 
  4  | test.describe('Branch Isolation', () => {
  5  |   test('BRANCH_MANAGER (ສາຍລົມ) should not see employees from other branches in attendance page', async ({ page }) => {
  6  |     await loginAs(page, 'branchManager')
  7  |     await page.goto('/hr/attendance')
  8  |     await page.waitForLoadState('networkidle')
  9  | 
  10 |     // Wait for either table rows or the empty-state message
  11 |     await expect(
  12 |       page.locator('table tbody tr').first()
  13 |         .or(page.locator('text=ບໍ່ມີຂໍ້ມູນ'))
  14 |     ).toBeVisible({ timeout: 15_000 })
  15 | 
  16 |     const pageText = await page.locator('body').innerText()
  17 | 
  18 |     // Employees from branch ປາກເຊ must NOT appear
  19 |     expect(pageText).not.toContain('ຈັນທະລາ')  // ຈັນທະລາ ສ້ານ — branch ປາກເຊ
  20 |     expect(pageText).not.toContain('ນ້ຳຟ້າ')    // ນ້ຳຟ້າ ລາດ — branch ປາກເຊ
  21 |   })
  22 | 
  23 |   test('HR_ADMIN should see employees from all branches in /hr/employees', async ({ page }) => {
  24 |     await loginAs(page, 'hrAdmin')
  25 |     await page.goto('/hr/employees')
  26 |     await page.waitForLoadState('networkidle')
  27 | 
  28 |     await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10_000 })
  29 | 
  30 |     const tableText = await page.locator('table').innerText()
  31 | 
  32 |     // Must contain employees from multiple branches
  33 |     expect(tableText).toContain('ວິໄລ')       // branch ສາຍລົມ
  34 |     expect(tableText).toContain('ຈັນທະລາ')    // branch ປາກເຊ
  35 | 
  36 |     // Row count must exceed a single branch's employee count
  37 |     const rowCount = await page.locator('table tbody tr').filter({ hasNotText: 'ບໍ່ມີ' }).count()
  38 |     expect(rowCount).toBeGreaterThan(4)
  39 |   })
  40 | 
  41 |   // [BUG] BRANCH_MANAGER sees leave requests from other branches (e.g. ຈັນທະລາ from branch ປາກເຊ)
  42 |   // Backend /leave/pending does not filter by branchId for BRANCH_MANAGER role
  43 |   // This test documents the bug — it currently FAILS and should be fixed in the backend
  44 |   test('[BUG] BRANCH_MANAGER should see only own-branch leave requests', async ({ page }) => {
  45 |     await loginAs(page, 'branchManager')
  46 |     await page.goto('/hr/leave')
  47 |     await page.waitForLoadState('networkidle')
  48 | 
  49 |     await expect(
  50 |       page.locator('table tbody tr').first()
  51 |         .or(page.locator('text=ບໍ່ມີຄຳຂໍລໍຖ້າ'))
  52 |     ).toBeVisible({ timeout: 10_000 })
  53 | 
  54 |     const tableText = await page.locator('table').innerText()
  55 | 
  56 |     // These assertions document the EXPECTED behavior after the bug is fixed
> 57 |     expect(tableText).not.toContain('ຈັນທະລາ')  // branch ປາກເຊ — must not appear
     |                           ^ Error: expect(received).not.toContain(expected) // indexOf
  58 |     expect(tableText).not.toContain('ນ້ຳຟ້າ')    // branch ປາກເຊ — must not appear
  59 |     expect(tableText).not.toContain('ວັນນະ')      // branch ປາກເຊ — must not appear
  60 |   })
  61 | })
  62 | 
```