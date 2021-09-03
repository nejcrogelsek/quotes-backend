import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import * as request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { UsersModule } from '../../src/modules/users/users.module';
import { Quote } from '../../src/entities/quote.entity';
import { User } from '../../src/entities/user.entity';
import { AppModule } from '../../src/modules/app.module';

let app: INestApplication;
let jwt;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Validation Pipe
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const usersRepo = await getRepository(User);
    await usersRepo.save({
        profile_image: 'undefined',
        email: 'mockUser@gmail.com',
        first_name: 'Mock',
        last_name: 'User',
        password: 'Mock123!',
        confirm_password: 'Mock123!'
    });
});

afterAll(async () => {
    try {
        const entities = [];
        await (await getConnection()).entityMetadatas.forEach(x =>
            entities.push({ name: x.name, tableName: x.tableName }),
        );

        for (const entity of entities) {
            const repository = await getRepository(entity.name);
            await repository.query(`TRUNCATE TABLE "${entity.tableName}" cascade;`);
        }
    } catch (error) {
        throw new Error(`ERROR: Cleaning test db: ${error}`);
    }

    const conn = getConnection();
    return conn.close();
});

test('/users (GET)', () => {
    return request(app.getHttpServer())
        .get('/users')
        .expect(200);
});

test('/users/signup', async () => {
    await request(app.getHttpServer())
        .post('/users/signup')
        .set('Content-Type', 'application/json')
        .send({ username: 'test', password: 'test', isAdmin: false })
        .expect(401);
});