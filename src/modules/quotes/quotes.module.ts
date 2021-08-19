import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Quote } from '../../entities/quote.entity';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, User, Vote])],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService]
})
export class QuotesModule { }
