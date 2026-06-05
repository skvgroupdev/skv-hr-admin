import { Page } from '@playwright/test'

// Phone field strips +856 prefix — enter digits only after +856
// e.g. +8562011000002 → enter "2011000002"
export const TEST_ACCOUNTS = {
  hrAdmin:       { phone: '2011000002', password: 'Test@1234', name: 'ນາລີ ພົມມະ' },
  companyOwner:  { phone: '2011000001', password: 'Test@1234', name: 'ສົມສັກ ວົງສາ' },
  branchManager: { phone: '2011000004', password: 'Test@1234', name: 'ບຸນມີ ສີສຸວັນ' },
  staff:         { phone: '2011000007', password: 'Test@1234', name: 'ສຸລິຍາ ແກ້ວມະນີ' },
} as const

export async function loginAs(page: Page, role: keyof typeof TEST_ACCOUNTS) {
  const account = TEST_ACCOUNTS[role]
  await page.goto('/login')

  // Phone input: type="tel" with placeholder "20 XXXX XXXX" registered as 'phone'
  await page.locator('input[type="tel"]').fill(account.phone)
  await page.locator('input[type="password"]').fill(account.password)
  await page.getByRole('button', { name: /ເຂົ້າສູ່ລະບົບ/i }).click()

  // HR roles → /hr/dashboard, STAFF/BRANCH_MANAGER → /employee/home
  await page.waitForURL(/\/(hr|employee|super)\//, { timeout: 15_000 })
}

export async function logout(page: Page) {
  // Attempt sidebar/menu logout button — HR layout
  const logoutBtn = page.getByRole('button', { name: /ອອກຈາກລະບົບ|logout/i })
  if (await logoutBtn.isVisible()) {
    await logoutBtn.click()
  } else {
    // Employee layout may have profile/logout in nav
    await page.getByRole('link', { name: /ອອກຈາກລະບົບ|logout/i }).click()
  }
  await page.waitForURL('/login', { timeout: 10_000 })
}
