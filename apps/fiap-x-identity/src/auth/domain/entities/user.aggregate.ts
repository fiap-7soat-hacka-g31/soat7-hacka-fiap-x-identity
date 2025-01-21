import { AggregateRoot } from '@fiap-x/tactical-design/core';
import { InvalidUserPassword } from '../errors/invalid-user-password.exception';
import { UserSignedIn } from '../events/user-signed-in.event';
import { UserSignedUp } from '../events/user-signed-up.event';
import { Claims } from '../values/claims.value';
import { Email } from '../values/email.value';
import { Password } from '../values/password.value';

export class User extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private readonly _name: string,
    private readonly _email: Email,
    private readonly _password: Password,
  ) {
    super(_id);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email.value;
  }

  get password() {
    return Password.clone(this._password);
  }

  getClaims() {
    return new Claims(this._id, this._email.value, this._name);
  }

  signUp() {
    this.apply(new UserSignedUp(this._id, this._name, this._email.value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUserSignedUp(event: UserSignedUp) {
    // noop
  }

  signIn(password: string) {
    if (!this.checkPassword(password)) {
      throw new InvalidUserPassword();
    }
    this.apply(new UserSignedIn(this._id));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUserSignedIn(event: UserSignedIn) {
    // noop
  }

  private checkPassword(password: string): boolean {
    return this._password.validate(password);
  }
}
