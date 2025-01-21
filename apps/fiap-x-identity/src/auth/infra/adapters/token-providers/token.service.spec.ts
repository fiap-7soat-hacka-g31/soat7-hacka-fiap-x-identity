import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenProvider } from '../../../application/abstractions/token.provider';
import { Claims } from '../../../domain/values/claims.value';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let target: TokenProvider;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: Object.create(JwtService.prototype),
        },
        {
          provide: TokenProvider,
          useClass: TokenService,
        },
      ],
    }).compile();

    target = moduleFixture.get(TokenProvider);
    jwtService = moduleFixture.get(JwtService);
  });

  it('should sign jwt', async () => {
    const fakeToken = 'token';
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(fakeToken);
    const result = await target.signJwt(
      new Claims('id:123', 'some@email.com', 'John Doe'),
    );
    expect(result).toBe(fakeToken);
  });
});
