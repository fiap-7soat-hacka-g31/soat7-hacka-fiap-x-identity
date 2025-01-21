import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SignInSuite } from './step-definitions/sign-in.suite';
import { SignUpSuite } from './step-definitions/sign-up.suite';
@Module({
  imports: [HttpModule],
  providers: [SignUpSuite, SignInSuite],
})
export class AppModule {}
