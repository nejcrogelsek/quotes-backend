import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);

        if (user && user.password === password) {
            return user;
        }

        return null;
    }

    async login(user: User): Promise<{ access_token: string }> {
        const payload = { name: user.first_name, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
