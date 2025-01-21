import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenProvider } from '../../../application/abstractions/token.provider';
import { Claims } from '../../../domain/values/claims.value';

@Injectable()
export class TokenService implements TokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  async signJwt(claims: Claims): Promise<string> {
    const { id: sub, ...otherProps } = claims;
    const payload = {
      sub,
      ...otherProps,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async verify(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      return false;
    }
  }
}
