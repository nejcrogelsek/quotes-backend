import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import * as request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { AppModule } from '../../app.module';
import { Project } from '../../models/project.model';
import { User } from './../../models/user.model';

let app: INestApplication;
let jwt;

beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    const repo = await getRepository(User);
    await repo.save({
        username: 'admin',
        password: hashSync('admin', 10),
        isAdmin: true,
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

test('/register', async () => {
    await request(app.getHttpServer())
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({ username: 'test', password: 'test', isAdmin: false })
        .expect(401);
});

test('/login', async () => {
    const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({ username: 'admin', password: 'admin' })
        .expect(201);
    // store the jwt token for the next request
    const { access_token: token } = loginResponse.body;
    jwt = token;
});

test('/register', async () => {
    await request(app.getHttpServer())
        .post('/users')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ username: 'test', password: 'test', isAdmin: false })
        .expect(201);
});

test('/projects (GET)', () => {
    return request(app.getHttpServer())
        .get('/projects')
        .expect(401);
});

test('store Joe and fetch it', async () => {
    await getRepository(Project).save({
        name: 'test',
        userId: 1,
        key: 'test-test-123',
    });
    const test = await getRepository(Project).find({
        where: {
            key: 'test-test-123',
        },
    });
    expect(test[0].name).toBe('test');
});