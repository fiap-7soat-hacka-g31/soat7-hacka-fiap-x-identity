import { IsEmail, IsString } from 'class-validator';
import { AccessToken } from './token.dto';

export class SignInInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignInOutput extends AccessToken {}
