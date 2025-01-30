import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Roles } from "./Roles";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId!: number;

  @ManyToOne(() => Roles, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "roleId" })
  role!: Roles;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
