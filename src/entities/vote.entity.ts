import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Quote } from './quote.entity';

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quote_id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => Quote, vote => vote.votes)
    vote: Quote;
}