import { destroyTestApp } from '@fiap-x/test-factory/utils';
import { INestApplication } from '@nestjs/common';
import { Types } from 'mongoose';
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

  it('should return not found if no videos exsit', async () => {
    const id = new Types.ObjectId().toHexString();
    const response = await request(server).get(`/v1/me/videos/${id}`);
    const { statusCode } = response;
    expect(statusCode).toBe(404);
  });

  it('should list existing videos', async () => {
    const createResponse = await request(server)
      .post('/v1/videos/upload')
      .attach('file', getVideoPath());
    const { id } = createResponse.body;

    const response = await request(server).get(`/v1/me/videos/${id}`);

    const { statusCode, body } = response;
    expect(statusCode).toBe(200);
    expect(body.id).toBe(id);
  });
});
