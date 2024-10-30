import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from 'src/modules/products/products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/modules/products/products.model';
import { NotFoundException } from 'src/common/exceptions/NotFoundException';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/modules/products/products.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<Product>;

  const mockProduct = {
    _id: '507f191e810c19729de860ea',
    name: 'Sample Product',
    price: 100,
    save: jest.fn(),
    set: jest.fn(),
  };

  const mockProductModel = {
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockProduct]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProduct),
    }),
    create: jest.fn().mockResolvedValue(mockProduct),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<Product>>(getModelToken('Product'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should return a paginated list of products', async () => {
      const paginationDto: PaginationDto = {
        limit: 5,
        page: 1,
        sort: 'name:asc',
      };
      const result = await service.search(paginationDto);

      expect(result).toEqual([mockProduct]);
      expect(model.find).toHaveBeenCalledTimes(1);
      expect(model.find().skip).toHaveBeenCalledWith(0);
      expect(model.find().limit).toHaveBeenCalledWith(5);
      expect(model.find().sort).toHaveBeenCalledWith({ name: 1 });
    });
  });

  describe('find', () => {
    it('should return a product by id', async () => {
      const result = await service.find('507f191e810c19729de860ea');
      expect(result).toEqual(mockProduct);
      expect(model.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
    });

    it('should throw NotFoundException if product is not found', async () => {
      model.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.find('nonexistentId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        price: 200,
      };
      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(model.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      service.find = jest.fn().mockResolvedValue(mockProduct);

      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 300,
      };

      mockProduct.save = jest.fn().mockResolvedValue(mockProduct);

      const result = await service.update(
        '507f191e810c19729de860ea',
        updateProductDto,
      );

      expect(result).toEqual(mockProduct);
      expect(mockProduct.set).toHaveBeenCalledWith(updateProductDto);
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product is not found', async () => {
      service.find = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Not found'));

      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 300,
      };

      await expect(service.update('nonexistentId', updateProductDto))
        .rejects.toThrow(NotFoundException)
        .catch((e) => {
          expect(e.message).toBe('Not found');
        });
    });
  });

  describe('delete', () => {
    it('should delete a product and return true if deleted', async () => {
      const result = await service.delete('507f191e810c19729de860ea');

      expect(result).toBe(true);
      expect(model.deleteOne).toHaveBeenCalledWith({
        _id: '507f191e810c19729de860ea',
      });
    });

    it('should return false if product was not deleted', async () => {
      model.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });
      const result = await service.delete('nonexistentId');

      expect(result).toBe(false);
    });
  });
});
