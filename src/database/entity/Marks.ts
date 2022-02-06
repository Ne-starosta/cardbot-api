import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Marks {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardId: number;

    @Column()
    userId: number;

    @Column()
    mark: string;
}
