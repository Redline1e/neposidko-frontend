import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users";
import { Products } from "./Products";
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  reviewId!: number;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: Users;

  @ManyToOne(() => Products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Products;

  @Column({ type: "int" })
  rating!: number;

  @Column({ type: "text", nullable: true })
  comment!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  reviewDate!: Date;
}
