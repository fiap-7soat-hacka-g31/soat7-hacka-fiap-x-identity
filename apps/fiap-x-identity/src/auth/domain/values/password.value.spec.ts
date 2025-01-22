import { Password } from './password.value';

describe('Password', () => {
  it('should throw if unknown algorithm is provided', () => {
    expect(() =>
      Password.fromPlain('some@password', 'UNKNOWN' as any),
    ).toThrow();
  });
});
