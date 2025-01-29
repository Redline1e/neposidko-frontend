import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Brands } from "./Brands";
import { Categories } from "./Categories";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  productId!: number;

  @ManyToOne(() => Brands, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "brandId" })
  brand!: Brands;

  @ManyToOne(() => Categories, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "categoryId" })
  category!: Categories;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  discount!: number;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ nullable: true })
  imageUrl!: string;
}
