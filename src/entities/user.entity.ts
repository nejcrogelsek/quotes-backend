import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Quote } from './quote.entity';
import { format } from 'date-fns';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    password: string;

    @OneToOne(() => Quote, quoteInfo => quoteInfo.user)
    quote_info: Quote;

    @Column({ default: format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss') })
    created_at: string;

    @Column({ default: format(new Date(Date.now()), 'dd-MM-yyyy HH:mm:ss') })
    updated_at: string;
}