import { Controller, Get, UseGuards } from '@nestjs/common';
import { getUser } from 'src/login/dec/get-uesr.decorator';
import { JwtGuard } from 'src/login/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  @Get('me')
  me(@getUser() user: any) {
    return user;
  }
}
