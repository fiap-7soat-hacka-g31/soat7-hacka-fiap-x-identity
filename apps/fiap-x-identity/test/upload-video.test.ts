import { destroyTestApp } from '@fiap-x/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './create-app';
import { getVideoPath } from './utils/utils';

describe('POST /v1/videos/upload', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await destroyTestApp(app);
  });

  it('should upload a new video', async () => {
    const response = await request(server)
      .post('/v1/videos/upload')
      .attach('file', getVideoPath());
    const { statusCode, body } = response;
    expect(statusCode).toBe(201);
    expect(body).toEqual({ id: expect.any(String) });

    // TODO: When other endpoints exist, enrich this test
    // await setTimeout(250);

    // const { id: paymentId } = body;

    // const paymentResponse = await request(server).get(
    //   `/v1/payments/${paymentId}`,
    // );
    // expect(paymentResponse.statusCode).toBe(200);
    // expect(paymentResponse.body).toEqual(
    //   expect.objectContaining({ id: paymentId }),
    // );
    // expect(['Created', 'Drafted']).toContain(paymentResponse.body.status);
  });

  it('should return 409 if video already exists', async () => {
    const makeRequest = () =>
      request(server).post('/v1/videos/upload').attach('file', getVideoPath());
    await makeRequest();
    const response = await makeRequest();
    const { statusCode } = response;
    expect(statusCode).toBe(409);
  });
});
