import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SignUpSuite } from './step-definitions/sign-up.suite';
@Module({
  imports: [HttpModule],
  providers: [SignUpSuite],
})
export class AppModule {}
