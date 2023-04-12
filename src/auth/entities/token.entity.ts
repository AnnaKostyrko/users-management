import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn({
        type: 'timestamp',
    })
    public created_at: Date;
}
