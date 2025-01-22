import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignInCommand } from '../application/commands/sign-in.command';
import { SignInInput, SignInOutput } from '../application/dtos/sign-in.io';

@Controller({ version: '1', path: 'auth' })
export class SignInController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-in')
  async execute(@Body() input: SignInInput): Promise<SignInOutput> {
    const result = await this.commandBus.execute(new SignInCommand(input));
    return result.data;
  }
}
