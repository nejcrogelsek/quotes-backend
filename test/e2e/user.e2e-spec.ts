import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../../src/modules/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import { UserData } from '../../src/interfaces/user.interface';
import { AuthReturnData } from '../../src/interfaces/auth.interface';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { Quote } from '../../src/entities/quote.entity';

describe('UserController (e2e)', () => {
    let app: INestApplication;

    const mockUsers: UserData[] = [{
        id: 1,
        email: 'mock@gmail.com',
        first_name: 'Mock',
        last_name: 'Mocked',
        profile_image: 'undefined'
    }]

    const mockUsersRepository = {
        find: jest.fn().mockResolvedValue(mockUsers),
        createUser: jest.fn().mockImplementation((dto: CreateUserDto): AuthReturnData => {
            const { email, first_name, last_name, profile_image } = dto;
            return {
                user: {
                    id: expect.any(Number),
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    profile_image: profile_image
                },
                access_token: expect.any(String)
            }
        }),
        save: jest.fn().mockImplementation(user => Promise.resolve({ id: expect.any(Number), ...user }))
    };

    const mockQuotesRepository = {}

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
        }).overrideProvider(getRepositoryToken(User)).useValue(mockUsersRepository).compile();

        app = moduleFixture.createNestApplication();
        // Validation Pipe
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(mockUsers);
    });

    it('/users/create (POST)', () => {
        const dto: CreateUserDto = {
            profile_image: 'undefined',
            email: 'mockUser@gmail.com',
            first_name: 'Mock',
            last_name: 'User',
            password: 'Mock123!',
            confirm_password: 'Mock123!'
        };
        return request(app.getHttpServer())
            .post('/users/create')
            .send(dto)
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(res.body).toEqual({
                    user: {
                        id: expect.any(Number),
                        email: 'mockUser@gmail.com',
                        first_name: 'Mock',
                        last_name: 'User',
                        profile_image: 'undefined'
                    },
                    access_token: expect.any(String)
                })
            });
    });

    it('/users/create (POST) --> 400 on validation error', () => {
        const dto = {
            profile_image: 123,
            email: 'mockUser@gmail.com',
            first_name: 'Mock',
            last_name: 'User',
            password: 'Mock123!',
            confirm_password: 'Mock123!'
        };
        return request(app.getHttpServer())
            .post('/users/create')
            .send(dto)
            .expect('Content-Type', /json/)
            .expect(400, {
                statusCode: 400,
                message: 'Error creating a user',
                error: 'Bad Request'
            });
    });


});
