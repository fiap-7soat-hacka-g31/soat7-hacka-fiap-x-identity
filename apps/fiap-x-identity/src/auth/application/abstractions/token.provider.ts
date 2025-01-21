import { Claims } from '../../domain/values/claims.value';

export abstract class TokenProvider {
  abstract signJwt(claims: Claims): Promise<string>;
  abstract verify(token: string): Promise<boolean>;
}
