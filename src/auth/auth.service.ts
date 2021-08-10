import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private logger = new Logger();
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<User> {
        this.logger.log('Validating a user...');
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
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
