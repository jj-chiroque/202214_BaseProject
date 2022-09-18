import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let lsStores: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    lsStores = [];

    for (let i = 0; i < 5; i++) {
        const store = await repository.save({
            name: faker.lorem.sentence(),
            city: faker.lorem.word(3).toUpperCase(),
            address: faker.lorem.sentence()
        });
        lsStores.push(store);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(lsStores.length);
  });

  it('findOne should return a store', async () => {
    const storeStored: StoreEntity = lsStores[0];
    const store: StoreEntity = await service.findOne(storeStored.id);
    expect(store).not.toBeNull();
    expect(store.id).toEqual(storeStored.id);
    expect(store.name).toEqual(storeStored.name);
    expect(store.city).toEqual(storeStored.city);
    expect(store.address).toEqual(storeStored.address);
  });

  it('findOne throw an exception for invalid store', async () => {
    await expect(
        service.findOne("0")
    ).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('create should create a new store', async () => {
    const store: StoreEntity = {
        id: "",
        name: faker.lorem.sentence(),
        city: faker.lorem.word(3).toUpperCase(),
        address: faker.lorem.sentence(),
        products: []
    };

    const newStore: StoreEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const storeStored: StoreEntity = await service.findOne(newStore.id);
    expect(storeStored).not.toBeNull();

    expect(storeStored.id).toEqual(newStore.id);
    expect(storeStored.name).toEqual(newStore.name);
    expect(storeStored.city).toEqual(newStore.city);
    expect(storeStored.address).toEqual(newStore.address);
  });

  it('create throw an exception for invalid city', async () => {
    const store: StoreEntity = {
        id: "",
        name: faker.lorem.sentence(),
        city: faker.lorem.word(10).toUpperCase(),
        address: faker.lorem.sentence(),
        products: []
    };

    await expect(
        service.create(store)
    ).rejects.toHaveProperty("message", "The city is invalid")
  });

  it('update should modify a product', async () => {
    const store: StoreEntity = lsStores[0];
    store.name = "New name";
    store.city = "ABC";
    store.address = "New Address";

    const productUpdated: StoreEntity = await service.update(store.id, store);
    expect(productUpdated).not.toBeNull();

    const storeStored: StoreEntity = await service.findOne(store.id);
    expect(storeStored).not.toBeNull();

    expect(storeStored.id).toEqual(store.id);
    expect(storeStored.name).toEqual(store.name);
    expect(storeStored.city).toEqual(store.city);
    expect(storeStored.address).toEqual(store.address);
  });

  it('update throw an exception for invalid store', async () => {
    const store: StoreEntity = lsStores[0];
    store.name = faker.lorem.sentence(),
    store.city = faker.lorem.word(3).toUpperCase(),
    store.address = faker.lorem.sentence()

    await expect(
        service.update("0", store)
    ).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('delete shouod remove a store', async () => {
    const store: StoreEntity = lsStores[0];
    await service.delete(store.id);
  
    const storeDeleted: StoreEntity = await repository.findOne({ where: { id: store.id } })
    expect(storeDeleted).toBeNull();
  });

  it('delete throw an exception for invalid product', async () => {
    await expect(
        service.delete("0")
    ).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

});
