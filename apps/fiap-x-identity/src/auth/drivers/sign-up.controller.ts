import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../application/commands/sign-up.command';
import { SignUpInput, SignUpOutput } from '../application/dtos/sign-up.io';

@Controller({ version: '1', path: 'auth' })
export class SignUpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  async execute(@Body() input: SignUpInput): Promise<SignUpOutput> {
    const result = await this.commandBus.execute(new SignUpCommand(input));
    return result.data;
  }
}
