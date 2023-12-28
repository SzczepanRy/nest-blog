import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; login: string }) {
    let users = JSON.parse(
      fs.readFileSync(__dirname + '/../../../src/public/db.json', 'utf8'),
    );
    let myUser;
    users.forEach((user: any) => {
      if (user.id == payload.sub - 1 && user.login == payload.login) {
        console.log(user);

        myUser = user;
      }
    });
    return myUser;
  }
}
