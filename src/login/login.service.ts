import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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

      if ((this.validate(dto), 'new')) {
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
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  async validate(dto: userI, type = '') {
    let users = this.getAll();

    if (type == 'new') {
      users.forEach(({ login, password, id }) => {
        if (login === dto.login) {
          return { message: 'user added' };
        }
      });
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
      }
    }
  }

  signup(dto: userI) {
    let res = this.write(dto);
    return res;
  }

  async signin(dto: userI) {
    return await this.validate(dto);
  }
  all() {
    return this.getAll();
  }
}
