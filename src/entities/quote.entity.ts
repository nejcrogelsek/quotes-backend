import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity';
@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    user_id: number;

    @OneToOne(() => User, user => user.quote_info, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column({ default: Date.now().toLocaleString() })
    created_at: string;

    @Column({ default: Date.now().toLocaleString() })
    updated_at: string;
}