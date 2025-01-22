import { destroyTestApp } from '@fiap-x/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './create-app';

describe('POST /v1/auth/sign-up', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  const getUserPayload = () => ({
    name: 'Jack Sparrow',
    email: 'jack@sparrow.com',
    password: 'j@cK!123',
  });

  it('should signup new user', async () => {
    const response = await request(server)
      .post('/v1/auth/sign-up')
      .send(getUserPayload());
    const { statusCode, body } = response;
    expect(statusCode).toBe(201);
    expect(body).toEqual({ access_token: expect.any(String) });
  });

  it('should return 409 if user already exists', async () => {
    const makeRequest = () =>
      request(server).post('/v1/auth/sign-up').send(getUserPayload());
    await makeRequest();
    const response = await makeRequest();
    const { statusCode } = response;
    expect(statusCode).toBe(409);
  });
});
