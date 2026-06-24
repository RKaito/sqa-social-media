import { expect, test } from '@playwright/test';

const validPassword = 'Senha@123';

function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}.${test.info().workerIndex}@example.com`;
}

test.describe('E2E - autenticacao', () => {
  test('usuario cria conta, entra autenticado no feed e faz logout', async ({ page }) => {
    const email = uniqueEmail('e2e.signup');

    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Criar Conta' })).toBeVisible();

    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').nth(0).fill(validPassword);
    await page.locator('input[type="password"]').nth(1).fill(validPassword);
    await page.getByRole('button', { name: 'Criar Conta' }).last().click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();

    await page.getByRole('button', { name: 'Sair' }).click();

    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Criar Conta' })).toBeVisible();
  });

  test('usuario sem autenticacao tenta curtir post e recebe alerta', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();

    const firstLikeButton = page.getByRole('button', { name: /Curtir/ }).first();
    await expect(firstLikeButton).toBeVisible({ timeout: 15000 });

    const dialogPromise = page.waitForEvent('dialog');
    await firstLikeButton.click();
    const dialog = await dialogPromise;

    expect(dialog.message()).toContain('autenticado');
    await dialog.accept();

    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });
});
