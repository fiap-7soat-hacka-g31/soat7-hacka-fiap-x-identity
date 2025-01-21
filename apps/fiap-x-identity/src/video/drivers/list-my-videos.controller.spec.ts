import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ListMyVideosQuery } from '../application/query/list-my-videos.query';
import { ListMyVideosController } from './list-my-videos.controller';

describe('ListMyVideosController', () => {
  let target: ListMyVideosController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ListMyVideosController],
    }).compile();

    target = app.get(ListMyVideosController);
    queryBus = app.get(QueryBus);
  });

  it('should execute ListMyVideosQuery', async () => {
    jest.spyOn(queryBus, 'execute').mockResolvedValue({ data: [] });
    const result = await target.execute();
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListMyVideosQuery({ ownerId: expect.any(String) }),
    );
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should throw if QueryBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(queryBus, 'execute').mockRejectedValue(err);
    await expect(() => target.execute()).rejects.toThrow(err);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new ListMyVideosQuery({ ownerId: expect.any(String) }),
    );
  });
});
