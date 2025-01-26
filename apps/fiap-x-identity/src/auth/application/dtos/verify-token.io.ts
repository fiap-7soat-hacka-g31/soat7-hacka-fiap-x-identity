import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class VerifyTokenInput {
  @ApiProperty()
  @IsJWT()
  accessToken: string;
}
