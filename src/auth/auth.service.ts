import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthToken } from './dto/auth-token.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user.validatePassword(pass))
      throw new UnauthorizedException('Invalid email/password combo.');

    return user;
  }

  async validateJwt(id: string, email: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!(user._id.toString() === id))
      throw new UnauthorizedException('Invalid Token');

    return user;
  }

  async login(user: UserDocument): Promise<AuthToken> {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.genToken(payload),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const result = await this.usersService.create(signUpDto);

    const { ...userDoc } = result;
    const { password, ...user } = (userDoc as any)._doc;
    const payload = { email: user.email, sub: user._id };

    return {
      user,
      access_token: this.genToken(payload),
    };
  }

  genToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });
  }

  async googleLogin(
    profile: any,
    accessToken: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    let user = await this.usersService.findOne(profile.emails[0].value);

    if (!user)
      user = await this.usersService.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: accessToken,
        providers: [
          {
            name: 'google',
            refreshToken,
            accessToken,
          },
        ],
      });

    return user;
  }
}
