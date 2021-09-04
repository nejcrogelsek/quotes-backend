import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
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

    async findAll(): Promise<Quote[]> {
        try {
            return this.quotesRepository.find({ relations: ['user', 'votes'] });
        } catch (err) {
            console.log(err.message);
            throw new BadRequestException('Error while searching for users.');
        } finally {
            this.logger.log('Searching for quotes.');
        }
    }

    async findRecent(): Promise<Quote[]> {
        try {
            return this.quotesRepository.find({ relations: ['user', 'votes'], order: { 'updated_at': 'ASC' } });
        } catch (err) {
            console.log(err.message);
            throw new BadRequestException('Error while searching for most recent quotes.');
        } finally {
            this.logger.log('Searching for most recent quotes.');
        }
    }

    async findLiked(): Promise<Quote[]> {
        try {
            return this.quotesRepository.find({ relations: ['user', 'votes'], order: { 'updated_at': 'DESC' } });
        } catch (err) {
            console.log(err.message);
            throw new BadRequestException('Error while searching for most liked quotes.');
        } finally {
            this.logger.log('Searching for most liked quotes.');
        }
        //return this.quotesRepository.createQueryBuilder('quote')
        //  .leftJoinAndSelect('quote.votes', 'vote')
        //  .getMany()
    }

    async findById(id: number): Promise<Quote> {
        const found = await this.quotesRepository.findOne(id, { relations: ['user', 'votes'] });
        if (!found) {
            throw new NotFoundException(`Quote with id: ${id} does not exist.`)
        }
        return found;
    }

    async updateQuote(updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
        try {
            const user = await this.usersRepository.findOne({ id: updateQuoteDto.user.id });
            const quote = await this.quotesRepository.findOne({ user: user }, { relations: ['user'] });
            const formattedDate = format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss');
            quote.message = updateQuoteDto.message;
            quote.updated_at = formattedDate;
            return this.quotesRepository.save(quote);
        } catch (err) {
            console.log(err.message);
            throw new BadRequestException(`Cannot update a quote with user id: ${updateQuoteDto.user.id}`);
        } finally {
            this.logger.log(`Updating a quote with user id: ${updateQuoteDto.user.id}`);
        }
    }

    async getUserQuote(id: number): Promise<Quote> {
        try {
            const user = await this.usersRepository.findOne({ id: id });
            const quote = await this.quotesRepository.findOne({ user: user }, { relations: ['user', 'votes'] });
            return quote;
        } catch (err) {
            console.log(err.message);
            throw new NotFoundException(`Quote with user_id: ${id} does not exists.`);
        } finally {
            this.logger.log(`Getting an authenticated user quote.`)
        }
    }

    async deleteQuote(id: number): Promise<Quote> {
        try {
            const quote = await this.findById(id);
            return this.quotesRepository.remove(quote);
        } catch (err) {
            console.log(err.message)
            throw new BadRequestException(`Cannot delete a quote with id: ${id}`);
        } finally {
            this.logger.log(`Deleteing a quote with id: ${id}`);
        }
    }
}
