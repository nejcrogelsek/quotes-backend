import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Quote } from '../../entities/quote.entity.js';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';

@Injectable()
export class UsersService {
    private logger = new Logger();
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>) { };

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        this.logger.log('Creating a user...');
        const user = await this.usersRepository.findOne({ email: createUserDto.email });
        if (user && createUserDto.email === user.email) {
            throw new BadRequestException(`User with email: ${createUserDto.email} already exists.`)
        }
        if (createUserDto.confirm_password === createUserDto.password) {
            const { confirm_password, password, ...rest } = createUserDto;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hash(password, salt);

            const formattedDate = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
            const createdUser = this.usersRepository.create({ ...rest, password: hashedPassword, created_at: formattedDate, updated_at: formattedDate });
            const savedUser = await this.usersRepository.save(createdUser);

            const quoteInfo = this.quotesRepository.create({ message: '', votes: 0 });
            quoteInfo.user_id = savedUser.id;
            await this.quotesRepository.save(quoteInfo);

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
        const found = await this.usersRepository.findOne({ email: email });

        if (!found) {
            throw new NotFoundException(`User with email: ${email} was not found.`);
        }

        return found;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        this.logger.log(`Updating a user with id: ${id}`);
        if (updateUserDto.email !== undefined) {
            const user = await this.usersRepository.findOne({ email: updateUserDto.email });
            if (user && user.id !== id && updateUserDto.email === user.email) {
                throw new BadRequestException(`User with email: ${updateUserDto.email} already exists.`)
            }
        }
        const user = await this.findById(id);
        if (updateUserDto.password === updateUserDto.password) {
            user.email = updateUserDto.email;
            user.first_name = updateUserDto.first_name;
            user.last_name = updateUserDto.last_name;
            user.password = updateUserDto.password;
            const formattedDate = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
            user.updated_at = formattedDate;

            return this.usersRepository.save(user);
        } else {
            throw new BadRequestException('Passwords do not match.');
        }
    }

    async deleteUser(id: number): Promise<User> {
        this.logger.log(`Deleting a user with id: ${id}`);
        const user = await this.findById(id);
        const quote = await this.quotesRepository.findOne({ user_id: id });

        const removedUser = this.usersRepository.remove(user);
        await this.quotesRepository.remove(quote);
        return removedUser;
    }
}