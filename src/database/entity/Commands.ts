import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity()
export class Commands {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    command: string;

    @Column()
    alias: string;

    @Column()
    forChat: string;

    @Column()
    responseFile: string;

    @Column()
    responseText: string;

    @Column()
    type: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    ownerId: string;

    @CreateDateColumn({ name: 'createdDate' }) 'createdDate': Date;
}
