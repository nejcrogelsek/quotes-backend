import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Quote } from '../entities/quote.entity.js';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>) { };

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.usersRepository.findOne({ email: createUserDto.email });
        if (user && createUserDto.email === user.email) {
            throw new BadRequestException(`User with email: ${createUserDto.email} already exists.`)
        }
        if (createUserDto.confirm_password === createUserDto.password) {
            const newUser = this.usersRepository.create(createUserDto);
            const savedUser = await this.usersRepository.save(newUser);

            const quoteInfo = this.quotesRepository.create({ message: '' });
            quoteInfo.user_id = savedUser.id;

            return savedUser;
        }
        else {
            throw new BadRequestException('Passwords do not match.');
        }
    }

    async findById(id: number): Promise<User> {
        const found = this.usersRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`User with id: ${id} was not found.`);
        }

        return found;
    }

    async findByEmail(email: string): Promise<User> {
        const found = this.usersRepository.findOne(email);

        if (!found) {
            throw new NotFoundException(`User with email: ${email} was not found.`);
        }

        return found;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        if (updateUserDto.password === updateUserDto.password) {
            const user = await this.findById(id);
            user.email = updateUserDto.email;
            user.first_name = updateUserDto.first_name;
            user.last_name = updateUserDto.last_name;
            user.password = updateUserDto.password;
            user.updated_at = new Date().toLocaleString();

            return this.usersRepository.save(user);
        } else {
            throw new BadRequestException('Passwords do not match.');
        }
    }

    async deleteUser(id: number): Promise<User> {
        const user = await this.findById(id);

        return this.usersRepository.remove(user);
    }
}
