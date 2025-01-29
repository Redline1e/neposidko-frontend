import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Orders } from "./Orders";
import { Products } from "./Products";
@Entity()
export class ProductsOrder {
  @PrimaryGeneratedColumn()
  productOrderId!: number;

  @ManyToOne(() => Orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cartId" })
  order!: Orders;

  @ManyToOne(() => Products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product!: Products;

  @Column({ type: "int" })
  quantity!: number;
}
