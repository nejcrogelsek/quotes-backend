import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
<<<<<<< HEAD:src/modules/quotes/quotes.controller.ts
import { Quote } from '../../entities/quote.entity';
=======
import { Quote } from 'src/entities/quote.entity';
>>>>>>> 6239f9f2fd072120822ea52254387b35abf5b8d5:src/quotes/quotes.controller.ts
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
    constructor(private quotesService: QuotesService) { }

    @Get()
    getQuotes(): Promise<Quote[]> {
        return this.quotesService.findAll();
    }

    @Post('/:id')
    createQuote(@Param('id', ParseIntPipe) id: number, @Body() body: CreateQuoteDto): Promise<Quote> {
        return this.quotesService.updateQuote(id, body);
    }

    @Delete('/:id')
    deleteQuote(@Param('id', ParseIntPipe) id: number): Promise<Quote> {
        return this.quotesService.deleteQuote(id);
    }
}
