import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UploadVideoCommand } from '../application/commands/upload-video.command';
import { UploadVideoController } from './upload-video.controller';

describe('UploadVideoController', () => {
  let target: UploadVideoController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UploadVideoController],
    }).compile();

    target = app.get(UploadVideoController);
    commandBus = app.get(CommandBus);
  });

  it('should execute UploadVideoCommand', async () => {
    const id = randomUUID();
    jest.spyOn(commandBus, 'execute').mockResolvedValue({ data: { id } });
    const buffer = Buffer.from('');
    const filename = 'video.mp4';
    const result = await target.execute(
      { snapshotIntervalInSeconds: 5 } as any,
      {
        originalname: filename,
        buffer,
      } as any,
    );
    expect(commandBus.execute).toHaveBeenCalledWith(
      new UploadVideoCommand({
        content: buffer,
        filename,
        snapshotIntervalInSeconds: expect.any(Number),
        ownerId: expect.any(String),
      }),
    );
    expect(result.id).toBe(id);
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    const buffer = Buffer.from('');
    const filename = 'video.mp4';
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    await expect(() =>
      target.execute(
        { snapshotIntervalInSeconds: 5 } as any,
        {
          originalname: filename,
          buffer,
        } as any,
      ),
    ).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new UploadVideoCommand({
        content: buffer,
        filename,
        ownerId: expect.any(String),
        snapshotIntervalInSeconds: expect.any(Number),
      }),
    );
  });
});
