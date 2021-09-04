import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Quote } from '../../entities/quote.entity';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
    constructor(private quotesService: QuotesService) { }

    @Get()
    getQuotes(): Promise<Quote[]> {
        return this.quotesService.findAll();
    }
    @Get('/test')
    test(): Promise<any> {
        return this.quotesService.findLiked();
    }
    @Get('/recent')
    getRecentQuotes(): Promise<Quote[]> {
        return this.quotesService.findRecent();
    }
    @Get('/liked')
    getLikedQuotes(): Promise<Quote[]> {
        return this.quotesService.findLiked();
    }

    @Patch('/myquote')
    updateQuote(@Body() body: UpdateQuoteDto): Promise<Quote> {
        return this.quotesService.updateQuote(body);
    }

    @Get('/:id')
    getUserQuote(@Param('id', ParseIntPipe) id: number): Promise<Quote> {
        return this.quotesService.getUserQuote(id);
    }

    @Delete('/:id')
    deleteQuote(@Param('id', ParseIntPipe) id: number): Promise<Quote> {
        return this.quotesService.deleteQuote(id);
    }
}
