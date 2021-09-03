import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import * as request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { QuotesModule } from './quotes.module';
import { AppModule } from '../app.module';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from '../../entities/quote.entity';
import { User } from '../../entities/user.entity';
import { UserData } from '../../interfaces/user.interface';

describe('QuotesController (e2e)', () => {
  let app: INestApplication;
  let initialQuoteId: number;
  let user: UserData;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, QuotesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Validation Pipe
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // DB interaction
    const usersRepo = getRepository(User);
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
    user = {
      id: initialUser.id,
      email: initialUser.email,
      first_name: initialUser.first_name,
      last_name: initialUser.last_name,
      profile_image: initialUser.profile_image,
    }
    const quotesRepo = getRepository(Quote);
    const initialQuote = await quotesRepo.save({ message: 'this is test', votes: [], user: initialUser });
    initialQuoteId = initialQuote.id;
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

  it('/quotes (GET)', async () => {
    await request(app.getHttpServer())
      .get('/quotes')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('/quotes/recent (GET)', async () => {
    await request(app.getHttpServer())
      .get('/quotes/recent')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('/quotes/liked (GET)', async () => {
    await request(app.getHttpServer())
      .get('/quotes/liked')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})