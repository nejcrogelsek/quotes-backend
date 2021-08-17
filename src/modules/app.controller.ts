import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/auth-jwt.guard';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'This is NestJS API for project Quotastic.'
  }
}
