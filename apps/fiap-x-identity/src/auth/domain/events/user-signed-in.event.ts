import { DomainEvent } from '@fiap-x/tactical-design/core';

export class UserSignedIn extends DomainEvent {
  constructor(public readonly id: string) {
    super();
  }
}
