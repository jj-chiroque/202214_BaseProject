import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
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
    async create(@Body() productDto: ProductDto) {
        const product: ProductEntity = plainToInstance(ProductEntity, productDto);
        return await this.producService.create(product);
    }

    @Put(':productId')
    async update(@Param('productId') productId: string, @Body() productDto: ProductDto) {
        const product: ProductEntity = plainToInstance(ProductEntity, productDto);
        return await this.producService.update(productId, product);
    }

    @Delete(':productId')
    @HttpCode(204)
    async delete(@Param('productId') productId: string) {
        return await this.producService.delete(productId);
    }

}
