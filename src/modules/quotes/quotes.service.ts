import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { Repository } from 'typeorm';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { User } from '../../entities/user.entity';
import { format } from 'date-fns';

@Injectable()
export class QuotesService {
    private logger = new Logger();
    constructor(
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>,
        @InjectRepository(User) private usersRepository: Repository<User>
    ) { }

    findAll(): Promise<Quote[]> {
        return this.quotesRepository.find({ relations: ['user', 'votes'] });
    }

    findRecent(): Promise<Quote[]> {
        return this.quotesRepository.find({ relations: ['user', 'votes'], order: { 'updated_at': 'DESC' } });
    }

    async findLiked(): Promise<any> {
        return this.quotesRepository.createQueryBuilder('quote')
            .leftJoinAndSelect('quote.votes', 'vote')
            .where('vote.id IS NOT NULL')
            .orderBy('')
            .getMany()
        /*return this.quotesRepository
            .createQueryBuilder('quote')
            .leftJoin('quote.votes', 'votes')
            .addSelect("COUNT(quote.votes) AS total_votes")
            .orderBy('total_votes', 'ASC') //or DESC
            .groupBy("quote.votes")
            .getRawMany()*/
        //return this.quotesRepository.find({ relations: ['user', 'votes'], order: { 'id': 'DESC' } });
    }

    async findById(id: number): Promise<Quote> {
        const found = await this.quotesRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Quote with id: ${id} does not exist.`)
        }
        return found;
    }

    async updateQuote(updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
        this.logger.log('Updating a quote...');
        const user = await this.usersRepository.findOne({ id: updateQuoteDto.user.id });
        const quote = await this.quotesRepository.findOne({ user: user });
        const formattedDate = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
        quote.message = updateQuoteDto.message;
        quote.updated_at = formattedDate;
        return this.quotesRepository.save(quote);
    }

    async upVote(id: number): Promise<Quote> {
        const user = await this.usersRepository.findOne({ id: id });
        const quote = await this.quotesRepository.findOne({ user: user });
        //const user = await this.usersRepository.findOne({ id: id });
        //quote.votes = [...quote.votes, user]
        return this.quotesRepository.save(quote);
    }

    async downVote(id: number): Promise<Quote> {
        const user = await this.usersRepository.findOne({ id: id });
        const quote = await this.quotesRepository.findOne({ user: user });
        //quote.votes--;
        return this.quotesRepository.save(quote);
    }

    async getUserQuote(id: number): Promise<Quote> {
        const user = await this.usersRepository.findOne({ id: id });
        const quote = await this.quotesRepository.findOne({ user: user }, { relations: ['user', 'votes'] });
        if (quote) {
            return quote;
        } else {
            throw new NotFoundException(`Quote with user_id: ${id} does not exists.`);
        }
    }

    async deleteQuote(id: number): Promise<Quote> {
        this.logger.log(`Deleteing a quote with id: ${id}`);
        const quote = await this.findById(id);

        return this.quotesRepository.remove(quote);
    }
}
