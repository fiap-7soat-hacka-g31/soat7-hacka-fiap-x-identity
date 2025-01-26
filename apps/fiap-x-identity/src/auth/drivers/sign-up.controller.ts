import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SignUpCommand } from '../application/commands/sign-up.command';
import { SignUpInput, SignUpOutput } from '../application/dtos/sign-up.io';

@ApiTags('Auth')
@Controller({ version: '1', path: 'auth' })
export class SignUpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiCreatedResponse({ type: SignUpOutput })
  @Post('sign-up')
  async execute(@Body() input: SignUpInput): Promise<SignUpOutput> {
    const result = await this.commandBus.execute(new SignUpCommand(input));
    return result.data;
  }
}
