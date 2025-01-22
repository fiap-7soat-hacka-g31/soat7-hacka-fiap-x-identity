import { VerifyTokenInput } from '../dtos/verify-token.io';

export class VerifyTokenCommand {
  constructor(readonly data: VerifyTokenInput) {}
}
