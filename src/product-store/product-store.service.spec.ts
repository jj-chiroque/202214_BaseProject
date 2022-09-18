import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { StoreEntity } from '../store/store.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductStoreService } from './product-store.service';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let productRepository: Repository<ProductEntity>;
  let storeRepository: Repository<StoreEntity>;
  let product: ProductEntity;
  let lsStores: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [ProductStoreService],
    }).compile();

    service = module.get<ProductStoreService>(ProductStoreService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    storeRepository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productRepository.clear();
    storeRepository.clear();

    lsStores = [];
    for (let i = 0; i < 5; i++) {
        const store: StoreEntity = await storeRepository.save({
            name: faker.lorem.sentence(),
            city: faker.lorem.word(3).toUpperCase(),
            address: faker.lorem.sentence()
        })
        lsStores.push(store);
    }

    product = await productRepository.save({
        name: faker.lorem.sentence(),
        price: faker.datatype.number({ min: 10, max: 100, precision: 0.01}),
        product_type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: lsStores
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a store to a product', async () => {
    const newStore: StoreEntity = await storeRepository.save({
        name: faker.lorem.sentence(),
        city: faker.lorem.word(3).toUpperCase(),
        address: faker.lorem.sentence()
    });

    const newProduct: ProductEntity = await productRepository.save({
        name: faker.lorem.sentence(),
        price: faker.datatype.number({ min: 10, max: 100, precision: 0.01}),
        product_type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: []
    })

    const result: ProductEntity = await service.addStoreToProduct(newStore.id, newProduct.id);
    
    expect(result.stores.length).toBe(1);
    expect(result.stores[0]).not.toBeNull();
    expect(result.stores[0].name).toBe(newStore.name);
    expect(result.stores[0].city).toBe(newStore.city);
    expect(result.stores[0].address).toBe(newStore.address);

  });

});
