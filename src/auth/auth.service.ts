import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);

        if (user && user.password === password) {
            return user;
        }

        return null;
    }
}
