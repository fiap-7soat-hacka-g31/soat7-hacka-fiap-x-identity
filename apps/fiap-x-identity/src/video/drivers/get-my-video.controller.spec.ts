import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { GetMyVideoQuery } from '../application/query/get-my-video.query';
import { GetMyVideoController } from './get-my-video.controller';

describe('GetMyVideoController', () => {
  let target: GetMyVideoController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [GetMyVideoController],
    }).compile();

    target = app.get(GetMyVideoController);
    queryBus = app.get(QueryBus);
  });

  it('should execute GetMyVideoQuery', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValue({ data: {} });
    const result = await target.execute(new Types.ObjectId().toHexString());
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetMyVideoQuery({
        id: expect.any(String),
        ownerId: expect.any(String),
      }),
    );
    expect(result).toBeDefined();
  });

  it('should throw if QueryBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(queryBus, 'execute').mockRejectedValue(err);
    await expect(() =>
      target.execute(new Types.ObjectId().toHexString()),
    ).rejects.toThrow(err);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetMyVideoQuery({
        id: expect.any(String),
        ownerId: expect.any(String),
      }),
    );
  });
});
