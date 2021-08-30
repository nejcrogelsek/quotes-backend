import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../../src/modules/users/users.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
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
            imports: [
                UsersModule,

            ],
            providers: [
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUsersRepository
                },
                {
                    provide: getRepositoryToken(Quote),
                    useValue: mockQuotesRepository
                }
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        // Validation Pipe
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('/users/test (GET)', async () => {
        return request(app.getHttpServer())
            .get('/users/test')
            .expect(200)
            .expect('This is test');
    });

    it('/users/test (GET) --> 400 on validation error', async () => {
        return request(app.getHttpServer())
            .post('/users/create')
            .expect('Content-Type', /json/)
            .expect(400, {
                statusCode: 400,
                message: 'Error testing',
                error: 'Bad Request'
            });
    });

});
