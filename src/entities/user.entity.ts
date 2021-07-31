import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
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

    @Column({ default: Date.now().toLocaleString() })
    created_at: string;

    @Column({ default: Date.now().toLocaleString() })
    updated_at: string;
}