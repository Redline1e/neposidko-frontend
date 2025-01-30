import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Roles {
    @PrimaryGeneratedColumn()
    roleId!: number;

    @Column({ type: "varchar", unique: true })
    name!: string;
}