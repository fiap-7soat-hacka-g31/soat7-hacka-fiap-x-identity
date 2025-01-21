import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { SignInController } from './sign-in.controller';
import { SignUpController } from './sign-up.controller';
import { VerifyTokenController } from './verify-token.controller';

const HttpDrivers = [SignUpController, SignInController, VerifyTokenController];

const AmqpDrivers = [];

@Module({
  imports: [CqrsModule, ApplicationModule],
  providers: [...AmqpDrivers],
  controllers: [...HttpDrivers],
})
export class DriversModule {}
