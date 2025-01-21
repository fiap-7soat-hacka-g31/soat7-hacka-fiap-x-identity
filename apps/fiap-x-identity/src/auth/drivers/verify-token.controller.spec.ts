import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenCommand } from '../application/commands/verify-token.command';
import { VerifyTokenInput } from '../application/dtos/verify-token.io';
import { VerifyTokenController } from './verify-token.controller';

describe('VerifyTokenController', () => {
  let target: VerifyTokenController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [VerifyTokenController],
    }).compile();

    target = app.get(VerifyTokenController);
    commandBus = app.get(CommandBus);
  });

  it('should execute VerifyTokenCommand', async () => {
    jest.spyOn(commandBus, 'execute').mockResolvedValue(null);

    const input = Object.assign(new VerifyTokenInput(), {
      accessToken: 'token',
    });
    const result = await target.execute(input);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new VerifyTokenCommand({ ...input }),
    );
    expect(result).not.toBeDefined();
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    const input = Object.assign(new VerifyTokenInput(), {
      accessToken: 'token',
    });

    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    await expect(() => target.execute({ ...input })).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new VerifyTokenCommand({ ...input }),
    );
  });
});
