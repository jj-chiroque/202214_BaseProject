import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let lsProduct: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    lsProduct = [];

    for (let i = 0; i < 5; i++) {
        const product = await repository.save({
            name: faker.lorem.sentence(),
            price: faker.datatype.number({ min: 10, max: 100, precision: 0.01}),
            product_type: faker.helpers.arrayElement(['Perecedero', 'No perecedero'])
        });
        lsProduct.push(product);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(lsProduct.length);
  });

  it('findOne should return a product', async () => {
    const productStored: ProductEntity = lsProduct[0];
    const product: ProductEntity = await service.findOne(productStored.id);
    expect(product).not.toBeNull();
    expect(product.id).toEqual(productStored.id);
    expect(product.name).toEqual(productStored.name);
    expect(product.price).toEqual(productStored.price);
    expect(product.product_type).toEqual(productStored.product_type);
  });

  it('findOne throw an exception for invalid product', async () => {
    await expect(
        service.findOne("0")
    ).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('create should create a new product', async () => {
    const product: ProductEntity = {
        id: "",
        name: faker.lorem.sentence(),
        price: faker.datatype.number({ min: 10, max: 100, precision: 0.01}),
        product_type: faker.helpers.arrayElement(['Perecedero', 'No perecedero']),
        stores: []
    };

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const productStored: ProductEntity = await service.findOne(newProduct.id);
    expect(productStored).not.toBeNull();

    expect(productStored.id).toEqual(newProduct.id);
    expect(productStored.name).toEqual(newProduct.name);
    expect(productStored.price).toEqual(newProduct.price);
    expect(productStored.product_type).toEqual(newProduct.product_type);

  });

  it('create throw an exception for invalid product type', async () => {
    const product: ProductEntity = {
        id: "",
        name: faker.lorem.sentence(),
        price: faker.datatype.number({ min: 10, max: 100, precision: 0.01}),
        product_type: faker.lorem.word(),
        stores: []
    };

    await expect(
        service.create(product)
    ).rejects.toHaveProperty("message", "The product type is invalid")

  });

  it('update should modify a product', async () => {
    const product: ProductEntity = lsProduct[0];
    product.name = "New name";
    product.price = 1.23;
    product.product_type = (product.product_type == "Perecedero" ? "No perecedero" : "Perecedero");

    const productUpdated: ProductEntity = await service.update(product.id, product);
    expect(productUpdated).not.toBeNull();

    const productStored: ProductEntity = await service.findOne(product.id);
    expect(productStored).not.toBeNull();

    expect(productStored.id).toEqual(product.id);
    expect(productStored.name).toEqual(product.name);
    expect(productStored.price).toEqual(product.price);
    expect(productStored.product_type).toEqual(product.product_type);

  });

  it('update throw an exception for invalid product', async () => {
    const product: ProductEntity = lsProduct[0];
    product.name = "New name";
    product.price = 1.23;
    product.product_type = (product.product_type == "Perecedero" ? "No perecedero" : "Perecedero");

    await expect(
        service.update("0", product)
    ).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('delete shouod remove a product', async () => {
    const product: ProductEntity = lsProduct[0];
    await service.delete(product.id);
  
    const productDeleted: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(productDeleted).toBeNull();
  });

  it('delete throw an exception for invalid product', async () => {
    await expect(
        service.delete("0")
    ).rejects.toHaveProperty("message", "The product with the given id was not found")
    
  });

});
