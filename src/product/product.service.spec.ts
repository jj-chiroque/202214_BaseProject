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

  it('findAll deberia retornar todos los productos', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(lsProduct.length);
  });

  it('findOne deberia retornar un product', async () => {
    const productStored: ProductEntity = lsProduct[0];
    const product: ProductEntity = await service.findOne(productStored.id);
    expect(product).not.toBeNull();
    expect(product.id).toEqual(productStored.id);
    expect(product.name).toEqual(productStored.name);
    expect(product.price).toEqual(productStored.price);
    expect(product.product_type).toEqual(productStored.product_type);
  });

  it('findOne deberia arrojar una excepcion por un producto invalido', async () => {
    await expect(
        service.findOne("0")
    ).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado")
  });

});
