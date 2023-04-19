import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'This is a secret: move to env',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateJwt(payload.sub, payload.email);

    if (!user) throw new UnauthorizedException('Invalid Token.');

    return user;
  }
}
