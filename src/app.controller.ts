import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/auth-jwt.guard';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  getHello(): string {
    return 'This is NestJS API for project Quoastic.'
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  me(@Request() req): User {
    return req.user;
  }
}
