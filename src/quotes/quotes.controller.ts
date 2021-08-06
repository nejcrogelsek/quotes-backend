import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Quote } from 'src/entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
    constructor(private quotesService:QuotesService){}

    @Get()
    getQuotes(): Promise<Quote[]>{
        return this.quotesService.findAll();
    }

    @Post('update/:id')
    createQuote(@Body() body: CreateQuoteDto,@Param('id', ParseIntPipe) id: number): Promise<Quote>{
        return this.quotesService.updateQuote(id,body);
    }

    @Delete('delete/:id')
    deleteQuote(@Param('id',ParseIntPipe) id:number):Promise<Quote>{
        return this.quotesService.deleteQuote(id);
    }
}
