import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthReturnData } from 'src/interfaces/auth.interface';
import { JwtAuthGuard } from './auth/auth-jwt.guard';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private usersService: UsersService) { }

  @Get()
  getHello(): string {
    return 'This is NestJS API for project Quotastic.'
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<AuthReturnData> {
    const { access_token } = await this.authService.login(req.user);
    const { id, email, first_name, last_name, profile_image } = await this.usersService.findByEmail(req.user.email)
    return {
      user: {
        id,
        email,
        first_name,
        last_name,
        profile_image
      },
      access_token
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  me(@Request() req): Promise<any> {
    console.log(req.user);
    return req.user;
  }
}
