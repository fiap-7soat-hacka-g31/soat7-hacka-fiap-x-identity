import { SignUpInput, SignUpOutput } from '../dtos/sign-up.io';

export class SignUpCommand {
  constructor(readonly data: SignUpInput) {}
}

export class SignUpResult {
  constructor(readonly data: SignUpOutput) {}
}
