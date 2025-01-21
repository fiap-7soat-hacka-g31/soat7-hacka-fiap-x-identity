import { SignInInput, SignInOutput } from '../dtos/sign-in.io';

export class SignInCommand {
  constructor(readonly data: SignInInput) {}
}

export class SignInResult {
  constructor(readonly data: SignInOutput) {}
}
