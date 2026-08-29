import { expect, test } from '@playwright/test'

test('the page loads with the identity block and a reachable CV', async ({ page, request }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('ömer yusuf sorhun')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  const cv = await request.get('/cv.pdf')
  expect(cv.status()).toBe(200)
})

test('the theme switch flips the document and survives a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /switch colour theme/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
