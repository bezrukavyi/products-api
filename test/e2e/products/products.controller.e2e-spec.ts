import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from 'src/modules/products/products.controller';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductSchema } from 'src/modules/products/products.model';
import { ProductSeeder } from 'src/database/seeds/products.seeder';
import { PermissionsGuard } from 'src/common/guards/Permissions.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { rootMongooseTestModule } from '../../utils/mongoose-test-utils';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productSeeder: ProductSeeder;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
      ],
      controllers: [ProductsController],
      providers: [ProductsService, ProductSeeder],
    })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    productsController = module.get<ProductsController>(ProductsController);
    productSeeder = module.get<ProductSeeder>(ProductSeeder);
  });

  beforeEach(async () => {
    await productSeeder.seed();
  });

  it('should return a list of products', async () => {
    const products = await productsController.index({ limit: 5, page: 1 });
    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBeGreaterThan(0);
  });

  it('should return a single product by ID', async () => {
    const seededProducts = await productsController.index({
      limit: 1,
      page: 1,
    });

    const productId = seededProducts[0].id;
    const product = await productsController.show(productId);

    expect(product).toBeDefined();
    expect(product.id).toEqual(productId);
  });

  it('should create a new product', async () => {
    const newProduct = { name: 'Test Product', price: 999 };
    const product = await productsController.create(newProduct);

    expect(product).toBeDefined();
    expect(product.name).toEqual(newProduct.name);
    expect(product.price).toEqual(newProduct.price);
  });

  it('should update an existing product', async () => {
    const seededProducts = await productsController.index({
      limit: 1,
      page: 1,
    });
    const productId = seededProducts[0].id;

    const updateData = { name: 'Updated Product', price: 1500 };
    const updatedProduct = await productsController.update(
      productId,
      updateData,
    );

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.name).toEqual(updateData.name);
    expect(updatedProduct.price).toEqual(updateData.price);
  });

  it('should delete a product by ID', async () => {
    const seededProducts = await productsController.index({
      limit: 1,
      page: 1,
    });

    const productId = seededProducts[0].id;

    const result = await productsController.delete(productId);
    expect(result).toBe(true);

    await expect(productsController.show(productId)).rejects.toThrow();
  });
});
