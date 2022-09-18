import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { StoreDto } from 'src/store/store.dto';
import { StoreEntity } from 'src/store/store.entity';
import { ProductStoreService } from './product-store.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductStoreController {

    constructor(private readonly producStoreService: ProductStoreService) {}

    @Post(':productId/stores/:storeId')
    async addStoreToProduct(@Param('productId') productId: string, @Param('storeId') storeId: string){
        return await this.producStoreService.addStoreToProduct(productId, storeId);
    }

    @Get(':productId/stores/:storeId')
    async findStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string){
        return await this.producStoreService.findStoreFromProduct(productId, storeId);
    }

    @Get(':productId/stores')
    async findStoresFromProduct(@Param('productId') productId: string){
        return await this.producStoreService.findStoresFromProduct(productId);
    }

    @Put(':productId/stores')
    async updateStoresFromProduct(@Param('culturaId') culturaId: string, @Body() storesDto: StoreDto[]){
        const stores = plainToInstance(StoreEntity, storesDto)
        return await this.producStoreService.updateStoresFromProduct(culturaId, stores);
    }
    
    @Delete(':productId/stores/:storeId')
    @HttpCode(204)
    async deleteCiudadRestaurante(@Param('productId') productId: string, @Param('storeId') storeId: string){
        return await this.producStoreService.deleteStoreFromProduct(productId, storeId);
    }
    
}
