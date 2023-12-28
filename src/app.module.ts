import { Module } from '@nestjs/common';

import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    LoginModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
  ],
  controllers: [UsersController],
  // controllers: [AppController],
  // providers: [AppService, LoginService],
})
export class AppModule {}
