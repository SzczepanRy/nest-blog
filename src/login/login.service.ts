import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
interface userI {
  id?: number;
  login: string;
  password: string;
}

@Injectable()
export class LoginService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  getAll() {
    return JSON.parse(
      fs.readFileSync(__dirname + '/../../src/public/db.json', 'utf8'),
    );
  }

  //??
  signToken(userId: number, login: string): Promise<string> {
    const payload = {
      sub: userId,
      login,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '15min',
      secret: secret,
    });
  }

  async write(dto: userI) {
    try {
      let users = this.getAll();
      const hash = await argon.hash(dto.password);
      let res = await this.validate(dto, 'new');

      if (res) {
        console.log('add');

        users.push({
          id: users[users.length - 1].id + 1,
          login: dto.login,
          password: hash,
        });
        fs.writeFileSync(
          __dirname + '/../../src/public/db.json',
          JSON.stringify(users),
          'utf-8',
        );
        return {
          accesToken: await this.signToken(
            users[users.length - 1].id + 1,
            dto.login,
          ),
        };
      } else {
        return { message: 'user with the same login exists' };
      }
    } catch (err) {
      return { error: err };
    }
  }

  async validate(dto: userI, type) {
    let users = this.getAll();

    if (type == 'new') {
      let valid = true;
      console.log('my');

      users.forEach(({ login, password, id }) => {
        if (login === dto.login) {
          valid = false;
        }
      });
      console.log(valid);

      return valid;
    } else if (type == '') {
      console.log('a');

      let usersFound = users.filter(({ login, password, id }) => {
        if (login == dto.login) {
          return { login, password, id };
        }
      });

      if (usersFound.length != 1) {
        return { message: 'user not found' };
      }

      const checkPw = await argon.verify(usersFound[0].password, dto.password);

      if (checkPw) {
        return {
          accesToken: await this.signToken(usersFound[0].id + 1, dto.login),
        };
      } else {
        return {
          err: 'invalid password',
        };
      }
    }
  }

  signup(dto: userI) {
    return this.write(dto);
  }

  async signin(dto: userI) {
    return await this.validate(dto, '');
  }
  all() {
    return this.getAll();
  }
}
