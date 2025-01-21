import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { SignInCommand } from '../application/commands/sign-in.command';
import { SignInController } from './sign-in.controller';

describe('SignInController', () => {
  let target: SignInController;
  let commandBus: CommandBus;

  const userInfo = {
    email: 'jack@sparrow.com',
    password: 'j@cK!123',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [SignInController],
    }).compile();

    target = app.get(SignInController);
    commandBus = app.get(CommandBus);
  });

  it('should execute SignInCommand', async () => {
    jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue({ data: { access_token: randomUUID() } });

    const result = await target.execute({ ...userInfo });
    expect(commandBus.execute).toHaveBeenCalledWith(
      new SignInCommand({ ...userInfo }),
    );
    expect(result.access_token).toEqual(expect.any(String));
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    await expect(() => target.execute({ ...userInfo })).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new SignInCommand({ ...userInfo }),
    );
  });
});
