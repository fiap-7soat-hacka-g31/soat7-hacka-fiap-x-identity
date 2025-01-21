import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { VerifyTokenCommand } from '../application/commands/verify-token.command';
import { VerifyTokenInput } from '../application/dtos/verify-token.io';

@Controller({ version: '1', path: 'auth' })
export class VerifyTokenController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('verify')
  @HttpCode(200)
  async execute(@Body() input: VerifyTokenInput): Promise<void> {
    await this.commandBus.execute(new VerifyTokenCommand(input));
  }
}
