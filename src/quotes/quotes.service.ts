import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../entities/quote.entity';
import { Repository } from 'typeorm';
import { UpdateQuoteDto } from './dto/update-quote';

@Injectable()
export class QuotesService {
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

    async updateQuote(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
        const quote = await this.findById(id);
        quote.message = updateQuoteDto.message;
        return this.quotesRepository.save(quote);
    }

    async deleteQuote(id: number): Promise<Quote> {
        const quote = await this.findById(id);

        return this.quotesRepository.remove(quote);
    }
}
