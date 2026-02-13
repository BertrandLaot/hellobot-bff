import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { ProductWithModulesDto } from './dto/product-with-modules.dto';
import { ProductLinksAndOnboardingDto } from './dto/product-links-onboarding.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findOne: jest.fn(),
    findOneWithModules: jest.fn(),
    findLinksAndOnboarding: jest.fn(),
  };

  const mockProduct: ProductDto = {
    _id: 'product-1',
    name: 'Test Product',
    description: 'Test description',
  } as ProductDto;

  const mockProductWithModules: ProductWithModulesDto = {
    product: mockProduct,
    modules: [
      { _id: 'module-1', title: 'Module 1', type: 'video' },
      { _id: 'module-2', title: 'Module 2', type: 'article' },
    ],
  } as ProductWithModulesDto;

  const mockLinksAndOnboarding: ProductLinksAndOnboardingDto = {
    links: [{ label: 'Doc', url: 'https://example.com' }],
    onboardingModule: { 
      _id: 'onboarding-1', 
      title: 'Getting Started',
      name: 'Getting Started',
      type: 'guideline',
    },
  } as ProductLinksAndOnboardingDto;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('product-1');

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('product-1');
    });

    it('should propagate NotFoundException from service', async () => {
      mockProductsService.findOne.mockRejectedValue(
        new NotFoundException('Product with ID non-existent not found'),
      );

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call service with correct parameter', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      await controller.findOne('test-id');

      expect(service.findOne).toHaveBeenCalledWith('test-id');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneWithModules', () => {
    it('should return product with modules', async () => {
      mockProductsService.findOneWithModules.mockResolvedValue(
        mockProductWithModules,
      );

      const result = await controller.findOneWithModules('product-1');

      expect(result).toEqual(mockProductWithModules);
      expect(service.findOneWithModules).toHaveBeenCalledWith('product-1');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      mockProductsService.findOneWithModules.mockRejectedValue(error);

      await expect(controller.findOneWithModules('product-1')).rejects.toThrow(
        'Service error',
      );
    });

    it('should call service with correct parameter', async () => {
      mockProductsService.findOneWithModules.mockResolvedValue(
        mockProductWithModules,
      );

      await controller.findOneWithModules('test-product-id');

      expect(service.findOneWithModules).toHaveBeenCalledWith('test-product-id');
      expect(service.findOneWithModules).toHaveBeenCalledTimes(1);
    });
  });

  describe('findLinksAndOnboarding', () => {
    it('should return links and onboarding module', async () => {
      mockProductsService.findLinksAndOnboarding.mockResolvedValue(
        mockLinksAndOnboarding,
      );

      const result = await controller.findLinksAndOnboarding('product-1');

      expect(result).toEqual(mockLinksAndOnboarding);
      expect(service.findLinksAndOnboarding).toHaveBeenCalledWith('product-1');
    });

    it('should propagate NotFoundException from service', async () => {
      mockProductsService.findLinksAndOnboarding.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.findLinksAndOnboarding('non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle empty links array', async () => {
      const emptyLinks = {
        links: [],
        onboardingModule: mockLinksAndOnboarding.onboardingModule,
      };
      mockProductsService.findLinksAndOnboarding.mockResolvedValue(emptyLinks);

      const result = await controller.findLinksAndOnboarding('product-1');

      expect(result.links).toEqual([]);
      expect(result.onboardingModule).toBeDefined();
    });
  });
});
