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

    @Patch('/myquote')
    updateQuote(@Body() body: UpdateQuoteDto): Promise<Quote> {
        return this.quotesService.updateQuote(body);
    }

    @Post('/user/:id/upvote')
    upVote(@Param('id', ParseIntPipe) id: number): Promise<Quote> {
        return this.quotesService.upVote(id);
    }

    @Post('/user/:id/downvote')
    downVote(@Param('id', ParseIntPipe) id: number): Promise<Quote> {
        return this.quotesService.downVote(id);
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
