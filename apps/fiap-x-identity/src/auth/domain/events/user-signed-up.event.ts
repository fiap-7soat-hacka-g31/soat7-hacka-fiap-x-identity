import { DomainEvent } from '@fiap-x/tactical-design/core';

export class UserSignedUp extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
  ) {
    super();
  }
}
