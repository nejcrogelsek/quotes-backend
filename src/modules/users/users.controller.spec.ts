import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import * as request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { UsersModule } from './users.module';
import { User } from '../../entities/user.entity';
import { AppModule } from '../app.module';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from '../../interfaces/user.interface';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwt: string;
  let initialUserData: IUser;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Validation Pipe
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // DB interaction
    const usersRepo = await getRepository(User);
    let initialUser = usersRepo.create({
      profile_image: 'undefined',
      email: 'test@gmail.com',
      first_name: 'Test',
      last_name: 'User',
      password: 'Test123!',
      created_at: Date.now().toLocaleString(),
      updated_at: Date.now().toLocaleString(),
    });
    initialUser = await usersRepo.save(initialUser);
    initialUserData = initialUser;
    console.log(initialUserData);
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

  it('/users (GET)', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });

  it('/users/signup (POST) --> 400 on validation error', async () => {
    await request(app.getHttpServer())
      .post('/users/signup')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('/users/signup (POST)', async () => {
    const dto: CreateUserDto = {
      profile_image: 'undefined',
      email: 'mockuser@gmail.com',
      first_name: 'Mock',
      last_name: 'User',
      password: 'Mock123!',
      confirm_password: 'Mock123!'
    }
    await request(app.getHttpServer())
      .post('/users/signup')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          user: {
            id: expect.any(Number),
            email: 'mockuser@gmail.com',
            first_name: 'Mock',
            last_name: 'User',
            profile_image: 'undefined'
          },
          access_token: expect.any(String)
        })
      });
  });

  it('/users/login (POST)', async () => {
    const dto: LoginUserDto = {
      username: 'mockuser@gmail.com',
      password: 'Mock123!',
    };
    await request(app.getHttpServer())
      .post('/users/login')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then(res => {
        jwt = res.body.access_token
        expect(res.body).toEqual({
          user: {
            id: expect.any(Number),
            email: 'mockuser@gmail.com',
            first_name: 'Mock',
            last_name: 'User',
            profile_image: 'undefined'
          },
          access_token: expect.any(String)
        })
        jwt = res.body.access_token;
      })
  });

  it('/users/me/update-password (PATCH)', async () => {
    const dto: UpdateUserDto = {
      id: initialUserData.id,
      email: 'neki@gmail.com',
      first_name: 'Neki',
      last_name: 'Uporabnik',
      password: 'Neki123!',
      confirm_password: 'Neki123!'
    };
    await request(app.getHttpServer())
      .patch('/users/me/update-password')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: initialUserData.id,
          email: 'neki@gmail.com',
          first_name: 'Neki',
          last_name: 'Uporabnik',
          profile_image: expect.any(String),
          password: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String)
        })
      })
  })

  it('/users/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${initialUserData.id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          email: 'neki@gmail.com',
          first_name: 'Neki',
          last_name: 'Uporabnik',
          profile_image: expect.any(String),
          password: expect.any(String),
          created_at: initialUserData.created_at,
          updated_at: expect.any(String),
        })
      })
  })

  it('users/protected (GET) --> 400 error', async () => {
    await request(app.getHttpServer())
      .get('users/protected')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
  })
})