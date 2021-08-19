import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity';
import { format } from 'date-fns';
import { Vote } from './vote.entity';
@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @OneToMany(() => Vote, vote => vote.vote)
    votes: Vote[];

    @OneToOne(() => User, user => user.quote_info, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column({ default: format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss') })
    created_at: string;

    @Column({ default: format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss') })
    updated_at: string;
}