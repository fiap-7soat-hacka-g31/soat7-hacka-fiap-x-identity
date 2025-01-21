import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { SignUpCommand } from '../application/commands/sign-up.command';
import { SignUpController } from './sign-up.controller';

describe('SignUpController', () => {
  let target: SignUpController;
  let commandBus: CommandBus;

  const userInfo = {
    name: 'Jack Sparrow',
    email: 'jack@sparrow.com',
    password: 'j@cK!123',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [SignUpController],
    }).compile();

    target = app.get(SignUpController);
    commandBus = app.get(CommandBus);
  });

  it('should execute SignUpCommand', async () => {
    jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue({ data: { access_token: randomUUID() } });

    const result = await target.execute({ ...userInfo });
    expect(commandBus.execute).toHaveBeenCalledWith(
      new SignUpCommand({ ...userInfo }),
    );
    expect(result.access_token).toEqual(expect.any(String));
  });

  it('should throw if commandBus throws', async () => {
    const err = new Error('Too Bad');
    jest.spyOn(commandBus, 'execute').mockRejectedValue(err);
    await expect(() => target.execute({ ...userInfo })).rejects.toThrow(err);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new SignUpCommand({ ...userInfo }),
    );
  });
});
