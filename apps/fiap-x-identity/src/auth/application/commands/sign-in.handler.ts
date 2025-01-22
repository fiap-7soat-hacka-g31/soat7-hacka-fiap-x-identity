import { Transactional } from '@fiap-x/tactical-design/core';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenProvider } from '../abstractions/token.provider';
import { UserRepository } from '../abstractions/user.repository';
import { SignInOutput } from '../dtos/sign-in.io';
import { SignInCommand, SignInResult } from './sign-in.command';

@CommandHandler(SignInCommand)
export class SignInHandler
  implements ICommandHandler<SignInCommand, SignInResult>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenProvider: TokenProvider,
  ) {}

  @Transactional()
  async execute(command: SignInCommand): Promise<SignInResult> {
    const { email, password } = command.data;

    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    user.signIn(password);

    const token = await this.tokenProvider.signJwt(user.getClaims());
    return new SignInResult(new SignInOutput({ access_token: token }));
  }
}
