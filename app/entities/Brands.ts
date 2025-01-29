import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Brands {
    @PrimaryGeneratedColumn()
    brandId!: number;

    @Column()
    name!: string;
}