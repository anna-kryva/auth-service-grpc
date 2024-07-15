import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserData } from '../grpc/types/auth/auth';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  async validateUser(accessToken: string): Promise<UserData> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret,
      });

      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
