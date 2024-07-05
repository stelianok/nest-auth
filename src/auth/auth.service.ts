import { BadRequestException, Injectable } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

const users = [];

@Injectable()
export class AuthService {
  async signUp(email: string, password: string) {

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = await scrypt(password, salt, 32) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const user = {
      email,
      password: saltAndHash
    };

    users.push(user);

    console.log('Signed up', user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    return result;
  }

}
