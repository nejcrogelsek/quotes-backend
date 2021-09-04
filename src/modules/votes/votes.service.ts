import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { Repository } from 'typeorm';
import { Vote } from '../../entities/vote.entity';
import { CreateRemoveVoteDto } from './dto/create-remove-vote.dto';
import { format } from 'date-fns'

@Injectable()
export class VotesService {
    private logger = new Logger();
    constructor(
        @InjectRepository(Vote) private votesRepository: Repository<Vote>,
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>
    ) { }

    async findAll(): Promise<Vote[]> {
        try {
            return this.votesRepository.find();
        } catch (err) {
            throw new BadRequestException('Error while searching for votes.');
        } finally {
            this.logger.log('Searching for votes.');
        }
    }

    async createVote(createVoteDto: CreateRemoveVoteDto): Promise<Vote> {
        try {
            const quote = await this.quotesRepository.findOne(createVoteDto.quote_id, { relations: ['votes'] });
            const newVote = this.votesRepository.create(createVoteDto);
            const savedVote = await this.votesRepository.save(newVote);
            quote.votes.push(savedVote);
            quote.updated_at = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
            await this.quotesRepository.save(quote);
            return savedVote;

        } catch (err) {
            console.log(err);
            throw new BadRequestException('Error creating a vote.');
        } finally {
            this.logger.log('Creating a new vote.');
        }
    }

    async removeVote(removeVoteDto: CreateRemoveVoteDto): Promise<Vote> {
        try {
            const quote = await this.quotesRepository.findOne(removeVoteDto.quote_id);
            const vote = await this.votesRepository.findOne({ quote_id: removeVoteDto.quote_id, user_id: removeVoteDto.user_id });
            quote.updated_at = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
            await this.quotesRepository.save(quote);
            return this.votesRepository.remove(vote);
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Vote with that credentials does not exist and cannot be removed.');
        } finally {
            this.logger.log(`Deleting a vote with { user_id: ${removeVoteDto.user_id}, quote_id: ${removeVoteDto.quote_id}`);
        }
    }
}
