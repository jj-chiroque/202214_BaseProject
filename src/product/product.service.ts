import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ){}

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find();
    }

    async findOne(id: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: {id} } );
        if (!product)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
    
        return product;
    }

    async create(product: ProductEntity){
        const isProductTypeValid = Object.values<string>(ProducType).includes(product.product_type);
        if (!isProductTypeValid) {
            throw new BusinessLogicException("The product type is invalid", BusinessError.PRECONDITION_FAILED);
        }

        return await this.productRepository.save(product);
    }  

}

enum ProducType {
    PERECEDERO = "Perecedero",
    NO_PERECEDERO = "No perecedero"
}
