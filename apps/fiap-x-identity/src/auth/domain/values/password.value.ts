import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

export enum EPasswordAlgorithm {
  PBKDF2 = 'pbkdf2',
}

export type PasswordAlgorithm = `${EPasswordAlgorithm}`;

export abstract class Password {
  protected readonly _value: string;
  protected readonly _salt: string;
  protected abstract readonly _algorithm: PasswordAlgorithm;

  protected abstract hash(plainValue: string, salt: string): Buffer;

  constructor(value: string, salt: string, isNew: boolean = false) {
    this._value = isNew ? this.hashPassword(value, salt) : value;
    this._salt = salt;
  }

  get value() {
    return this._value;
  }

  get salt() {
    return this._salt;
  }

  get algorithm() {
    return this._algorithm;
  }

  static fromPlain(plainValue: string, algorithm: PasswordAlgorithm) {
    const salt = this.generateSalt();
    const TargetPassword = this.getPasswordConstructor(algorithm);
    return new TargetPassword(plainValue, salt, true);
  }

  static fromHash(
    hashValue: string,
    salt: string,
    algorithm: PasswordAlgorithm,
  ) {
    const TargetPassword = this.getPasswordConstructor(algorithm);
    return new TargetPassword(hashValue, salt, false);
  }

  static clone(password: Password): Password {
    return this.fromHash(password._value, password._salt, password._algorithm);
  }

  validate(password: string): boolean {
    const hash = this.hash(password, this._salt).toString('hex');
    return timingSafeEqual(Buffer.from(this._value), Buffer.from(hash));
  }

  private hashPassword(value: string, salt: string) {
    return this.hash(value, salt).toString('hex');
  }

  private static generateSalt() {
    return randomBytes(36).toString('hex');
  }

  private static getPasswordConstructor(algorithm: PasswordAlgorithm) {
    if (algorithm === 'pbkdf2') {
      return PBKDF2Password;
    }
    throw new Error(`${algorithm} is not a valid PasswordAlgorithm`);
  }
}

export class PBKDF2Password extends Password {
  protected readonly _algorithm: PasswordAlgorithm = 'pbkdf2';

  protected hash(value: string, salt: string) {
    return pbkdf2Sync(value, salt, 10000, 256, 'sha512');
  }
}
