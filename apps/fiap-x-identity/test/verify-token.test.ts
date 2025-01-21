import { destroyTestApp } from '@fiap-x/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './create-app';

describe('POST /v1/auth/verify', () => {
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

  it('should return 200 if token is valid', async () => {
    const payload = getUserPayload();
    const signUpResponse = await request(server)
      .post('/v1/auth/sign-up')
      .send(payload);
    const response = await request(server)
      .post('/v1/auth/verify')
      .send({ accessToken: signUpResponse.body.access_token });

    const { statusCode, body } = response;
    expect(statusCode).toBe(200);
    expect(body).toEqual({});
  });

  it('should return 401 if token is not valid', async () => {
    const payload = getUserPayload();
    const signUpResponse = await request(server)
      .post('/v1/auth/sign-up')
      .send(payload);
    const response = await request(server)
      .post('/v1/auth/verify')
      .send({ accessToken: `${signUpResponse.body.access_token}z` });

    const { statusCode } = response;
    expect(statusCode).toBe(401);
  });
});
