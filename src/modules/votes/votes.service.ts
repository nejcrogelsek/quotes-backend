import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../../entities/vote.entity';
import { CreateRemoveVoteDto } from './dto/create-remove-vote.dto';

@Injectable()
export class VotesService {
    constructor(@InjectRepository(Vote) private votesRepository: Repository<Vote>) { }

    async findAll(): Promise<Vote[]> {
        return this.votesRepository.find();
    }

    async createVote(createVoteDto: CreateRemoveVoteDto): Promise<Vote> {
        try {
            const newVote = this.votesRepository.create(createVoteDto);
            return this.votesRepository.save(newVote);
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Error creating a vote.');
        }
    }

    async removeVote(removeVoteDto: CreateRemoveVoteDto): Promise<Vote> {
        try {
            const vote = await this.votesRepository.findOne({ quote_id: removeVoteDto.quote_id, user_id: removeVoteDto.user_id });
            return this.votesRepository.remove(vote);
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Vote with that credentials does not exist and cannot be removed.')
        }
    }
}
