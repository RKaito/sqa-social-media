import { expect, test } from '@playwright/test';

const validPassword = 'Senha@123';

function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}.${test.info().workerIndex}@example.com`;
}

test.describe('API - autenticacao', () => {
  test('POST /auth/signup cria usuario com dados validos', async ({ request }) => {
    const email = uniqueEmail('signup.success');

    const response = await request.post('/auth/signup', {
      data: { email, password: validPassword },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ email });
    expect(body.id).toEqual(expect.any(Number));
  });

  test('POST /auth/signup rejeita email duplicado', async ({ request }) => {
    const email = uniqueEmail('signup.duplicado');

    const firstResponse = await request.post('/auth/signup', {
      data: { email, password: validPassword },
    });
    expect(firstResponse.status()).toBe(200);

    const duplicateResponse = await request.post('/auth/signup', {
      data: { email, password: validPassword },
    });

    expect(duplicateResponse.status()).toBe(409);

    const body = await duplicateResponse.json();
    expect(body.message).toContain('uso');
    expect(body.status).toBe(409);
  });

  test('POST /auth/signin autentica usuario cadastrado', async ({ request }) => {
    const email = uniqueEmail('signin.success');

    const signupResponse = await request.post('/auth/signup', {
      data: { email, password: validPassword },
    });
    expect(signupResponse.status()).toBe(200);

    const response = await request.post('/auth/signin', {
      data: { email, password: validPassword },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ email });
    expect(body.id).toEqual(expect.any(Number));
  });

  test('POST /auth/signin rejeita senha incorreta', async ({ request }) => {
    const email = uniqueEmail('signin.invalid');

    const signupResponse = await request.post('/auth/signup', {
      data: { email, password: validPassword },
    });
    expect(signupResponse.status()).toBe(200);

    const response = await request.post('/auth/signin', {
      data: { email, password: 'Senha@456' },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toContain('Credenciais');
    expect(body.status).toBe(401);
  });
});
