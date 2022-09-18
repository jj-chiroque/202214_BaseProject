import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { StoreEntity } from '../store/store.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductStoreService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>
    ) {}

    async addStoreToProduct(storeId: string, productId: string): Promise<ProductEntity> {
        const store: StoreEntity = await this.storeRepository.findOne({ where: { id: storeId } });
        if (!store)
          throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND);
       
        const product: ProductEntity = await this.productRepository.findOne({where: { id: productId}, relations: ["stores"]}) 
        if (!product)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
     
        product.stores = [...product.stores, store];
        return await this.productRepository.save(product);
    }
    
}
