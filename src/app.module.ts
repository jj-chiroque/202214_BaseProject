import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { ProductStoreModule } from './product-store/product-store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product/product.entity';
import { StoreEntity } from './store/store.entity';

@Module({
    imports: [ProductModule, StoreModule, ProductStoreModule,ProductStoreModule,
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [ProductEntity,StoreEntity],
        synchronize: true,
        keepConnectionAlive: true 
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
