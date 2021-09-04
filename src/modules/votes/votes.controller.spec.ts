import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user.entity';
import { Vote } from '../../entities/vote.entity';
import { UserData } from '../../interfaces/user.interface';
import { VoteData } from '../../interfaces/vote.interface';
import { getConnection, getRepository } from 'typeorm';
import { AppModule } from '../app.module';
import { VotesModule } from './votes.module';
import { QuoteData } from '../../interfaces/quote.interface';
import { Quote } from '../../entities/quote.entity';
import { CreateRemoveVoteDto } from './dto/create-remove-vote.dto';

describe('VotesController (e2e)', () => {
  let app: INestApplication;
  let user: UserData;
  let quote: QuoteData;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, VotesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    const votesRepo = getRepository(Vote);
    await votesRepo.save({
      quote_id: initialQuote.id,
      user_id: initialUser.id,
    });
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

  it('/votes (GET)', async () => {
    await request(app.getHttpServer())
      .get('/votes')
      .expect(200)
  });

  it('/votes/user/:id/upvote (POST)', async () => {
    const dto: CreateRemoveVoteDto = {
      quote_id: quote.id,
      user_id: user.id
    }
    await request(app.getHttpServer())
      .post(`/votes/user/${user.id}/upvote`)
      .expect(201)
      .send(dto)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          quote_id: quote.id,
          user_id: user.id,
        })
      })
  })
  it('/votes/user/:id/downvote (POST)', async () => {
    const dto: CreateRemoveVoteDto = {
      quote_id: quote.id,
      user_id: user.id
    }
    await request(app.getHttpServer())
      .delete(`/votes/user/${user.id}/downvote`)
      .expect(200)
      .send(dto)
      .then(res => {
        expect(res.body).toEqual({
          quote_id: quote.id,
          user_id: user.id,
        })
      })
  })
});
