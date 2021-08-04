import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Quote } from './quote.entity';
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

    @Column({ default: Date.now().toLocaleString() })
    created_at: string;

    @Column({ default: Date.now().toLocaleString() })
    updated_at: string;
}