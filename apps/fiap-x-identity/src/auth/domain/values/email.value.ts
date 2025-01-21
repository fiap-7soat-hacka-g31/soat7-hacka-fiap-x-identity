import { isEmail } from 'class-validator';

export class Email {
  constructor(private readonly _value: string) {
    this.validate();
  }

  get value() {
    return this._value;
  }

  private validate() {
    if (!isEmail(this._value)) {
      throw new Error(`Invalid Email: ${this._value}`);
    }
  }
}
