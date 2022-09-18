import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/product.entity';
import { StoreEntity } from 'src/store/store.entity';
import { ProductStoreService } from './product-store.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity,StoreEntity])],
    providers: [ProductStoreService]
})
export class ProductStoreModule {}
