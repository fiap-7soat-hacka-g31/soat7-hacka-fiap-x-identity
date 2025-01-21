import { UnauthorizedException } from '@nestjs/common';

export class InvalidUserPassword extends UnauthorizedException {}
