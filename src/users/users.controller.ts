import { Controller, Get } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
    @Get()
    getUsers(): Promise<User[]> {
        return
    }
}
