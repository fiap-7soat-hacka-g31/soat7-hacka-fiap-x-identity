import { destroyTestApp } from '@fiap-x/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './create-app';

describe('POST /v1/auth/sign-in', () => {
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
    email: `${randomUUID().split('-').at(0)}-jack@sparrow.com`,
    password: 'j@cK!123',
  });

  it('should return 201 with an access_token if everything matches', async () => {
    const payload = getUserPayload();
    await request(server).post('/v1/auth/sign-up').send(payload);
    const response = await request(server)
      .post('/v1/auth/sign-in')
      .send(payload);

    const { statusCode, body } = response;
    expect(statusCode).toBe(201);
    expect(body).toEqual({ access_token: expect.any(String) });
  });

  it('should return 401 if user does not exist', async () => {
    const response = await request(server)
      .post('/v1/auth/sign-in')
      .send(getUserPayload());
    const { statusCode, body } = response;
    expect(statusCode).toBe(401);
    expect(body).not.toEqual({ access_token: expect.any(String) });
  });

  it('should return 401 if user password does not match', async () => {
    const payload = getUserPayload();
    await request(server).post('/v1/auth/sign-up').send(payload);

    payload.password = `${payload.password}Mismatch`;
    const response = await request(server)
      .post('/v1/auth/sign-in')
      .send({ ...payload, password: `${payload.password}Mismatch` });

    const { statusCode, body } = response;
    expect(statusCode).toBe(401);
    expect(body).not.toEqual({ access_token: expect.any(String) });
  });
});
