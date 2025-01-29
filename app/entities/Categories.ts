import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    categoryId!: number;

    @Column()
    name!: string;
}