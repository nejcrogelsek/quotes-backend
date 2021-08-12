import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { Repository } from 'typeorm';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
    private logger = new Logger();
    constructor(
        @InjectRepository(Quote) private quotesRepository: Repository<Quote>,
    ) { }

    findAll(): Promise<Quote[]> {
        return this.quotesRepository.find();
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
        const quote = await this.quotesRepository.findOne({ user_id: updateQuoteDto.user_id });
        quote.message = updateQuoteDto.message;
        return this.quotesRepository.save(quote);
    }

    async upVote(id: number): Promise<Quote> {
        const quote = await this.quotesRepository.findOne({ user_id: id });
        quote.votes++;
        return this.quotesRepository.save(quote);
    }

    async downVote(id: number): Promise<Quote> {
        const quote = await this.quotesRepository.findOne({ user_id: id });
        quote.votes--;
        return this.quotesRepository.save(quote);
    }

    async deleteQuote(id: number): Promise<Quote> {
        this.logger.log(`Deleteing a quote with id: ${id}`);
        const quote = await this.findById(id);

        return this.quotesRepository.remove(quote);
    }
}