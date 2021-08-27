import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../../entities/vote.entity';
import { Quote } from '../../entities/quote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Quote])],
  providers: [VotesService],
  controllers: [VotesController]
})
export class VotesModule { }
