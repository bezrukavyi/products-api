import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from 'src/app.module';
import { SeederModule } from 'src/database/seeds/seeder.module';
import { JwtService } from 'src/common/services/jwt.service';
import { CreateProductDto, UpdateProductDto } from 'src/modules/products/products.dto';
import { rootMongooseTestModule } from '../../utils/mongoose-test-utils';
import { ProductsSeeder } from 'src/database/seeds/products.seeder';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let productsSeeder: ProductsSeeder;
  let readOnlyToken: string;
  let readWriteToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SeederModule, rootMongooseTestModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    productsSeeder = moduleFixture.get<ProductsSeeder>(ProductsSeeder);

    readOnlyToken = jwtService.generateToken({ permission: 'readOnly' });
    readWriteToken = jwtService.generateToken({ permission: 'readWrite' });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await productsSeeder.drop();
  });

  afterEach(async () => {
    await productsSeeder.drop();
  });

  describe('Receive products list', () => {
    beforeEach(async () => {
      await productsSeeder.seed([
        { name: 'Product 1', price: 600 },
        { name: 'Product 2', price: 500 },
        { name: 'Product 3', price: 400 },
        { name: 'Product 4', price: 300 },
        { name: 'Product 5', price: 200 },
        { name: 'Product 6', price: 100 },
      ]);
    });

    it('should return a list of products for a read-only user', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(6);
      expect(response.body).toEqual([
        expect.objectContaining({ name: 'Product 1', price: 600 }),
        expect.objectContaining({ name: 'Product 2', price: 500 }),
        expect.objectContaining({ name: 'Product 3', price: 400 }),
        expect.objectContaining({ name: 'Product 4', price: 300 }),
        expect.objectContaining({ name: 'Product 5', price: 200 }),
        expect.objectContaining({ name: 'Product 6', price: 100 }),
      ]);
    });

    describe('Pagination and sort', () => {
      it('should return a sorted list', async () => {
        const response = await supertest(app.getHttpServer())
          .get('/products?&sort=name:desc')
          .set('Authorization', `Bearer ${readOnlyToken}`)
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(6);
        expect(response.body).toEqual([
          expect.objectContaining({ name: 'Product 6', price: 100 }),
          expect.objectContaining({ name: 'Product 5', price: 200 }),
          expect.objectContaining({ name: 'Product 4', price: 300 }),
          expect.objectContaining({ name: 'Product 3', price: 400 }),
          expect.objectContaining({ name: 'Product 2', price: 500 }),
          expect.objectContaining({ name: 'Product 1', price: 600 }),
        ]);
      });

      it('should return a sorted and paginated list', async () => {
        const response = await supertest(app.getHttpServer())
          .get('/products?limit=2&page=3&sort=price:desc&sort=price:asc')
          .set('Authorization', `Bearer ${readOnlyToken}`)
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual([
          expect.objectContaining({ name: 'Product 2', price: 500 }),
          expect.objectContaining({ name: 'Product 1', price: 600 }),
        ]);
      });
    });

    it('should return 401 Unauthorized for listing products', async () => {
      await supertest(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer invalidToken`)
        .expect(401);
    });
  });

  describe('Receive product record', () => {
    it('should return a single product by ID for a read-only user', async () => {
      const productId = '6720eaf325945d942039adf7';

      await productsSeeder.seed([{ _id: productId, name: 'Test Product', price: 600 }]);

      const response = await supertest(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('name', 'Test Product');
    });
  });

  describe('Create product record', () => {
    const newProduct: CreateProductDto = { name: 'New Product', price: 150 };

    it('should create a new product for a read-write user', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${readWriteToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('name', newProduct.name);
      expect(response.body).toHaveProperty('price', newProduct.price);

      const id = response.body.id;

      const getResponse = await supertest(app.getHttpServer())
        .get(`/products/${id}`)
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(200);

      expect(getResponse.body).toHaveProperty('id', id);
      expect(getResponse.body).toHaveProperty('name', newProduct.name);
    });

    it('should return 403 Forbidden for listing products', async () => {
      await supertest(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .send(newProduct)
        .expect(403);
    });
  });

  describe('Update product record', () => {
    const updateData: UpdateProductDto = { name: 'Updated Product', price: 200 };

    it('should update an existing product for a read-write user', async () => {
      const createResponse = await supertest(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${readWriteToken}`)
        .send({ name: 'Update Test', price: 100 })
        .expect(201);

      const productId = createResponse.body.id;

      const response = await supertest(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${readWriteToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('price', updateData.price);
    });

    it('should return 403 Forbidden for listing products', async () => {
      await supertest(app.getHttpServer())
        .patch(`/products/6720eaf325945d942039adf7`)
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .send(updateData)
        .expect(403);
    });
  });

  describe('Delete product record', () => {
    it('should delete a product by ID for a read-write user', async () => {
      const createResponse = await supertest(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${readWriteToken}`)
        .send({ name: 'Delete Test', price: 50 })
        .expect(201);

      const productId = createResponse.body.id;

      await supertest(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${readWriteToken}`)
        .expect(200);

      await supertest(app.getHttpServer())
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(404);
    });

    it('should return 403 Forbidden for listing products', async () => {
      await supertest(app.getHttpServer())
        .delete(`/products/6720eaf325945d942039adf7`)
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(403);
    });
  });
});
