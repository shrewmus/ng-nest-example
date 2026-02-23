import { expect, test } from '@playwright/test';

test('admin creates a poll and list count increases', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Login with Keycloak' }).click();

  await page.getByLabel('Username or email').fill('admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.goto('/polls');
  await page.getByRole('button', { name: 'Load polls' }).click();

  const before = await page.locator('ul > li').count();

  await page.goto('/create-poll');
  await page.getByRole('button', { name: 'Add poll' }).click();
  await page.getByRole('button', { name: 'Create poll' }).click();

  const suffix = Date.now();
  await page.getByLabel('Title').fill(`Poll ${suffix}`);
  await page.getByLabel('Option A').fill('Alpha');
  await page.getByLabel('Option B').fill('Beta');
  await page.getByRole('button', { name: 'Submit poll' }).click();

  await page.getByRole('button', { name: 'Load polls' }).click();
  const after = await page.locator('ul > li').count();

  expect(after).toBeGreaterThan(before);
});
