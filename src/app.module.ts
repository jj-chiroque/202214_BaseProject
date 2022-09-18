import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [ProductModule, StoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
