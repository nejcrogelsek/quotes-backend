import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { User } from '../../entities/user.entity';
import { Vote } from '../../entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, User, Vote])],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService]
})
export class QuotesModule { }
