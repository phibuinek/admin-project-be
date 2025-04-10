import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch Login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  // @UseGuards(LocalAuthGuard)
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  // @UseGuards(LocalAuthGuard)
  checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.authService.checkCode(codeAuthDto);
  }

  @Post('retry-active')
  @Public()
  // @UseGuards(LocalAuthGuard)
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  // @UseGuards(LocalAuthGuard)
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  // @UseGuards(LocalAuthGuard)
  changePassword(@Body() data:  ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'phibuinek@gmail.com', // list of receivers
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      // html: '<b>Hello World with Phi Bùi</b>', // HTML body content
      template: 'register.hbs',
      context: {
        name: 'Phi Bùi',
        activationCode: 1234567789,
      },
    });
    return 'ok';
  }
}
