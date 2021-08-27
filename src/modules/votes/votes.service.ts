import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { Repository } from 'typeorm';
import { Vote } from '../../entities/vote.entity';
import { CreateRemoveVoteDto } from './dto/create-remove-vote.dto';

@Injectable()
export class VotesService {
    constructor(
        @InjectRepository(Vote) private votesRepository: Repository<Vote>,
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>
    ) { }

    async findAll(): Promise<Vote[]> {
        return this.votesRepository.find();
    }

    async createVote(createVoteDto: CreateRemoveVoteDto): Promise<Vote> {
        try {
            const quote = await this.quotesRepository.findOne(createVoteDto.quote_id, { relations: ['votes'] });
            const newVote = this.votesRepository.create(createVoteDto);
            const savedVote = await this.votesRepository.save(newVote);
            quote.votes.push(savedVote);
            await this.quotesRepository.save(quote);
            return savedVote;

        } catch (err) {
            console.log(err);
            throw new BadRequestException('Error creating a vote.');
        }
    }

    async removeVote(removeVoteDto: CreateRemoveVoteDto): Promise<Vote> {
        try {
            const vote = await this.votesRepository.findOne({ quote_id: removeVoteDto.quote_id, user_id: removeVoteDto.user_id });
            return this.votesRepository.remove(vote);
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Vote with that credentials does not exist and cannot be removed.')
        }
    }
}
