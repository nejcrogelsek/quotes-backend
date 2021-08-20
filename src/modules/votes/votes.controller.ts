import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Vote } from '../../entities/vote.entity';
import { CreateRemoveVoteDto } from './dto/create-remove-vote.dto';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
    constructor(private votesService: VotesService) { }

    @Get()
    getVotes(): Promise<Vote[]> {
        return this.votesService.findAll();
    }

    @Post('/user/:id/upvote')
    createVote(@Body() body: CreateRemoveVoteDto): Promise<Vote> {
        return this.votesService.createVote(body);
    }

    @Delete('/user/:id/downvote')
    deleteVote(@Body() body: CreateRemoveVoteDto): Promise<Vote> {
        return this.votesService.removeVote(body);
    }
}
