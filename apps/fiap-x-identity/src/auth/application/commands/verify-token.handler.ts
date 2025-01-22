import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenProvider } from '../abstractions/token.provider';
import { VerifyTokenCommand } from './verify-token.command';

@CommandHandler(VerifyTokenCommand)
export class VerifyTokenHandler
  implements ICommandHandler<VerifyTokenCommand, void>
{
  constructor(private readonly tokenProvider: TokenProvider) {}

  async execute(command: VerifyTokenCommand): Promise<void> {
    const { accessToken } = command.data;
    const isValid = await this.tokenProvider.verify(accessToken);
    if (!isValid) {
      throw new UnauthorizedException();
    }
  }
}
