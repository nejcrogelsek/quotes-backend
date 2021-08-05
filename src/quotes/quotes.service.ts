import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from 'src/entities/quote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuotesService {
    constructor(@InjectRepository(Quote) private quotesRepository: Repository<Quote>) { }

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

    // createQuote(createQuoteDto):Promise<Quote>{
    //     const quote = this.quotesRepository.create(createQuoteDto);
    //     return this.quotesRepository.save(quote);
    // }
}
