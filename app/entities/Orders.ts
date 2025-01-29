import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  cartId!: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: Users;

  @Column({ type: "jsonb" })
  cartsData: any;

  @Column()
  cartsStatus!: string;
}
