/* eslint-disable prettier/prettier */
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../product/product.entity";

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([ProductEntity]),
];
