import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import * as request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { UsersModule } from './users.module';
import { Quote } from '../../entities/quote.entity';
import { User } from '../../entities/user.entity';
import { AppModule } from '../app.module';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

test('/users (GET)', async () => {
  await request(app.getHttpServer())
    .get('/users')
    .expect('Content-Type', /json/)
    .expect(200);
});

test('/users/signup (POST) --> 400 on validation error', async () => {
  await request(app.getHttpServer())
    .post('/users/signup')
    .expect('Content-Type', /json/)
    .expect(400);
});

test('/users/signup (POST)', async () => {
  const dto: CreateUserDto = {
    profile_image: 'undefined',
    email: 'mockUser@gmail.com',
    first_name: 'Mock',
    last_name: 'User',
    password: 'Mock123!',
    confirm_password: 'Mock123!'
  }
  await request(app.getHttpServer())
    .post('/users/signup')
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

test('/users/login (POST)', async () => {
  const dto: LoginUserDto = {
    email: 'mockUser@gmail.com',
    password: 'Mock123!',
  };
  await request(app.getHttpServer())
    .post('/users/login')
    .send(dto)
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
    })
});

test('users/me/update-password', async () => {
  const dto: UpdateUserDto = {
    id: 14,
    email: 'neki@gmail.com',
    first_name: 'Mock Updated',
    last_name: 'Uporabnik',
    password: 'Neki123!',
    confirm_password: 'Neki123!'
  };
  await request(app.getHttpServer())
    .patch('/users/me/update-password')
    .send(dto)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(res => {
      expect(res.body).toEqual({
        id: 14,
        email: 'neki@gmail.com',
        first_name: 'Mock Updated',
        last_name: 'Uporabnik',
        profile_image: expect.any(String),
        password: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    })
})