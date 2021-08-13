import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthReturnData } from 'src/interfaces/auth.interface';
import { JwtAuthGuard } from './auth/auth-jwt.guard';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'This is NestJS API for project Quotastic.'
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  me(@Request() req): Promise<any> {
    console.log(req.user);
    return req.user;
  }
}
