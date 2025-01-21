import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../../infra/adapters/token-providers/token.service';
import { TokenProvider } from '../abstractions/token.provider';
import { VerifyTokenCommand } from './verify-token.command';
import { VerifyTokenHandler } from './verify-token.handler';

describe('VerifyTokenHandler', () => {
  let target: VerifyTokenHandler;
  let tokenService: TokenProvider;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyTokenHandler,
        {
          provide: TokenProvider,
          useValue: Object.create(TokenService.prototype),
        },
      ],
    }).compile();

    target = moduleFixture.get(VerifyTokenHandler);
    tokenService = moduleFixture.get(TokenProvider);
  });

  it('should return void if token is valid', async () => {
    jest.spyOn(tokenService, 'verify').mockResolvedValue(true);
    const command = new VerifyTokenCommand({ accessToken: 'valid' });
    const result = await target.execute(command);
    expect(tokenService.verify).toHaveBeenCalled();
    expect(result).not.toBeDefined();
  });

  it('should return void if token is not valid', async () => {
    jest.spyOn(tokenService, 'verify').mockResolvedValue(false);
    const command = new VerifyTokenCommand({ accessToken: 'not valid' });
    await expect(async () => await target.execute(command)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(tokenService.verify).toHaveBeenCalled();
  });
});
