import { Email } from './email.value';

describe('Email', () => {
  it('should throw if value is not a valid email', () => {
    expect(() => new Email('dummy')).toThrow();
  });
});
