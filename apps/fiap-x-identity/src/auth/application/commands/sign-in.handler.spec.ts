import { TransactionManager } from '@fiap-x/tactical-design/core';
import {
  FakeRepository,
  FakeTransactionManager,
} from '@fiap-x/test-factory/utils';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { User } from '../../domain/entities/user.aggregate';
import { Email } from '../../domain/values/email.value';
import {
  EPasswordAlgorithm,
  Password,
} from '../../domain/values/password.value';
import { TokenService } from '../../infra/adapters/token-providers/token.service';
import { TokenProvider } from '../abstractions/token.provider';
import { UserRepository } from '../abstractions/user.repository';
import { SignInCommand } from './sign-in.command';
import { SignInHandler } from './sign-in.handler';

describe('SignInHandler', () => {
  let target: SignInHandler;
  let repository: UserRepository;
  let tokenService: TokenProvider;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        SignInHandler,
        {
          provide: TransactionManager,
          useClass: FakeTransactionManager,
        },
        {
          provide: UserRepository,
          useClass: FakeRepository,
        },
        {
          provide: TokenProvider,
          useValue: Object.create(TokenService.prototype),
        },
      ],
    }).compile();

    target = moduleFixture.get(SignInHandler);
    repository = moduleFixture.get(UserRepository);
    tokenService = moduleFixture.get(TokenProvider);
    repository.findByEmail = jest.fn();
    jest
      .spyOn(repository, 'newId')
      .mockReturnValue(new Types.ObjectId().toHexString());
  });

  const getValidPassword = () => 'j@cK!Sp4rr0w';

  const getAggregate = () =>
    new User(
      new Types.ObjectId().toHexString(),
      'Jack Sparrow',
      new Email('jack@sparrow.com'),
      Password.fromPlain(getValidPassword(), EPasswordAlgorithm.PBKDF2),
    );

  const getCommand = (aggregate: User) =>
    new SignInCommand({
      email: aggregate.email,
      password: getValidPassword(),
    });

  it('should sign in with existing user', async () => {
    const aggregate = getAggregate();
    const command = getCommand(aggregate);
    jest.spyOn(tokenService, 'signJwt').mockResolvedValue('token');
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(aggregate);
    const result = await target.execute(command);
    expect(repository.findByEmail).toHaveBeenCalled();
    expect(tokenService.signJwt).toHaveBeenCalled();
    expect(result).toEqual({ data: { access_token: 'token' } });
  });

  it('should throw unauthorized if password does not match', async () => {
    const aggregate = getAggregate();
    const command = getCommand(aggregate);
    command.data.password = 'n0taN!mber';
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(aggregate);
    jest.spyOn(repository, 'create');
    jest.spyOn(tokenService, 'signJwt');
    await expect(async () => await target.execute(command)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(repository.findByEmail).toHaveBeenCalled();
    expect(tokenService.signJwt).not.toHaveBeenCalled();
  });

  it('should throw unauthorized if user does not exist', async () => {
    const aggregate = getAggregate();
    const command = getCommand(aggregate);
    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'create');
    jest.spyOn(tokenService, 'signJwt');
    await expect(async () => await target.execute(command)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(repository.findByEmail).toHaveBeenCalled();
    expect(tokenService.signJwt).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });
});
