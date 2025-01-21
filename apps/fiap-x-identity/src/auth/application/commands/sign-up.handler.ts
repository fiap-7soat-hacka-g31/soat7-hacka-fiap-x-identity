import { Transactional } from '@fiap-x/tactical-design/core';
import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user.aggregate';
import { Email } from '../../domain/values/email.value';
import {
  EPasswordAlgorithm,
  Password,
} from '../../domain/values/password.value';
import { TokenProvider } from '../abstractions/token.provider';
import { UserRepository } from '../abstractions/user.repository';
import { SignUpOutput } from '../dtos/sign-up.io';
import { SignUpCommand, SignUpResult } from './sign-up.command';

@CommandHandler(SignUpCommand)
export class SignUpHandler
  implements ICommandHandler<SignUpCommand, SignUpResult>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenProvider: TokenProvider,
  ) {}

  @Transactional()
  async execute(command: SignUpCommand): Promise<SignUpResult> {
    const { name, email, password } = command.data;
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException();
    }
    const id = this.repository.newId();
    const user = new User(
      id,
      name,
      new Email(email),
      Password.fromPlain(password, EPasswordAlgorithm.PBKDF2),
    );
    user.signUp();
    await this.repository.create(user);
    await user.commit();
    const token = await this.tokenProvider.signJwt(user.getClaims());
    return new SignUpResult(new SignUpOutput({ access_token: token }));
  }
}
