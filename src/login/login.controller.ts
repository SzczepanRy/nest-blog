import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Get('all')
  all() {
    return this.loginService.all();
  }

  @Post('signup')
  signup(@Body() dto: LoginDto) {
    return this.loginService.signup(dto);
  }
  @Post('signin')
  async signin(@Body() dto: LoginDto) {
    // console.log(await this.loginService.signin(dto));

    return await this.loginService.signin(dto);
  }
}
