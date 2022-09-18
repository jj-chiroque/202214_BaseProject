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
        });
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

    const result: ProductEntity = await service.addStoreToProduct(newProduct.id, newStore.id);
    
    expect(result.stores.length).toBe(1);
    expect(result.stores[0]).not.toBeNull();
    expect(result.stores[0].name).toBe(newStore.name);
    expect(result.stores[0].city).toBe(newStore.city);
    expect(result.stores[0].address).toBe(newStore.address);
  });

  it('addStoreToProduct should thrown exception for an invalid store', async () => {
    const newProduct: ProductEntity = await productRepository.save({
        name: faker.lorem.sentence(),
        price: faker.datatype.number({ min: 10, max: 100, precision: 0.01}),
        product_type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: []
    })

    await expect(
        service.addStoreToProduct(newProduct.id, "0")
    ).rejects.toHaveProperty("message", "The store with the given id was not found")
   
  });

  it('findStoresFromProduct should return stores from a product', async ()=>{
    const stores: StoreEntity[] = await service.findStoresFromProduct(product.id);
    expect(stores).not.toBeNull()
    expect(stores).toHaveLength(lsStores.length);
  });

  it('findStoreFromProduct should return a store from a product', async () => {
    const store: StoreEntity = lsStores[0];
    const storeStore: StoreEntity = await service.findStoreFromProduct(product.id, store.id);

    expect(storeStore).not.toBeNull();
    expect(storeStore.name).toBe(store.name);
    expect(storeStore.city).toBe(store.city);
    expect(storeStore.address).toBe(store.address);
  });

  it('findStoreFromProduct should thrown exception for an invalid product', async () => {
    await expect(
        service.findStoreFromProduct("0", lsStores[0].id)
    ).rejects.toHaveProperty("message", "The product with the given id was not found")
  });


  it('updateStoresFromProduct should update stores list for a museum', async () => {
    const newStores: StoreEntity[] = [lsStores[0],lsStores[2]];

    const productUpdated: ProductEntity = await service.updateStoresFromProduct(product.id, newStores);
    expect(productUpdated.stores).not.toBeNull()
    expect(productUpdated.stores).toHaveLength(newStores.length);  
  });

  it('updateStoresFromProduct should throw an exception for an invalid store', async () => {
    const newStore: StoreEntity = lsStores[0];
    newStore.id = "0";

    await expect(
        service.updateStoresFromProduct(product.id, [newStore])
    ).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('deleteStoreFromProduct should remove a store from a product', async () => {    
    const store: StoreEntity = lsStores[0];

    await service.deleteStoreFromProduct(product.id, store.id);

    const productStored: ProductEntity = await productRepository.findOne({where: { id: product.id }, relations: ["stores"]});
    const storeDeleted: StoreEntity = productStored.stores.find(a => a.id === store.id);

    expect(storeDeleted).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for a non asocciated store', async () => {    
    const newStore: StoreEntity = await storeRepository.save({
        name: faker.lorem.sentence(),
        city: faker.lorem.word(3).toUpperCase(),
        address: faker.lorem.sentence()
    })

    await expect(
        service.deleteStoreFromProduct(product.id, newStore.id)
    ).rejects.toHaveProperty("message", "The store with the given id is not associated to the product")
  });

});
