import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { v4 as uuid } from "uuid";

import { promisify } from 'util';

const scrypt = promisify(_scrypt);

const users = [];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async signUp(email: string, password: string, roles: string[] = []) {
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = await scrypt(password, salt, 32) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const user = {
      id: uuid(),
      email,
      password: saltAndHash,
      roles,
    };

    users.push(user);

    console.log('Signed up', user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    return result;
  }

  async signIn(email: string, password: string) {
    const user = users.find((user) => user.email === email);
    if (!user) {
      return new UnauthorizedException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash != hash.toString('hex')) {
      return new UnauthorizedException('Invalid credentials');
    }

    console.log('Signed in', user);
    const payload = {
      username: user.email,
      sub: user.id,
      roles: user.roles
    };

    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: '60s' },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '1h' }
    )

    user.refreshToken = refreshToken;

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = users.find(
      (user) => user.id === payload.sub && user.refreshToken === refreshToken)

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload = {
      username: user.email,
      sub: user.id,
      roles: user.roles
    };

    const newAccessToken = this.jwtService.sign(
      { ...newPayload, type: 'access' },
      { expiresIn: '60s' },
    );

    const newRefreshToken = this.jwtService.sign(
      { ...newPayload, type: 'refresh' },
      { expiresIn: '1h' }
    )

    user.refreshToken = newRefreshToken;

    return { newAccessToken, newRefreshToken };
  }
}
