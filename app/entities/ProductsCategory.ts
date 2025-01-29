import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Products } from "./Products";
import { Brands } from "./Brands";
import { Categories } from "./Categories";
@Entity()
export class ProductsCategory {
  @PrimaryGeneratedColumn()
  productCategoryId!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Products;

  @ManyToOne(() => Brands, { onDelete: "CASCADE" })
  @JoinColumn({ name: "brandId" })
  brand!: Brands;

  @ManyToOne(() => Categories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "categoryId" })
  category!: Categories;
}
