import { IsJWT } from 'class-validator';

export class VerifyTokenInput {
  @IsJWT()
  accessToken: string;
}
