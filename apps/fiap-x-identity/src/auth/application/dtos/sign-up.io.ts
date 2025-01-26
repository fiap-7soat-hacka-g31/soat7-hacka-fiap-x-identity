import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { AccessToken } from './token.dto';

export class SignUpInput {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class SignUpOutput extends AccessToken {}
