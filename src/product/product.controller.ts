import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductDto } from './product.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {

    constructor(private readonly producService: ProductService) {}

    @Get()
    async findAll() {
        return await this.producService.findAll();
    }

    @Get(':productId')
    async findOne(@Param('productId') productId: string) {
        return await this.producService.findOne(productId);
    }

    @Post()
    async create(@Body() museumDto: ProductDto) {
        const product: ProductEntity = plainToInstance(ProductEntity, museumDto);
        return await this.producService.create(product);
    }

}
