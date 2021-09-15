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
import { QuoteData } from '../../interfaces/quote.interface';

describe('QuotesController (e2e)', () => {
  let app: INestApplication;
  let quote: QuoteData;
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
      email: 'john@gmail.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'John123!!',
      created_at: Date.now().toLocaleString(),
      updated_at: Date.now().toLocaleString(),
    });
    initialUser = await usersRepo.save(initialUser);
    user = initialUser;
    const quotesRepo = getRepository(Quote);
    const initialQuote = await quotesRepo.save({ message: 'this is test', votes: [], user: initialUser });
    quote = initialQuote;
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

  it('/quotes/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/quotes/${user.id}`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: quote.id,
          message: quote.message,
          votes: quote.votes,
          user: quote.user,
          created_at: quote.created_at,
          updated_at: expect.any(String)
        })
      })
  })

  it('/quotes/user/:id/upvote (POST)', async () => {
    await request(app.getHttpServer())
      .post(`/quotes/user/${user.id}/upvote`)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: quote.id,
          message: quote.message,
          votes: quote.votes,
          user: quote.user,
          created_at: quote.created_at,
          updated_at: expect.any(String)
        })
      })
  })

  it('/quotes/user/:id/downvote (POST)', async () => {
    await request(app.getHttpServer())
      .post(`/quotes/user/${user.id}/downvote`)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: quote.id,
          message: quote.message,
          votes: quote.votes,
          user: quote.user,
          created_at: quote.created_at,
          updated_at: expect.any(String)
        })
      })
  })

  /*
  it('/quotes/myquote (PATCH)', async () => {
    const dto: UpdateQuoteDto = {
      message: 'This quote is updated',
      user: user
    }
    await request(app.getHttpServer())
      .patch('/quotes/myquote')
      .expect('Content-Type', /json/)
      .send(dto)
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: quote.id,
          message: 'This quote is updated',
          created_at: quote.created_at,
          updated_at: expect.any(String),
          user: user
        })
      })
  })
  */

  it('/quotes/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/quotes/${quote.id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          message: quote.message,
          votes: quote.votes,
          user: quote.user,
          created_at: quote.created_at,
          updated_at: expect.any(String)
        })
      })
  })
})