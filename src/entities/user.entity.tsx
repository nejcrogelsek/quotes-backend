import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ default: Date.now() })
    created_at: Date;

    @Column({ default: Date.now() })
    updated_at: Date;
}