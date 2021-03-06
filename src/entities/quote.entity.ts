import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity';
import { format } from 'date-fns';
import { Vote } from './vote.entity';
@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @ManyToOne(() => Quote, quote => quote.votes, { onDelete: 'CASCADE' })
    manager: Quote;

    @OneToMany(() => Vote, vote => vote.vote)
    votes: Vote[];

    @OneToOne(() => User, user => user.quote_info, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;
}