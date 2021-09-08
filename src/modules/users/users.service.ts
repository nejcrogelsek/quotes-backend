import { BadRequestException, Injectable, NotFoundException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Quote } from '../../entities/quote.entity';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';
import { AuthService } from '../auth/auth.service';
import { AuthReturnData } from '../../interfaces/auth.interface';
import * as AWS from 'aws-sdk'
import { randomBytes } from 'crypto'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    private logger = new Logger();
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
        private configService: ConfigService) { };

    async findAll(): Promise<User[]> {
        try {
            return this.usersRepository.find();
        } catch (err) {
            throw new BadRequestException('Error while searching for users.');
        } finally {
            this.logger.log('Searching for users.');
        }
    }

    async createUser(createUserDto: CreateUserDto): Promise<AuthReturnData> {
        try {
            const user = await this.usersRepository.findOne({ email: createUserDto.email });
            if (user && createUserDto.email === user.email) {
                throw new BadRequestException(`User with email: ${createUserDto.email} already exists.`)
            }
            const { confirm_password, password, ...rest } = createUserDto;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hash(password, salt);

            const formattedDate = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
            const createdUser = this.usersRepository.create({ ...rest, password: hashedPassword, created_at: formattedDate, updated_at: formattedDate });
            const savedUser = await this.usersRepository.save(createdUser);

            const quoteInfo = this.quotesRepository.create({ message: '', votes: [], user: savedUser });
            quoteInfo.user = savedUser;
            await this.quotesRepository.save(quoteInfo);

            const { access_token } = await this.authService.login(savedUser);

            const { id, email, first_name, last_name, profile_image } = savedUser;

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
        } catch (err) {
            throw new BadRequestException('Check your request credentials.');
        } finally {
            this.logger.log('Creating a new user.');
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

    async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
        try {
            if (updateUserDto.email !== undefined) {
                const user = await this.usersRepository.findOne({ email: updateUserDto.email });
                if (user && user.id !== updateUserDto.id && updateUserDto.email === user.email) {
                    throw new BadRequestException(`User with email: ${updateUserDto.email} already exists.`)
                }
            }
            const user = await this.findById(updateUserDto.id);
            if (updateUserDto.password === updateUserDto.confirm_password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword: string = await bcrypt.hash(updateUserDto.password, salt);

                user.email = updateUserDto.email;
                user.first_name = updateUserDto.first_name;
                user.last_name = updateUserDto.last_name;
                user.password = hashedPassword;
                const formattedDate = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
                user.updated_at = formattedDate;

                return this.usersRepository.save(user);
            } else {
                throw new BadRequestException('Passwords do not match.');
            }
        } catch (err) {
            throw new BadRequestException(`Cannot update a user with id: ${updateUserDto.id}`);
        } finally {
            this.logger.log(`Updating a user with id: ${updateUserDto.id}`);
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            const user: User = await this.findById(id);
            return this.usersRepository.remove(user);
        } catch (err) {
            throw new BadRequestException(`Cannot delete a user with id: ${id}`);
        } finally {
            this.logger.log(`Deleting a user with id: ${id}`);
        }
    }

    async generateUploadUrl(): Promise<string> {

        const bucketName = this.configService.get('AWS_STORAGE_BUCKET_NAME');
        const region = this.configService.get('AWS_BUCKET_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

        const s3 = new AWS.S3({
            region,
            accessKeyId,
            secretAccessKey,
            signatureVersion: 'v4'
        });

        const rawBytes = randomBytes(16);
        const imageName = rawBytes.toString('hex');

        const params = ({
            Bucket: bucketName,
            Key: imageName,
            Expires: 60
        });

        const uploadURL = await s3.getSignedUrlPromise('putObject', params);
        return uploadURL;
    }
}
